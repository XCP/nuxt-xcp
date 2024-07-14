<template>
  <div>
    <div class="lg:flex lg:items-center lg:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
          Counterparty Transaction
        </h1>
        <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div class="mt-2 flex items-center text-base text-gray-300">
            <ClockIcon
              class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
              aria-hidden="true"
            />
            <span>{{ formatTimestamp(timestamp) }}</span>
          </div>
          <div class="mt-2 flex lg:items-center text-base text-gray-300 break-all">
            <LinkIcon
              class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
              aria-hidden="true"
            />
            {{ txHash }}
          </div>
        </div>
      </div>
      <div class="hidden lg:block mt-5 flex lg:ml-4 lg:mt-0">
        <DropdownLinks :items="dropdownItems" />
      </div>
    </div>

    <header class="hidden lg:block mt-6 mb-8">
      <!-- Heading -->
      <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <div class="flex items-center gap-x-3">
            <div
              v-if="isConfirmed"
              class="flex-none rounded-full bg-green-400/10 p-1 text-green-400"
            >
              <div class="h-2 w-2 rounded-full bg-current" />
            </div>
            <div
              v-else
              class="flex-none rounded-full bg-yellow-400/10 p-1 text-yellow-400"
            >
              <div class="h-2 w-2 rounded-full bg-current" />
            </div>
            <h2 class="flex gap-x-3 text-base leading-7">
              <span class="font-semibold text-lg text-white">{{ isConfirmed ? 'TX Confirmed' : 'Unconfirmed TX' }}</span>
            </h2>
          </div>
          <p class="mt-2 text-xs leading-6 text-gray-400">
            This transaction was mined by the Bitcoin blockchain.
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div
        v-if="isConfirmed"
        class="grid grid-cols-1 bg-gray-700/10 lg:grid-cols-3"
      >
        <div
          v-for="(stat, statIdx) in stats"
          :key="stat.name"
          :class="[statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '', 'border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']"
        >
          <p class="text-base font-medium leading-6 text-gray-400">
            {{ stat.name }}
          </p>
          <p class="mt-2 flex items-baseline gap-x-2">
            <span class="text-4xl font-semibold tracking-tight text-white">{{ stat.value }}</span>
            <span
              v-if="stat.unit"
              class="text-base text-gray-400"
            >{{ stat.unit }}</span>
          </p>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ClockIcon, LinkIcon } from '@heroicons/vue/20/solid'

// Define props
const props = defineProps({
  txHash: String,
})

const apiData = ref({})
const timestamp = ref(null)
const isConfirmed = ref(null)

const { $apiClient } = useNuxtApp()

const fetchData = async () => {
  try {
    const response = await $apiClient.getTransactionByHash(props.txHash, true)
    if (response.data.result) {
      apiData.value = response.data.result
      timestamp.value = apiData.value.block_time
      isConfirmed.value = true
    }
    else {
      console.log('Transaction not found, checking mempool')
      // Transaction not found, try fetching from the mempool
      const mempoolResponse = await $apiClient.getMempoolEventsByTxHash(props.txHash)
      if (mempoolResponse.data.result) {
        apiData.value = mempoolResponse.data.result
        timestamp.value = apiData.value[0]?.timestamp
        isConfirmed.value = false
      }
      else {
        console.error('Mempool fetch error:', mempoolResponse.data.error)
      }
    }
  }
  catch (error) {
    console.error('Fetch error:', error)
    try {
      const mempoolResponse = await $apiClient.getMempoolEventsByTxHash(props.txHash)
      if (mempoolResponse.data.result) {
        apiData.value = mempoolResponse.data.result
        timestamp.value = apiData.value[0]?.timestamp
        isConfirmed.value = false
      }
      else {
        console.error('Mempool fetch error:', mempoolResponse.data.error)
      }
    }
    catch (mempoolError) {
      console.error('Mempool fetch error:', mempoolError)
    }
  }
}

onMounted(() => {
  fetchData()
})

// Computed properties for display
const dropdownItems = computed(() => [
  { href: `https://blockstream.info/tx/${props.txHash}`, imgSrc: '/img/blockstreaminfo.png', title: 'blockstream.info' },
  { href: `https://mempool.space/tx/${props.txHash}`, imgSrc: '/img/mempoolspace.png', title: 'mempool.space' },
  { href: `https://www.xchain.io/tx/${props.txHash}`, imgSrc: '/img/xchainio.png', title: 'xchain.io' },
  { href: `https://www.xcp.dev/tx/${props.txHash}`, imgSrc: '/img/xcpdev.png', title: 'xcp.dev' },
])

const stats = computed(() => {
  if (isConfirmed.value) {
    return [
      { name: 'Block #', value: apiData.value.block_index.toLocaleString() },
      { name: 'TX Index', value: apiData.value.tx_index.toLocaleString() },
      { name: 'Time Ago', value: formatTimeAgo(apiData.value.block_time) },
    ]
  }
  return []
})
</script>
