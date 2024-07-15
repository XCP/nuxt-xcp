<template>
  <div>
    <AssetHeader
      :asset-name="assetName"
    />

    <div class="my-6">
      <NavigationTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />

      <!-- Tab content -->
      <div v-if="activeTab === 'Balances'">
        <BalancesTable :asset-name="assetName" />
      </div>
      <div v-if="activeTab === 'Credits'">
        <CreditsTable :asset-name="assetName" />
      </div>
      <div v-if="activeTab === 'Debits'">
        <DebitsTable :asset-name="assetName" />
      </div>
      <div v-if="activeTab === 'Sends'">
        <SendsTable :asset-name="assetName" />
      </div>
      <div v-if="activeTab === 'Dispensers'">
        <DispensersTable :asset-name="assetName" />
      </div>
      <div v-if="activeTab === 'Dispenses'">
        <DispensesTable :asset-name="assetName" />
      </div>
      <div v-if="activeTab === 'Orders'">
        <OrdersTable :asset-name="assetName" />
      </div>
      <div v-if="activeTab === 'Dividends'">
        <DividendsTable :asset-name="assetName" />
      </div>
      <div v-if="activeTab === 'Issuances'">
        <IssuancesTable :asset-name="assetName" />
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
