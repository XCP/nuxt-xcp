<template>
  <AddressHeader :address="address" :apiData="apiData" />

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
const router = useRouter();
const address = ref(route.params.address);
const apiData = ref({ tx_count: 0, btcValue: 0, xcpValue: 0 });
const lastMessage = ref(null);

// Tab navigation
const tabs = [
  { name: 'Activity', hash: 'activity' },
  { name: 'Assets', hash: 'assets' },
  { name: 'Balances', hash: 'balances' },
  { name: 'Credits', hash: 'credits' },
  { name: 'Debits', hash: 'debits' },
];
const { activeTab, handleTabChange } = useTabs('Activity', tabs);

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
    const btcData = await $fetch(`https://blockstream.info/api/address/${address.value}`);
    const xcpData = await $fetch(`https://api.xcp.io/api/v1/balance?address=${address.value}`);

    apiData.value = {
      tx_count: btcData.chain_stats.tx_count.toLocaleString(),
      btcValue: formatBalance(btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum, { divisible: true }).replace('.00000000', ''),
      xcpValue: formatBalance(xcpData[0].quantity, { divisible: true }).replace('.00000000', '')
    };
  } catch (e) {
    console.error('Fetch error:', e);
    // Handle fetch error, optionally redirect to an error page
  }
};

// Event handlers
const handleLastMessage = message => {
  if (lastMessage.value === null) {
    lastMessage.value = message;
  }
};

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
