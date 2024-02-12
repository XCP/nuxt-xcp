<template>
  <div class="dark:bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white max-w-md m-auto">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold mb-4">What's up Party People?</h1>
      <p class="mb-4 italic">Last Updated: February 12th, 2024</p>
      <p class="mb-4">If you found this website useful and would like to support its ongoing operations you can become a "Blockchain Patron."</p>
      <p class="mb-8">Your small contribution will help offset the cost of hosting and keep the developer well-caffeinated. ☕</p>
      <div class="text-center mb-8">
        <h2 class="text-2xl font-semibold">Send Funds to this Address</h2>
        <p class="mt-2">1DPPDehtoLLjhXKHibfC3iJVSqwCooivUX</p>
      </div>
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-2">Monthly Hosting Expenses</h2>
        <p>Google Cloud (c3-standard-4): $284/mo - 16GB / 1024GB Disk</p>
        <p>Digital Ocean: $96/mo - 16GB / 320GB Disk</p>
        <p>Vercel: $20/mo - 1 Team Member</p>
        <p class="mt-1 font-medium">Total: $400 per month</p>
        <p class="mt-1"><a href="https://app.usefathom.com/share/fvfgofsg/xcp-io" target="_blank" class="font-medium hover:underline">Review Web Analytics</a></p>
      </div>
      <div>
        <h2 class="text-2xl font-semibold mb-2">How Far Your Sats Can Go</h2>
        <table class="table-auto border-collapse border border-green-800 w-72 mx-auto">
          <thead>
            <tr>
              <th class="border border-green-600">Uptime</th>
              <th class="border border-green-600">BTC Needed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-green-600">1 Day</td>
              <td class="border border-green-600">{{ btcForDay }}</td>
            </tr>
            <tr>
              <td class="border border-green-600">1 Week</td>
              <td class="border border-green-600">{{ btcForWeek }}</td>
            </tr>
            <tr>
              <td class="border border-green-600">1 Month</td>
              <td class="border border-green-600">{{ btcForMonth }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="text-center mb-8">
      <h2 class="text-2xl font-semi bold mb-4">Months of Hosting Offset</h2>
      <div class="flex flex-wrap justify-center gap-2">
        <div v-for="n in shownMonths" :key="n" class="w-16 h-16 flex text-center justify-center items-center text-sm rounded-lg" :class="n <= fundedMonths ? 'bg-green-600' : 'bg-transparent border-2 border-green-600'" v-html="monthIndexToMonth(n - 1)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const totalMonthlyExpenses = 284 + 96 + 20; // Total expenses in USD
const btcPrice = ref(0); // Example BTC price in USD
const currentInSats = ref(0);
const currentInBTC = ref(0);

const btcForDay = computed(() => ((totalMonthlyExpenses / 30) / btcPrice.value).toFixed(8));
const btcForWeek = computed(() => ((totalMonthlyExpenses / 4) / btcPrice.value).toFixed(8));
const btcForMonth = computed(() => (totalMonthlyExpenses / btcPrice.value).toFixed(8));

const fundedMonths = computed(() => {
  const totalFundsInUSD = currentInBTC.value * btcPrice.value;
  return Math.floor(totalFundsInUSD / totalMonthlyExpenses);
});

const shownMonths = computed(() => {
  // Ensure at least 48 months are shown
  let baseMonths = 24;

  // If fundedMonths is more than 24, adjust to the closest multiple of 12 above fundedMonths
  if (fundedMonths.value > 24) {
    // Calculate the excess months over 24 and find the next multiple of 12
    let excessMonths = fundedMonths.value - 24;
    let additionalMonths = 12 - (excessMonths % 12);
    baseMonths = fundedMonths.value + (additionalMonths === 12 ? 0 : additionalMonths);
  }

  return baseMonths;
});


async function fetchBalance() {
  const address = '1DPPDehtoLLjhXKHibfC3iJVSqwCooivUX';
  try {
    const response = await fetch(`https://blockstream.info/api/address/${address}`);
    const data = await response.json();
    const balanceInSats = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
    currentInSats.value = balanceInSats;
    currentInBTC.value = (balanceInSats / 100000000).toFixed(8);
  } catch (error) {
    console.error('Failed to fetch balance:', error);
  }
}

async function fetchBTCPrice() {
  // First try Coinbase
  try {
    const coinbaseResponse = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC');
    const coinbaseData = await coinbaseResponse.json();
    const coinbasePrice = coinbaseData.data.rates.USD;
    if (coinbasePrice) {
      btcPrice.value = parseFloat(coinbasePrice);
      return;
    }
  } catch (error) {
    console.error('Failed to fetch from Coinbase:', error);
  }

  // If Coinbase fails, try CoinCap
  try {
    const coincapResponse = await fetch('https://api.coincap.io/v2/assets/bitcoin');
    const coincapData = await coincapResponse.json();
    const coincapPrice = coincapData.data.priceUsd;
    if (coincapPrice) {
      btcPrice.value = parseFloat(coincapPrice);
      return;
    }
  } catch (error) {
    console.error('Failed to fetch from CoinCap:', error);
  }

  // If CoinCap fails, try CoinDesk
  try {
    const coindeskResponse = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
    const coindeskData = await coindeskResponse.json();
    const coindeskPrice = coindeskData.bpi.USD.rate_float;
    if (coindeskPrice) {
      btcPrice.value = coindeskPrice;
      return;
    }
  } catch (error) {
    console.error('Failed to fetch from CoinDesk:', error);
    // If all requests fail, you might want to set a default or show an error
    btcPrice.value = "Error fetching BTC price";
  }
}

onMounted(() => {
  fetchBalance();
  fetchBTCPrice();
});

function monthIndexToMonth(index) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startYear = 2024;
  let yearOffset = Math.floor(index / 12);
  let monthIndex = index % 12;
  return `${months[monthIndex]} <br /> ${startYear + yearOffset}`;
}


</script>
