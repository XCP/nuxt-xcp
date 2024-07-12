import { kv } from '@vercel/kv'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { key, value, ttl } = query

    if (value) {
      // Write data to cache
      await kv.set(key, { value, timestamp: Date.now(), ttl: parseInt(ttl, 10) })
      return { success: true, message: `Cached data for key: ${key}` }
    }
    else {
      // Read data from cache
      const cachedData = await kv.get(key)
      if (cachedData && Date.now() - cachedData.timestamp < cachedData.ttl * 1000) {
        return { success: true, data: cachedData.value }
      }
      else {
        return { success: false, message: 'Cache miss or expired' }
      }
    }
  }
  catch (error) {
    console.error('Error handling cache operation:', error)
    return { success: false, message: 'Internal server error' }
  }
})
