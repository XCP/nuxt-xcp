<template>
  <AddressHeader :address="address" :apiData="apiData" />

  <header class="my-6">
    <!-- Heading -->
    <div v-if="lastMessage" class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
      <div>
        <div class="flex items-center gap-x-3">
          <div :class="[isActive && !isSweep ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400', 'flex-none rounded-full p-1']">
            <div class="h-2 w-2 rounded-full bg-current" />
          </div>
          <h2 class="flex gap-x-3 text-base leading-7">
            <span class="font-semibold text-white">{{ isActive && !isSweep ? 'Active Address' : 'Inactive Address' }}</span>
          </h2>
        </div>
        <p class="mt-2 text-xs leading-6 text-gray-400">
          <template v-if="isSweep">This Counterparty address was sweeped{{ isActive ? '' : ` ${yearAgo} years ago.` }}.</template>
          <template v-else-if="isActive">At least one Counterparty transaction in the past year.</template>
          <template v-else>The last Counterparty transaction was {{ yearsAgo }} years ago.</template>
        </p>
      </div>
      <div class="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">What's this?</div>
    </div>
  </header>

  <div class="my-6">
    <Tabs :tabs="tabs" :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Tab content -->
    <div v-if="activeTab === 'Activity'">
      <ActivityTable :address="address" @last-message="handleLastMessage" />
    </div>
    <div v-if="activeTab === 'Assets'">
      <AssetsTable :address="address" />
    </div>
    <div v-if="activeTab === 'Balances'">
      <BalancesTable :address="address" />
    </div>
    <div v-if="activeTab === 'Credits'">
      <CreditsTable :address="address" category="credits" />
    </div>
    <div v-if="activeTab === 'Debits'">
      <DebitsTable :address="address" category="debits" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed, ref, watchEffect, onMounted } from 'vue';

// Reactive state
const route = useRoute();
const address = ref(route.params.address);
const apiData = ref({ tx_count: 0, btcValue: 0, xcpValue: 0 });
const activeTab = ref('Activity');
const lastMessage = ref(null);

// Tab navigation
const tabs = [
  { name: 'Activity' },
  { name: 'Assets' },
  { name: 'Balances' },
  { name: 'Credits' },
  { name: 'Debits' },
];

const isActive = computed(() => {
  if (!lastMessage.value) return false;
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return new Date(lastMessage.value.timestamp * 1000) >= oneYearAgo;
});

const isSweep = computed(() => lastMessage.value?.category === 'sweeps');

const yearsAgo = computed(() => {
  if (!lastMessage.value) return 0;
  const currentDate = new Date();
  const messageDate = new Date(lastMessage.value.timestamp * 1000);
  return currentDate.getFullYear() - messageDate.getFullYear();
});

// API call
const fetchData = async () => {
  try {
    const btcResponse = await fetch(`https://blockstream.info/api/address/${address.value}`);
    const xcpResponse = await fetch(`https://api.xcp.io/api/balance?address=${address.value}`);
    if (!btcResponse.ok || !xcpResponse.ok) throw new Error('Network response was not ok');

    const btcData = await btcResponse.json();
    const xcpData = await xcpResponse.json();

    apiData.value = {
      tx_count: btcData.chain_stats.tx_count.toLocaleString(),
      btcValue: formatBalance(btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum, { divisible: true }).replace('.00000000', ''),
      xcpValue: xcpData?.length ? formatBalance(xcpData[0].quantity, { divisible: true }).replace('.00000000', '') : '0'
    };
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

// Event handlers
const handleTabChange = selectedTab => activeTab.value = selectedTab;
const handleLastMessage = message => lastMessage.value = message;

// Watchers and lifecycle hooks
watchEffect(() => address.value = route.params.address);
onMounted(fetchData);

// SEO
useSeoMeta({
  title: address.value,
  ogTitle: address.value,
  description: 'Explore detailed information about Counterparty addresses.',
  ogDescription: 'Detailed insights into Counterparty addresses and their activities.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
});
</script>
