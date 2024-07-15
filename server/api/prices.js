// server/api/prices.js
import { defineEventHandler } from 'h3'
import { kv } from '@vercel/kv'

const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,counterparty&vs_currencies=usd&include_24hr_change=true'
const CACHE_KEY = 'prices'
const CACHE_TTL = 300 // 5 minutes in seconds

export default defineEventHandler(async () => {
  try {
    // Check if the data is already cached
    const cachedData = await kv.get(CACHE_KEY)
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL * 1000) {
      return {
        success: true,
        data: JSON.parse(cachedData.value),
      }
    }

    // Fetch data from the API
    const response = await fetch(API_URL, {
      headers: {
        'accept': 'application/json',
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('API Error Response:', errorData)
      throw new Error(errorData || 'Failed to fetch prices')
    }

    const data = await response.json()

    // Cache the fetched data
    await kv.set(CACHE_KEY, JSON.stringify({ value: JSON.stringify(data), timestamp: Date.now() }))

    return {
      success: true,
      data: data,
    }
  }
  catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
})
