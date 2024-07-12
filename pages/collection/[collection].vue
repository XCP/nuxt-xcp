<template>
  <div>
    <div class="lg:flex lg:items-center lg:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
          {{ apiData.name }}
        </h1>
        <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6" />
      </div>
      <div class="hidden sm:block mt-5 flex lg:ml-4 lg:mt-0" />
    </div>

    <div class="my-6">
      <NavigationTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />

      <!-- Tab content -->
      <div v-if="activeTab === 'Activity'">
        <ActivityTable :collection="collection" />
      </div>
      <div v-if="activeTab === 'Assets'">
        <CollectionTable :collection="collection" />
      </div>
      <div v-if="activeTab === 'Credits'">
        <CreditsTable
          :collection="collection"
          category="credits"
        />
      </div>
      <div v-if="activeTab === 'Debits'">
        <DebitsTable
          :collection="collection"
          category="debits"
        />
      </div>
      <div v-if="activeTab === 'Dispensers'">
        <DispensersTable :collection="collection" />
      </div>
      <div v-if="activeTab === 'Orders'">
        <OrdersTable :collection="collection" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watchEffect } from 'vue'

const route = useRoute()
const collection = ref(route.params.collection)
const apiData = ref({ name: '', link: '', stamp: 0, assets_count: 0 })

const tabs = [
  { name: 'Activity', hash: 'activity' },
  { name: 'Assets', hash: 'assets' },
  { name: 'Dispensers', hash: 'dispensers' },
  { name: 'Orders', hash: 'orders' },
]
const { activeTab, handleTabChange } = useTabs('Assets', tabs)

const fetchData = async () => {
  try {
    const response = await fetch(`https://api.xcp.io/api/v1/tags?slug=${collection.value}`)
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    apiData.value.name = data[0].name
    apiData.value.link = data[0].link
    apiData.value.stamp = data[0].stamp
    apiData.value.assets_count = data[0].assets_count
  }
  catch (error) {
    console.error('Fetch error:', error)
  }
}

watchEffect(() => {
  collection.value = route.params.collection
})

onMounted(() => {
  fetchData()
})

// Using useSeoMeta with reactive data
watchEffect(() => {
  useSeoMeta({
    title: () => apiData.value.name, // Using a function to ensure reactivity
    ogTitle: () => apiData.value.name,
    description: 'Explore detailed information about Counterparty projects.',
    ogDescription: 'Detailed insights into Counterparty projects and their activities.',
    ogImage: 'https://api.xcp.io/img/full/default.png',
    twitterCard: 'summary_large_image',
  })
})
</script>
