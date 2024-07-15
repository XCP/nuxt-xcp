// server/api/prices.js
import { defineEventHandler, getQuery } from 'h3'
import CoinpaprikaAPI from '@coinpaprika/api-nodejs-client'

const client = new CoinpaprikaAPI({
  baseURL: 'https://api-pro.coinpaprika.com',
})

export default defineEventHandler(async (event) => {
  const { coinId } = getQuery(event)
  const apiKey = process.env.COINPAPRIKA_API_KEY

  try {
    const response = await client.getTicker({ coinId, headers: { Authorization: apiKey } })
    console.log('API Response:', response)
    return response
  } catch (error) {
    console.error('API Error:', error)
    return { error: error.message }
  }
})
