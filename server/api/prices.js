import { defineEventHandler, getQuery } from 'h3'
import CoinpaprikaAPI from '@coinpaprika/api-nodejs-client'
import { getCachedData } from '~/utils/getCachedData'

const client = new CoinpaprikaAPI({
  baseURL: 'https://api-pro.coinpaprika.com',
})

export default defineEventHandler(async (event) => {
  const { coinId } = getQuery(event)
  const apiKey = process.env.COINPAPRIKA_API_KEY

  try {
    const ticker = await getCachedData(
      `price_${coinId}`,
      async () => {
        const response = await client.getTicker({ coinId, headers: { Authorization: apiKey } })
        return response
      },
      30, // Cache TTL in seconds
    )
    return ticker
  }
  catch (error) {
    return { error: error.message }
  }
})
