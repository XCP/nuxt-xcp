import { defineEventHandler } from 'h3';
import { getCachedData } from '~/utils/getCachedData';

const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,counterparty&vs_currencies=usd&include_24hr_change=true';

const fetchPrices = async () => {
  const response = await fetch(API_URL, {
    headers: {
      'accept': 'application/json',
      'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
    }
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch prices');
  }

  return data;
};

export default defineEventHandler(async (event) => {
  try {
    const data = await getCachedData('prices', fetchPrices, 60);
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});
