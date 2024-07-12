<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="min-w-0 flex-1">
      <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
        Counterparty Transaction
      </h1>
      <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
        <div class="mt-2 flex items-center text-base text-gray-300">
          <BriefcaseIcon
            class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
            aria-hidden="true"
          />
          {{ apiData.source }}
        </div>
        <div class="mt-2 flex lg:items-center text-base text-gray-300 break-all">
          <LinkIcon
            class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
            aria-hidden="true"
          />
          {{ tx }}
        </div>
      </div>
    </div>
    <div class="hidden sm:block mt-5 flex lg:ml-4 lg:mt-0">
      <DropdownLinks :items="dropdownItems" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BriefcaseIcon, LinkIcon } from '@heroicons/vue/20/solid'

// Define props
const props = defineProps({
  tx: String,
  apiData: Object,
})

// Computed properties for display
const dropdownItems = computed(() => [
  { href: `https://blockstream.info/tx/${props.tx}`, imgSrc: '/img/blockstreaminfo.png', title: 'blockstream.info' },
  { href: `https://mempool.space/tx/${props.tx}`, imgSrc: '/img/mempoolspace.png', title: 'mempool.space' },
  { href: `https://www.xchain.io/tx/${props.tx}`, imgSrc: '/img/xchainio.png', title: 'xchain.io' },
  { href: `https://www.xcp.dev/tx/${props.tx}`, imgSrc: '/img/xcpdev.png', title: 'xcp.dev' },
])
</script>
