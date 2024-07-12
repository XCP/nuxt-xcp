<template>
  <BlockHeader :block-index="blockIndex" />

  <div class="my-6">
    <Tabs :tabs="tabs" :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Tab content -->
    <div v-if="activeTab === 'Transactions'">
      <TransactionsTable :block-index="blockIndex" />
    </div>
    <div v-if="activeTab === 'Events'">
      <EventsTable :block-index="blockIndex" />
    </div>
    <div v-if="activeTab === 'Credits'">
      <CreditsTable :block-index="blockIndex" />
    </div>
    <div v-if="activeTab === 'Debits'">
      <DebitsTable :block-index="blockIndex" />
    </div>
    <div v-if="activeTab === 'Expirations'">
      <ExpirationsTable :block-index="blockIndex" />
    </div>
    <div v-if="activeTab === 'Cancels'">
      <CancelsTable :block-index="blockIndex" />
    </div>
    <div v-if="activeTab === 'Destructions'">
      <DestructionsTable :block-index="blockIndex" />
    </div>
    <div v-if="activeTab === 'Issuances'">
      <IssuancesTable :block-index="blockIndex" />
    </div>
    <div v-if="activeTab === 'Sends'">
      <SendsTable :block-index="blockIndex" />
    </div>
    <div v-if="activeTab === 'Dispenses'">
      <DispensesTable :block-index="blockIndex" />
    </div>
    <div v-if="activeTab === 'Sweeps'">
      <SweepsTable :block-index="blockIndex" />
    </div>
</div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watchEffect, computed } from 'vue';

// Reactive state
const route = useRoute();
const router = useRouter();
const blockIndex = ref(route.params.blockIndex);

// Tab navigation
const tabs = [
  { name: 'Transactions', hash: 'transactions' },
  { name: 'Events', hash: 'events' },
  { name: 'Credits', hash: 'credits' },
  { name: 'Debits', hash: 'debits' },
  { name: 'Expirations', hash: 'expirations' },
  { name: 'Cancels', hash: 'cancels' },
  { name: 'Destructions', hash: 'destructions' },
  { name: 'Issuances', hash: 'issuances' },
  { name: 'Sends', hash: 'sends' },
  { name: 'Dispenses', hash: 'dispenses' },
  { name: 'Sweeps', hash: 'sweeps' },
];
const { activeTab, handleTabChange } = useTabs('Balances', tabs);

// Watchers and lifecycle hooks
watchEffect(() => blockIndex.value = route.params.blockIndex);

// SEO
useSeoMeta({
  title: blockIndex.value,
  ogTitle: blockIndex.value,
  description: 'Explore detailed information about Counterparty block.',
  ogDescription: 'Detailed insights into Counterparty block and their activities.',
  ogImage: 'https://api.xcp.io/img/full/default.png',
  twitterCard: 'summary_large_image',
});
</script>
