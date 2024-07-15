<template>
  <div>
    <AssetHeader
      :assetName="assetName"
    />

    <div class="my-6">
      <NavigationTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />

      <!-- Tab content -->
      <div v-if="activeTab === 'Balances'">
        <BalancesTable :assetName="assetName" />
      </div>
      <div v-if="activeTab === 'Credits'">
        <CreditsTable :assetName="assetName" />
      </div>
      <div v-if="activeTab === 'Debits'">
        <DebitsTable :assetName="assetName" />
      </div>
      <div v-if="activeTab === 'Sends'">
        <SendsTable :assetName="assetName" />
      </div>
      <div v-if="activeTab === 'Dispensers'">
        <DispensersTable :assetName="assetName" />
      </div>
      <div v-if="activeTab === 'Dispenses'">
        <DispensesTable :assetName="assetName" />
      </div>
      <div v-if="activeTab === 'Orders'">
        <OrdersTable :assetName="assetName" />
      </div>
      <div v-if="activeTab === 'Dividends'">
        <DividendsTable :assetName="assetName" />
      </div>
      <div v-if="activeTab === 'Issuances'">
        <IssuancesTable :assetName="assetName" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const assetName = ref(route.params.asset)

const tabs = [
  { name: 'Issuances', hash: 'issuances' },
  { name: 'Dividends', hash: 'dividends' },
  { name: 'Balances', hash: 'balances' },
  { name: 'Credits', hash: 'credits' },
  { name: 'Debits', hash: 'debits' },
  { name: 'Sends', hash: 'sends' },
  { name: 'Dispensers', hash: 'dispensers' },
  { name: 'Dispenses', hash: 'dispenses' },
  { name: 'Orders', hash: 'orders' },
]
const { activeTab, handleTabChange } = useTabs('Balances', tabs)

watch(() => route.params.asset, () => {
  assetName.value = route.params.asset
})
</script>
