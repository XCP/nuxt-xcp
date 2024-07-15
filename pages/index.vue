<template>
  <div>
    <IndexHeader />

    <div class="my-6">
      <NavigationTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />

      <!-- Tab content -->
      <div v-if="activeTab === 'Assets'">
        <AssetsTable />
      </div>
      <div v-if="activeTab === 'Blocks'">
        <BlocksTable />
      </div>
      <div v-if="activeTab === 'Transactions'">
        <TransactionsTable />
      </div>
      <div v-if="activeTab === 'Orders'">
        <OrdersTable />
      </div>
      <div v-if="activeTab === 'Bets'">
        <BetsTable />
      </div>
      <div v-if="activeTab === 'Burns'">
        <BurnsTable />
      </div>
      <div v-if="activeTab === 'Dispensers'">
        <DispensersTable />
      </div>
      <div v-if="activeTab === 'Dividends'">
        <DividendsTable />
      </div>
      <div v-if="activeTab === 'Events'">
        <EventsTable />
      </div>
      <div v-if="activeTab === 'Dispenses'">
        <DispensesTable />
      </div>
      <div v-if="activeTab === 'Sends'">
        <SendsTable />
      </div>
      <div v-if="activeTab === 'Issuances'">
        <IssuancesTable />
      </div>
      <div v-if="activeTab === 'Sweeps'">
        <SweepsTable />
      </div>
      <div v-if="activeTab === 'Broadcasts'">
        <BroadcastsTable />
      </div>
    </div>
  </div>
</template>

<script setup>
// Tab navigation
const tabs = [
  { name: 'Blocks', hash: 'blocks' },
  { name: 'Events', hash: 'events' },
  { name: 'Assets', hash: 'assets' },
  { name: 'Issuances', hash: 'issuances' },
  { name: 'Dividends', hash: 'dividends' },
  { name: 'Sends', hash: 'sends' },
  { name: 'Orders', hash: 'orders' },
  { name: 'Dispensers', hash: 'dispensers' },
  { name: 'Dispenses', hash: 'dispenses' },
  { name: 'Broadcasts', hash: 'broadcasts' },
  { name: 'Bets', hash: 'bets' },
  { name: 'Burns', hash: 'burns' },
  { name: 'Sweeps', hash: 'sweeps' },
  { name: 'Transactions', hash: 'transactions' },
]
const { activeTab, handleTabChange } = useTabs('Assets', tabs)

// SEO
useSeoMeta({
  title: `Counterparty Explorer`,
  ogTitle: `Counterparty Explorer`,
  description: 'Explore detailed information about Counterparty.',
  ogDescription: 'Detailed insights into Counterparty.',
  ogImage: 'https://api.xcp.io/img/full/default.png',
  twitterCard: 'summary_large_image',
})
</script>
