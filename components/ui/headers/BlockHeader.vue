<template>
  <div>
    <div class="lg:flex lg:items-center lg:justify-between mb-6">
      <div class="flex-1">
        <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
          Block {{ props.blockIndex }}
        </h1>
        <!-- Main container for items, ensuring flex-wrap and responsive gap -->
        <div class="mt-1 flex flex-wrap items-center text-base text-gray-300 gap-x-3 sm:gap-x-6">
          <!-- Block Index -->
          <div class="flex items-center w-auto mt-2">
            <ClockIcon
              class="mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            {{ blockTimeAgo }}
          </div>
          <!-- Block Hash -->
          <div class="flex items-center w-auto mt-2">
            <LinkIcon
              class="mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Difficulty: {{ blockData.difficulty }}
          </div>
        </div>
      </div>
      <div class="hidden sm:block mt-5 lg:mt-0 lg:ml-4">
        <DropdownLinks :items="dropdownItems" />
      </div>
    </div>
    <!-- Stats with horizontal scroll -->
    <div class="grid grid-cols-1 bg-gray-700/10">
      <div class="overflow-x-auto max-w-full">
        <div
          v-for="hash in hashes"
          :key="hash.name"
          class="border-t border-white/5 pt-1 pb-2 px-4 sm:px-6 lg:px-8"
        >
          <p class="mt-2 flex items-baseline gap-x-2 whitespace-nowrap">
            <span class="text-sm font-medium leading-6 text-gray-400 min-w-36">{{ hash.name }}</span>
            <span class="text-sm font-medium leading-6 text-white">{{ hash.value }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ClockIcon, LinkIcon } from '@heroicons/vue/20/solid'
import { useNuxtApp } from '#app'

// Define props
const props = defineProps({
  blockIndex: {
    type: String,
    default: '',
  },
})

// Reactive state
const blockData = ref({})
const { $apiClient } = useNuxtApp()

// Fetch API data
const fetchData = async () => {
  try {
    const response = await $apiClient.getBlockByIndex(props.blockIndex)
    blockData.value = response.data.result
  }
  catch (e) {
    console.error('Fetch error:', e)
    // Handle fetch error, optionally redirect to an error page
  }
}

onMounted(fetchData)

const blockTimeAgo = computed(() => {
  if (blockData.value.block_time) {
    return formatTimeAgo(blockData.value.block_time)
  }
  return 'Loading...'
})

// Computed properties for display
const dropdownItems = computed(() => [
  { href: `https://blockstream.info/block/${blockData.value.block_hash}`, imgSrc: '/img/blockstreaminfo.png', title: 'blockstream.info' },
  { href: `https://mempool.space/block/${blockData.value.block_hash}`, imgSrc: '/img/mempoolspace.png', title: 'mempool.space' },
  { href: `https://memepool.wtf/block/${blockData.value.block_index}`, imgSrc: '/img/memepoolwtf.png', title: 'mempool.space' },
  { href: `https://www.xchain.io/block/${blockData.value.block_index}`, imgSrc: '/img/xchainio.png', title: 'xchain.io' },
])

const hashes = computed(() => [
  { name: 'Block Hash', value: blockData.value.block_hash },
  { name: 'Previous Block Hash', value: blockData.value.previous_block_hash },
  { name: 'Ledger Hash', value: blockData.value.ledger_hash },
  { name: 'TX List Hash', value: blockData.value.txlist_hash },
  { name: 'Messages Hash', value: blockData.value.messages_hash },
])
</script>
