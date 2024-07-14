<template>
  <div>
    <AddressHeader :address="address" />

    <div class="my-6">
      <NavigationTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />

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
      <div v-if="activeTab === 'Bets'">
        <BetsTable :address="address" />
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
      <div v-if="activeTab === 'Dispenses'">
        <DispensesTable :address="address" />
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
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watchEffect } from 'vue'

// Reactive state
const route = useRoute()
const address = ref(route.params.address)

// Tab navigation
const tabs = [
  { name: 'Assets', hash: 'assets' },
  { name: 'Issuances', hash: 'issuances' },
  { name: 'Dividends', hash: 'dividends' },
  { name: 'Balances', hash: 'balances' },
  { name: 'Credits', hash: 'credits' },
  { name: 'Debits', hash: 'debits' },
  { name: 'Sends', hash: 'sends' },
  { name: 'Receives', hash: 'receives' },
  { name: 'Orders', hash: 'orders' },
  { name: 'Dispensers', hash: 'dispensers' },
  { name: 'Dispenses', hash: 'dispenses' },
  { name: 'Broadcasts', hash: 'broadcasts' },
  { name: 'Bets', hash: 'bets' },
  { name: 'Burns', hash: 'burns' },
  { name: 'Sweeps', hash: 'sweeps' },
  { name: 'Transactions', hash: 'transactions' },
]
const { activeTab, handleTabChange } = useTabs('Balances', tabs)

// Watchers and lifecycle hooks
watchEffect(() => address.value = route.params.address)

// SEO
useSeoMeta({
  title: address.value,
  ogTitle: address.value,
  description: 'Explore detailed information about Counterparty addresses.',
  ogDescription: 'Detailed insights into Counterparty addresses and their activities.',
  ogImage: 'https://api.xcp.io/img/full/default.png',
  twitterCard: 'summary_large_image',
})
</script>
