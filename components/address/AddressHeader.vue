
<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="flex-1">
      <h1 class="text-2xl font-bold leading-7 text-white sm:text-3xl sm:tracking-tight">
        Counterparty Address
      </h1>
      <!-- Main container for items, ensuring flex-wrap and responsive gap -->
      <div class="mt-1 flex flex-wrap items-center text-base text-gray-300 gap-x-3 sm:gap-x-6">
        <!-- Item 1 -->
        <div class="flex items-center w-full lg:w-auto mt-2">
          <BriefcaseIcon class="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
          {{ props.address }}
        </div>
        <!-- Item 2 -->
        <div class="flex items-center w-full lg:w-auto mt-2 order-last lg:order-none">
          <FireIcon class="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
          {{ props.apiData.xcpValue }} XCP
        </div>
        <!-- Item 3 -->
        <div class="flex items-center w-auto mt-2">
          <CurrencyDollarIcon class="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
          {{ props.apiData.btcValue }} BTC
        </div>
        <!-- Item 4 -->
        <div class="flex items-center w-auto mt-2">
          <LinkIcon class="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
          {{ props.apiData.tx_count }} Transactions
        </div>
      </div>
    </div>
    <div class="hidden sm:block mt-5 lg:mt-0 lg:ml-4">
      <Dropdown :items="dropdownItems" />
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import { BriefcaseIcon, CurrencyDollarIcon, FireIcon, LinkIcon } from '@heroicons/vue/20/solid';

// Define props
const props = defineProps({
  address: String,
  apiData: Object
});

// Computed properties for display
const dropdownItems = computed(() => [
  { href: `https://blockstream.info/address/${props.address}`, imgSrc: '/img/blockstreaminfo.png', title: 'blockstream.info' },
  { href: `https://mempool.space/address/${props.address}`, imgSrc: '/img/mempoolspace.png', title: 'mempool.space' },
  { href: `https://pepe.wtf/${props.address}/collection`, imgSrc: '/img/pepewtf.png', title: 'pepe.wtf' },
  { href: `https://www.xchain.io/address/${props.address}`, imgSrc: '/img/xchainio.png', title: 'xchain.io' },
  { href: `https://www.xcp.dev/address/${props.address}`, imgSrc: '/img/xcpdev.png', title: 'xcp.dev' },
  { href: `https://xcp.ninja/profile/${props.address}`, imgSrc: '/img/xcpninja.png', title: 'xcp.ninja' }
]);
</script>
