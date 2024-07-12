<template>
  <AddressHeader :address="address" />

  <div class="my-6">
    <Tabs :tabs="tabs" :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Tab content -->
    <div v-if="activeTab === 'Assets'">
      <AssetsTable :address="address" />
    </div>
    <div v-if="activeTab === 'Balances'">
      <BalancesTable :address="address" />
    </div>
    <div v-if="activeTab === 'Credits'">
      <CreditsTable :address="address" />
    </div>
    <div v-if="activeTab === 'Debits'">
      <DebitsTable :address="address" />
    </div>
    <div v-if="activeTab === 'Broadcasts'">
      <BroadcastsTable :address="address" />
    </div>
    <div v-if="activeTab === 'Burns'">
      <BurnsTable :address="address" />
    </div>
    <div v-if="activeTab === 'Dispensers'">
      <DispensersTable :address="address" />
    </div>
    <div v-if="activeTab === 'Dispenses (+)'">
      <DispensesTable :address="address" type="receives" />
    </div>
    <div v-if="activeTab === 'Dispenses (-)'">
      <DispensesTable :address="address" type="sends" />
    </div>
    <div v-if="activeTab === 'Dividends'">
      <DividendsTable :address="address" />
    </div>
    <div v-if="activeTab === 'Issuances'">
      <IssuancesTable :address="address" />
    </div>
    <div v-if="activeTab === 'Transactions'">
      <TransactionsTable :address="address" />
    </div>
    <div v-if="activeTab === 'Orders'">
      <OrdersTable :address="address" />
    </div>
    <div v-if="activeTab === 'Sends'">
      <SendsTable :address="address" />
    </div>
    <div v-if="activeTab === 'Receives'">
      <ReceivesTable :address="address" />
    </div>
    <div v-if="activeTab === 'Sweeps'">
      <SweepsTable :address="address" />
    </div>
</div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watchEffect, computed } from 'vue';

// Reactive state
const route = useRoute();
const router = useRouter();
const address = ref(route.params.address);

// Tab navigation
const tabs = [
  { name: 'Assets', hash: 'assets' },
  { name: 'Balances', hash: 'balances' },
  { name: 'Credits', hash: 'credits' },
  { name: 'Debits', hash: 'debits' },
  { name: 'Broadcasts', hash: 'broadcasts' },
  { name: 'Burns', hash: 'burns' },
  { name: 'Dispensers', hash: 'dispensers' },
  { name: 'Dispenses (+)', hash: 'dispenses-receives' },
  { name: 'Dispenses (-)', hash: 'dispenses-sends' },
  { name: 'Dividends', hash: 'dividends' },
  { name: 'Issuances', hash: 'issuances' },
  { name: 'Transactions', hash: 'transactions' },
  { name: 'Orders', hash: 'orders' },
  { name: 'Sends', hash: 'sends' },
  { name: 'Receives', hash: 'receives' },
  { name: 'Sweeps', hash: 'sweeps' },
];
const { activeTab, handleTabChange } = useTabs('Balances', tabs);

// Watchers and lifecycle hooks
watchEffect(() => address.value = route.params.address);

// SEO
useSeoMeta({
  title: address.value,
  ogTitle: address.value,
  description: 'Explore detailed information about Counterparty addresses.',
  ogDescription: 'Detailed insights into Counterparty addresses and their activities.',
  ogImage: 'https://api.xcp.io/img/full/default.png',
  twitterCard: 'summary_large_image',
});
</script>
