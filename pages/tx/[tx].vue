<template>
  <div>
    <TxHeader :tx-hash="txHash" />

    <div class="my-6">
      <NavigationTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />

      <!-- Tab content -->
      <div v-if="activeTab === 'UTXOs'">
        <UtxosTable :tx-hash="txHash" />
      </div>
      <div v-if="activeTab === 'Events'">
        <EventsTable :tx-hash="txHash" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const txHash = ref(route.params.tx)

const tabs = [
  { name: 'UTXOs' },
  { name: 'Events' },
]
const { activeTab, handleTabChange } = useTabs('UTXOs', tabs)

// Watchers and lifecycle hooks
watchEffect(() => txHash.value = route.params.tx)

useSeoMeta({
  title: `Transaction: ${txHash.value}`,
  ogTitle: `Transaction: ${txHash.value}`,
  description: 'Explore detailed information about Counterparty txs.',
  ogDescription: 'Detailed insights into Counterparty txs and their activities.',
  ogImage: 'https://app.xcp.io/img/full/default.png',
  twitterCard: 'summary_large_image',
})
</script>
