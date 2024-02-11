<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="min-w-0 flex-1">
      <h1 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Counterparty Address
      </h1>
      <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
        <div class="mt-2 flex items-center text-sm text-gray-300">
          <BriefcaseIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
          {{ address }}
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-300">
          <CurrencyDollarIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
          {{ apiData.bitcoinValue }} BTC
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-300">
          <LinkIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
          {{ apiData.tx_count }} Transactions
        </div>
      </div>
    </div>
    <div class="hidden sm:block mt-5 flex lg:ml-4 lg:mt-0">
      <Dropdown :items="dropdownItems" />
    </div>
  </div>

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
import {
  BriefcaseIcon,
  CurrencyDollarIcon,
  LinkIcon,
} from '@heroicons/vue/20/solid';
import { useRoute } from 'vue-router';
import { computed, ref, watchEffect } from 'vue';

const route = useRoute();
const address = ref(route.params.address);
const apiData = ref({ tx_count: 0, bitcoinValue: 0 });

const dropdownItems = computed(() => [
  {
    href: `https://mempool.space/address/${address.value}`,
    imgSrc: '/img/mempoolspace.png',
    title: 'mempool.space',
  },
  {
    href: `https://pepe.wtf/${address.value}/collection`,
    imgSrc: '/img/pepewtf.png',
    title: 'pepe.wtf',
  },
  {
    href: `https://www.xchain.io/address/${address.value}`,
    imgSrc: '/img/xchainio.png',
    title: 'xchain.io',
  },
  {
    href: `https://www.xcp.dev/address/${address.value}`,
    imgSrc: '/img/xcpdev.png',
    title: 'xcp.dev',
  },
  {
    href: `https://xcp.ninja/profile/${address.value}`,
    imgSrc: '/img/xcpninja.png',
    title: 'xcp.ninja',
  }
]);

const tabs = [
  { name: 'Activity' },
  { name: 'Assets' },
  { name: 'Balances' },
  { name: 'Credits' },
  { name: 'Debits' },
];
const activeTab = ref('Activity');
const lastMessage = ref(null);

const handleTabChange = (selectedTab) => {
  activeTab.value = selectedTab;
};

const handleLastMessage = (message) => {
  lastMessage.value = message;
};

const yearsAgo = computed(() => {
  const currentDate = new Date();
  return lastMessage.value ? currentDate.getFullYear() - new Date(lastMessage.value.timestamp * 1000).getFullYear() : 0;
});

const isActive = computed(() => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return lastMessage.value && new Date(lastMessage.value.timestamp * 1000) >= oneYearAgo;
});

const isSweep = computed(() => {
  return lastMessage.value && lastMessage.value.category === 'sweeps';
});

const fetchData = async () => {
  try {
    const response = await fetch(`https://blockstream.info/api/address/${address.value}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    apiData.value.tx_count = data.chain_stats.tx_count.toLocaleString();
    apiData.value.bitcoinValue = (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

watchEffect(() => {
  address.value = route.params.address;
});

onMounted(() => {
  fetchData();
});

useSeoMeta({
  title: address.value,
  ogTitle: address.value,
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>
