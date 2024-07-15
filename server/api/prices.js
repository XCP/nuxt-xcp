// server/api/prices.js
import { defineEventHandler, getQuery } from 'h3';
import CoinpaprikaAPI from '@coinpaprika/api-nodejs-client';

const client = new CoinpaprikaAPI({
  baseURL: 'https://api-pro.coinpaprika.com/v1',
});

export default defineEventHandler(async (event) => {
  const { coinId } = getQuery(event);
  const apiKey = process.env.COINPAPRIKA_API_KEY;

  try {
    const response = await client.getTicker({ coinId, headers: { Authorization: apiKey } });
    console.log('API Response:', response);

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});
