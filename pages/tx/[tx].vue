<template>
  <TxHeader :tx="tx" :apiData="apiData" />

  <header class="hidden lg:block mt-6 mb-8">
    <!-- Heading -->
    <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
      <div>
        <div class="flex items-center gap-x-3">
          <div v-if="apiData.valid" class="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
            <div class="h-2 w-2 rounded-full bg-current" />
          </div>
          <div v-else class="flex-none rounded-full bg-yellow-400/10 p-1 text-yellow-400">
            <div class="h-2 w-2 rounded-full bg-current" />
          </div>
          <h2 class="flex gap-x-3 text-base leading-7">
            <span class="font-semibold text-lg text-white">{{ apiData.valid ? 'Confirmed Valid' : 'Unconfirmed TX' }}</span>
          </h2>
        </div>
        <p class="mt-2 text-xs leading-6 text-gray-400">{{ timestamp }}</p>
      </div>
      <Badge :category="apiData.type" />
    </div>

    <!-- Stats -->
    <div v-if="apiData.valid" class="grid grid-cols-1 bg-gray-700/10 lg:grid-cols-3">
      <div v-for="(stat, statIdx) in stats" :key="stat.name" :class="[statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '', 'border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
        <p class="text-base font-medium leading-6 text-gray-400">{{ stat.name }}</p>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span class="text-4xl font-semibold tracking-tight text-white">{{ stat.value }}</span>
          <span v-if="stat.unit" class="text-base text-gray-400">{{ stat.unit }}</span>
        </p>
      </div>
    </div>
  </header>

  <div v-if="apiData.valid" class="my-6">
    <Tabs :tabs="tabs" :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Tab content -->
    <div v-if="activeTab === 'Actions'">
      <ActionsTable :tx="tx" />
    </div>
    <div v-if="activeTab === 'Credits'">
      <CreditsTable :tx="tx" category="credits" />
    </div>
    <div v-if="activeTab === 'Debits'">
      <DebitsTable :tx="tx" category="debits" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed, ref, watchEffect } from 'vue';

const route = useRoute();
const tx = ref(route.params.tx);
const apiData = ref({ block_index: 0, tx_index: 0, type: '', valid: 0, source: '', destination: ''});

const blockIndex = computed(() => apiData.value.block_index);
const txIndex = computed(() => apiData.value.tx_index);
const timestamp = computed(() => {
  if (!apiData.value.timestamp) return '';
  // Convert the timestamp from seconds to milliseconds and create a new Date object
  const date = new Date(apiData.value.timestamp * 1000);
  // Format the date as you prefer, here's an example:
  return date.toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
});

const stats = [
  { name: 'Block #', value: blockIndex },
  { name: 'TX Index', value: txIndex },
  { name: 'Time Ago', value: timeAgo(apiData.timestamp) },
]

const tabs = [
  { name: 'Actions' },
  { name: 'Credits' },
  { name: 'Debits' },
];
const activeTab = ref('Actions');

const handleTabChange = (selectedTab) => {
  activeTab.value = selectedTab;
};

const fetchData = async () => {
  try {
    const response = await fetch(`https://api.xcp.io/api/v1/transactions?tx_hash=${tx.value}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    // Handle common fields
    apiData.value.tx_hash = data.tx_hash;
    apiData.value.timestamp = data.timestamp;
    
    // Check for the shape and handle accordingly
    if ('block_index' in data && 'tx_index' in data) {
      // Shape 1
      apiData.value.block_index = data.block_index;
      apiData.value.tx_index = data.tx_index;
      apiData.value.type = data.type;
      apiData.value.source = data.source;
      apiData.value.destination = data.destination;
      apiData.value.valid = data.valid;
    } else if ('bindings' in data) {
      // Shape 2
      apiData.value.block_index = null;
      apiData.value.tx_index = null;
      apiData.value.type = data.category;
      apiData.value.source = data.bindings.source;
      apiData.value.destination = data.bindings.destination;
      apiData.value.valid = 0;
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

watchEffect(() => {
  if (apiData.value.timestamp) {
    const date = new Date(apiData.value.timestamp * 1000);
    const timeAgoValue = timeAgo(date);
    stats.find(stat => stat.name === 'Time Ago').value = timeAgoValue;
  }
});

onMounted(() => {
  fetchData();
});

useSeoMeta({
  title: `Transaction: ${tx.value}`,
  ogTitle: `Transaction: ${tx.value}`,
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>
