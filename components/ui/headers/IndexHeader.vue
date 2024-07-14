<template>
  <div>
    <div class="lg:flex lg:items-center lg:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
          Counterparty XCP
        </h1>
        <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div class="mt-2 flex items-center text-base text-gray-300">
            <MagnifyingGlassIcon
              class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <span>Explore the "OG" Bitcoin metaprotocol.</span>
          </div>
        </div>
      </div>
      <div class="hidden lg:block mt-5 flex lg:ml-4 lg:mt-0">
        <DropdownLinks :items="dropdownItems" />
      </div>
    </div>

    <header class="mt-6 mb-8">
      <!-- Heading -->
      <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div class="flex flex-col flex-1 text-left">
          <div class="flex items-center gap-x-3">
            <div
              :class="[
                'flex-none rounded-full p-1 text-current',
                serverReady ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400',
              ]"
            >
              <div class="h-2 w-2 rounded-full bg-current" />
            </div>
            <h2 class="flex gap-x-3 text-base leading-7">
              <span class="font-semibold text-lg text-white">Counterparty Core v{{ version }}</span>
            </h2>
          </div>
          <p class="mt-2 text-xs leading-6 text-gray-400">
            The network status and software version used.
          </p>
        </div>
        <div class="hidden sm:flex flex-col flex-1 text-left border-white/5 sm:border-l sm:pl-4">
          <div class="flex items-center gap-x-3">
            <h2 class="flex gap-x-3 text-base leading-7">
              <span class="font-semibold text-lg text-white">Block Height: {{ blockHeight.toLocaleString() }}</span>
            </h2>
          </div>
          <p class="mt-2 text-xs leading-6 text-gray-400">
            Counterparty's Height is {{ counterpartyHeight.toLocaleString() }}.
          </p>
        </div>
        <div class="hidden sm:flex flex-col flex-1 text-left border-white/5 sm:border-l sm:pl-4">
          <div class="flex items-center gap-x-3">
            <h2 class="flex gap-x-3 text-base leading-7">
              <span class="font-semibold text-lg text-white uppercase">{{ network }}</span>
            </h2>
          </div>
          <p class="mt-2 text-xs leading-6 text-gray-400">
            This explorer is currently indexing {{ network }} data.
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 gap-x-8 text-base text-gray-300 bg-gray-700/10 p-4 rounded-md border-t border-white/5">
        <div v-for="event in filteredEventCounts" :key="event.key" class="flex justify-between w-auto">
          <span class="text-sm font-medium leading-6 text-gray-400 min-w-36">
            <template v-if="event.url">
              <NuxtLink :to="event.url">{{ event.displayName }}</NuxtLink>
            </template>
            <template v-else>
              {{ event.displayName }}
            </template>
          </span>
          <span class="text-sm font-medium leading-6 text-white text-right">{{ event.count.toLocaleString() }}</span>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'

// Reactive state for event counts fetched from the API
const eventCounts = ref([])

// Reactive state for version and server readiness
const version = ref('')
const network = ref('')
const blockHeight = ref('')
const counterpartyHeight = ref('')
const serverReady = ref(false)

// Allowed events and their display names with optional URLs
const allowedEvents = ref([
  { key: 'TRANSACTION_PARSED', displayName: 'Transactions', url: '/transactions' },
  { key: 'ASSET_CREATION', displayName: 'Assets', url: '/assets' },
  { key: 'ISSUANCE', displayName: 'Issuances', url: '/issuances' },
  { key: 'SEND', displayName: 'Sends', url: '/sends' },
  { key: 'OPEN_ORDER', displayName: 'Orders', url: '/orders' },
  { key: 'ORDER_MATCH', displayName: 'Order Matches', url: '/orders' },
  { key: 'OPEN_DISPENSER', displayName: 'Dispensers', url: '/dispensers' },
  { key: 'DISPENSE', displayName: 'Dispenses', url: '/dispenses' },
  { key: 'BROADCAST', displayName: 'Broadcasts', url: '/broadcasts' },
  { key: 'ASSET_DIVIDEND', displayName: 'Dividends', url: '/dividends' },
  { key: 'OPEN_BET', displayName: 'Bets', url: '/bets' },
  { key: 'SWEEP', displayName: 'Sweeps', url: '/sweeps' }
])

const { $apiClient } = useNuxtApp()

// Fetch event counts from the API
const fetchEventCounts = async () => {
  try {
    const response = await $apiClient.getEventCounts()
    eventCounts.value = response.data.result
  } catch (e) {
    console.error('Fetch error:', e)
    // Handle fetch error, optionally show an error message
  }
}

// Fetch status info from the API
const fetchStatusInfo = async () => {
  try {
    const response = await $apiClient.getStatus()
    version.value = response.data.result.version
    serverReady.value = response.data.result.server_ready
    network.value = response.data.result.network
    blockHeight.value = response.data.result.backend_height
    counterpartyHeight.value = response.data.result.counterparty_height
  } catch (e) {
    console.error('Fetch error:', e)
    // Handle fetch error, optionally show an error message
  }
}

onMounted(() => {
  fetchEventCounts()
  fetchStatusInfo()
})

// Filter and map the events based on the allowed list, preserving the order
const filteredEventCounts = computed(() => {
  return allowedEvents.value.map(event => {
    let count = 0
    if (event.key === 'SEND') {
      const sendEvent = eventCounts.value.find(e => e.event === 'SEND')
      const mpmaSendEvent = eventCounts.value.find(e => e.event === 'MPMA_SEND')
      const enhancedSendEvent = eventCounts.value.find(e => e.event === 'ENHANCED_SEND')
      count = (sendEvent ? sendEvent.event_count : 0) + (mpmaSendEvent ? mpmaSendEvent.event_count : 0) + (enhancedSendEvent ? enhancedSendEvent.event_count : 0)
    } else if (event.key === 'ISSUANCE') {
      const assetIssuanceEvent = eventCounts.value.find(e => e.event === 'ASSET_ISSUANCE')
      const assetTransferEvent = eventCounts.value.find(e => e.event === 'ASSET_TRANSFER')
      const resetIssuanceEvent = eventCounts.value.find(e => e.event === 'RESET_ISSUANCE')
      count = (assetIssuanceEvent ? assetIssuanceEvent.event_count : 0) + (assetTransferEvent ? assetTransferEvent.event_count : 0) + (resetIssuanceEvent ? resetIssuanceEvent.event_count : 0)
    } else {
      const foundEvent = eventCounts.value.find(e => e.event === event.key)
      count = foundEvent ? foundEvent.event_count : 0
    }
    return {
      key: event.key,
      displayName: event.displayName,
      count,
      url: event.url
    }
  })
})

// Computed properties for display
const dropdownItems = computed(() => [
  { href: `https://blockstream.info/`, imgSrc: '/img/blockstreaminfo.png', title: 'blockstream.info' },
  { href: `https://mempool.space/`, imgSrc: '/img/mempoolspace.png', title: 'mempool.space' },
  { href: `https://memepool.wtf/`, imgSrc: '/img/memepoolwtf.png', title: 'mempool.space' },
  { href: `https://scarce.city/`, imgSrc: '/img/scarcecity.png', title: 'scarce.city' },
  { href: `https://pepe.wtf/`, imgSrc: '/img/pepewtf.png', title: 'pepe.wtf' },
  { href: `https://www.xchain.io/`, imgSrc: '/img/xchainio.png', title: 'xchain.io' },
  { href: `https://www.xcp.dev/`, imgSrc: '/img/xcpdev.png', title: 'xcp.dev' },
  { href: `https://xcp.ninja/`, imgSrc: '/img/xcpninja.png', title: 'xcp.ninja' },
])
</script>
