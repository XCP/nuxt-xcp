<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="flex-1 mb-6">
      <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
        Mempool Activity
      </h1>
      <!-- Main container for items, ensuring flex-wrap and responsive gap -->
      <div class="mt-1 flex flex-wrap items-center text-base text-gray-300 gap-x-3 sm:gap-x-6">
        <!-- Item 1 -->
        <div class="flex items-center w-full lg:w-auto mt-2">
          <InformationCircleIcon
            class="mr-1.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Note: Divisible asset quantities need to be divided by 10^8
        </div>
      </div>
    </div>
    <div class="hidden sm:block mt-5 lg:mt-0 lg:ml-4">
      <DropdownLinks :items="dropdownItems" />
    </div>
  </div>
  <!-- Stats -->
  <div class="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="(stat, statIdx) in stats"
      :key="stat.name"
      :class="[statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '', 'border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']"
    >
      <p class="text-sm font-medium leading-6 text-gray-400">
        {{ stat.name }}
      </p>
      <p class="mt-2 flex items-baseline gap-x-2">
        <span class="text-4xl font-semibold tracking-tight text-white">{{ stat.value }}</span>
        <span
          v-if="stat.unit"
          class="text-sm text-gray-400"
        >{{ stat.unit }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { InformationCircleIcon } from '@heroicons/vue/20/solid'

const { $apiClient } = useNuxtApp()

const totalTransactions = ref(0)
const totalBTCAmount = ref(0)
const totalXCPAmount = ref(0)
const totalAssetsCount = ref(0)

const dropdownItems = computed(() => [
  { href: 'https://blockstream.info/', imgSrc: '/img/blockstreaminfo.png', title: 'blockstream.info' },
  { href: 'https://mempool.space/', imgSrc: '/img/mempoolspace.png', title: 'mempool.space' },
])

const stats = computed(() => [
  { name: 'Transactions', value: totalTransactions.value },
  { name: 'Assets', value: totalAssetsCount.value },
  { name: 'Bitcoin Volume', value: formatBalance(totalBTCAmount.value, { divisible: true }), unit: 'BTC' },
  { name: 'Counterparty Volume', value: formatBalance(totalXCPAmount.value, { divisible: true }), unit: 'XCP' },
])

const fetchTransactionCountFromAPI = async () => {
  const response = await $apiClient.getMempoolEventsByName('TRANSACTION_PARSED', { limit: 1 })
  return response.data.result_count
}

const fetchTransactionCount = async () => {
  return await getCachedData('MempoolHeaderTansactionCount', fetchTransactionCountFromAPI, 10)
}

const fetchTotalBTCAmountFromAPI = async () => {
  let totalBTCAmount = 0
  let hasMoreData = true
  let nextCursor = null

  while (hasMoreData) {
    const params = { cursor: nextCursor, limit: 1000 }
    const response = await $apiClient.getMempoolEventsByName('DISPENSE', params)
    const data = response.data

    data.result.forEach((event) => {
      const bindings = JSON.parse(event.bindings)
      totalBTCAmount += bindings.btc_amount
    })

    nextCursor = data.next_cursor
    hasMoreData = !!nextCursor
  }

  return totalBTCAmount
}

const fetchTotalBTCAmount = async () => {
  return await getCachedData('MempoolHeaderTotalBTCAmount', fetchTotalBTCAmountFromAPI, 10)
}

const fetchTotalXCPAmountFromAPI = async () => {
  let totalXCPAmount = 0
  let hasMoreData = true
  let nextCursor = null

  const eventTypes = ['CREDIT', 'DEBIT']
  while (hasMoreData) {
    for (const eventType of eventTypes) {
      const params = { cursor: nextCursor, limit: 1000 }
      const response = await $apiClient.getMempoolEventsByName(eventType, params)
      const data = response.data

      data.result.forEach((event) => {
        const bindings = JSON.parse(event.bindings)
        if (bindings.asset === 'XCP') {
          totalXCPAmount += bindings.quantity
        }
      })

      nextCursor = data.next_cursor
      hasMoreData = !!nextCursor
    }
  }

  return totalXCPAmount
}

const fetchTotalXCPAmount = async () => {
  return await getCachedData('MempoolHeaderTotalXCPAmount', fetchTotalXCPAmountFromAPI, 10)
}

const fetchTotalAssetsCountFromAPI = async () => {
  let hasMoreData = true
  let nextCursor = null
  const assetNames = new Set()

  while (hasMoreData) {
    const params = { cursor: nextCursor, limit: 1000 }
    const response = await $apiClient.getMempoolEvents(params)
    const data = response.data

    data.result.forEach((event) => {
      const bindings = JSON.parse(event.bindings)
      const assetName = bindings.asset || bindings.give_asset
      if (assetName) {
        assetNames.add(assetName)
      }
    })

    nextCursor = data.next_cursor
    hasMoreData = !!nextCursor
  }

  return assetNames.size
}

const fetchTotalAssetsCount = async () => {
  return await getCachedData('MempoolHeaderTotalAssetsCount', fetchTotalAssetsCountFromAPI, 10)
}

onMounted(() => {
  fetchTransactionCount().then(count => totalTransactions.value = count)
  fetchTotalBTCAmount().then(amount => totalBTCAmount.value = amount)
  fetchTotalXCPAmount().then(amount => totalXCPAmount.value = amount)
  fetchTotalAssetsCount().then(count => totalAssetsCount.value = count)
})
</script>
