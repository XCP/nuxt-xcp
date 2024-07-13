<template>
  <div>
    <AssetHeader
      :asset="asset"
      :api-data="apiData"
      @toggle-modal="toggleModal"
    />

    <div class="my-6">
      <NavigationTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />

      <!-- Tab content -->
      <div v-if="activeTab === 'Balances'">
        <BalancesTable :asset="asset" />
      </div>
      <div v-if="activeTab === 'Credits'">
        <CreditsTable :asset="asset" />
      </div>
      <div v-if="activeTab === 'Debits'">
        <DebitsTable :asset="asset" />
      </div>
      <div v-if="activeTab === 'Sends'">
        <SendsTable :asset="asset" />
      </div>
      <div v-if="activeTab === 'Dispensers'">
        <DispensersTable :asset="asset" />
      </div>
      <div v-if="activeTab === 'Dispenses'">
        <DispensesTable :asset="asset" />
      </div>
      <div v-if="activeTab === 'Orders'">
        <OrdersTable :asset="asset" />
      </div>
      <div v-if="activeTab === 'Dividends'">
        <DividendsTable :asset="asset" />
      </div>
      <div v-if="activeTab === 'Issuances'">
        <IssuancesTable :asset="asset" />
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 overflow-y-auto"
    >
      <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center">
        <div
          class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          @click="toggleModal"
        />
        <!-- Modal Content -->
        <div class="inline-block transform overflow-hidden bg-black rounded-3xl shadow-xl transition-all my-8 align-middle max-w-xl w-full">
          <div class="flex items-start">
            <!-- Here you put the content you want inside the modal, for example, an image -->
            <div class="w-full">
              <!-- Image goes here -->
              <ImageHelper
                :asset="asset"
                :api-data="apiData"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const asset = ref(route.params.asset)
const apiData = ref({})

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

const showModal = ref(false)

const toggleModal = () => {
  showModal.value = !showModal.value
}

const fetchData = async () => {
  try {
    const response = await fetch(`https://api.xcp.io/api/v1/asset?asset=${asset.value}`)
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    apiData.value = data
  }
  catch (error) {
    console.error('Fetch error:', error)
  }
}

onMounted(() => {
  fetchData()
})

watch(() => route.params.asset, () => {
  asset.value = route.params.asset
  fetchData()
})
</script>
