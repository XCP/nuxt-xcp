<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="flex-1">
      <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
        Counterparty Block
      </h1>
      <!-- Main container for items, ensuring flex-wrap and responsive gap -->
      <div class="mt-1 flex flex-wrap items-center text-base text-gray-300 gap-x-3 sm:gap-x-6">
        <!-- Block Index -->
        <div class="flex items-center w-full lg:w-auto mt-2">
          <BriefcaseIcon class="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
          Block Index: {{ blockData.block_index }}
        </div>
        <!-- Block Hash -->
        <div class="flex items-center w-full lg:w-auto mt-2">
          <FireIcon class="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
          Block Hash: {{ blockData.block_hash }}
        </div>
        <!-- Previous Block Hash -->
        <div class="flex items-center w-auto mt-2">
          <CurrencyDollarIcon class="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
          Previous Block Hash: {{ blockData.previous_block_hash }}
        </div>
        <!-- Transaction Count -->
        <div class="flex items-center w-auto mt-2">
          <LinkIcon class="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
          Transactions: {{ blockData.transaction_count }}
        </div>
      </div>
    </div>
    <div class="hidden sm:block mt-5 lg:mt-0 lg:ml-4">
      <Dropdown :items="dropdownItems" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { BriefcaseIcon, CurrencyDollarIcon, FireIcon, LinkIcon } from '@heroicons/vue/20/solid';
import { useNuxtApp } from '#app';

// Define props
const props = defineProps({
  blockIndex: String,
});

// Reactive state
const blockData = ref({});
const { $apiClient } = useNuxtApp();

// Fetch API data
const fetchData = async () => {
  try {
    const response = await $apiClient.getBlockByIndex(props.blockIndex);
    blockData.value = response.data.result;
  } catch (e) {
    console.error('Fetch error:', e);
    // Handle fetch error, optionally redirect to an error page
  }
};

onMounted(fetchData);

// Computed properties for display
const dropdownItems = computed(() => [
  { href: `https://blockstream.info/block/${blockData.value.block_hash}`, imgSrc: '/img/blockstreaminfo.png', title: 'blockstream.info' },
  { href: `https://mempool.space/block/${blockData.value.block_hash}`, imgSrc: '/img/mempoolspace.png', title: 'mempool.space' },
  { href: `https://www.xchain.io/block/${blockData.value.block_index}`, imgSrc: '/img/xchainio.png', title: 'xchain.io' },
]);
</script>
