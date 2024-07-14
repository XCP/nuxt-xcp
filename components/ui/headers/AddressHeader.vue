<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="flex-1">
      <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
        Counterparty Address
      </h1>
      <!-- Main container for items, ensuring flex-wrap and responsive gap -->
      <div class="mt-1 flex flex-wrap items-center text-base text-gray-300 gap-x-3 sm:gap-x-6">
        <!-- Item 1 -->
        <div class="flex items-center w-full lg:w-auto mt-2">
          <BriefcaseIcon
            class="mr-1.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          {{ address }}
        </div>
        <!-- Item 2 -->
        <div class="flex items-center w-full lg:w-auto mt-2 order-last lg:order-none">
          <FireIcon
            class="mr-1.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          {{ apiData.xcpValue }} XCP
        </div>
        <!-- Item 3 -->
        <div class="flex items-center w-auto mt-2">
          <CurrencyDollarIcon
            class="mr-1.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          {{ apiData.btcValue }} BTC
        </div>
        <!-- Item 4 -->
        <div class="flex items-center w-auto mt-2">
          <LinkIcon
            class="mr-1.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          {{ apiData.tx_count }} Transactions
        </div>
      </div>
    </div>
    <div class="hidden sm:block mt-5 lg:mt-0 lg:ml-4">
      <DropdownLinks :items="dropdownItems" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { BriefcaseIcon, CurrencyDollarIcon, FireIcon, LinkIcon } from '@heroicons/vue/20/solid'
import { useNuxtApp } from '#app'

// Define props
const props = defineProps({
  address: {
    type: String,
    default: '',
  },
})

// Reactive state
const apiData = ref({ tx_count: 0, btcValue: 0, xcpValue: 0 })
const { $apiClient } = useNuxtApp()

// Fetch API data
const fetchData = async () => {
  try {
    const btcData = await getCachedData(
      `blockstream_${props.address}`,
      async () => await $fetch(`https://blockstream.info/api/address/${props.address}`)
    );
    const xcpData = await $apiClient.getAddressBalanceByAsset(props.address, 'XCP')

    apiData.value = {
      tx_count: btcData.chain_stats.tx_count.toLocaleString(),
      btcValue: formatBalance(btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum, { divisible: true }),
      xcpValue: formatBalance(xcpData.data.result.quantity, { divisible: true }),
    }
  }
  catch (e) {
    console.error('Fetch error:', e)
    // Handle fetch error, optionally redirect to an error page
  }
}

onMounted(fetchData)

// Computed properties for display
const dropdownItems = computed(() => [
  { href: `https://blockstream.info/address/${props.address}`, imgSrc: '/img/blockstreaminfo.png', title: 'blockstream.info' },
  { href: `https://mempool.space/address/${props.address}`, imgSrc: '/img/mempoolspace.png', title: 'mempool.space' },
  { href: `https://pepe.wtf/${props.address}/collection`, imgSrc: '/img/pepewtf.png', title: 'pepe.wtf' },
  { href: `https://www.xchain.io/address/${props.address}`, imgSrc: '/img/xchainio.png', title: 'xchain.io' },
  { href: `https://www.xcp.dev/address/${props.address}`, imgSrc: '/img/xcpdev.png', title: 'xcp.dev' },
  { href: `https://xcp.ninja/profile/${props.address}`, imgSrc: '/img/xcpninja.png', title: 'xcp.ninja' },
])
</script>
