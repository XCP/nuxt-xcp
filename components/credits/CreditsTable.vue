<template>
  <!-- Pagination -->
  <nav class="flex items-center justify-between" aria-label="Pagination">
    <div class="hidden sm:block">
      <p class="text-sm text-gray-300">
        Showing
        <span class="font-medium">{{ (state.currentPage - 1) * 100 + 1 }}</span>
        to
        <span class="font-medium">{{ Math.min(state.currentPage * 100, state.totalItems) }}</span>
        of
        <span class="font-medium">{{ state.totalItems }}</span>
        results
      </p>
    </div>
    <div class="flex flex-1 justify-between sm:justify-end">
      <button 
        @click="goToPage(state.currentPage - 1)"
        class="relative inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-gray-500 hover:bg-gray-700 focus-visible:outline-offset-0"
        :disabled="state.currentPage <= 1"
      >
        Previous
      </button>
      <button 
        @click="goToPage(state.currentPage + 1)"
        class="relative ml-3 inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-gray-500 hover:bg-gray-700 focus-visible:outline-offset-0"
        :disabled="state.currentPage >= state.lastPage"
      >
        Next
      </button>
    </div>
  </nav>
  <!-- Loading -->
  <div v-if="state.loading" class="flex justify-center items-center my-10 text-gray-300">
    <ArrowPathIcon class="animate-spin h-8 w-8 text-gray-500" aria-hidden="true" />
  </div>
  <!-- No Data -->
  <div v-else-if="state.messages.length === 0" class="my-10 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No results found.</p>
      <p class="text-sm text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
    </div>
  </div>
  <!-- Table -->
  <table v-else class="mt-6 w-full whitespace-nowrap text-left">
    <thead class="border-b border-white/10 text-sm leading-6 text-white">
      <tr>
        <th scope="col" class="py-2 pr-8 font-semibold">Type</th>
        <th scope="col" class="py-2 pl-0 pr-8 font-semibold sm:table-cell">Asset</th>
        <th scope="col" class="py-2 pl-0 pr-4 font-semibold">Quantity</th>
        <th scope="col" class="py-2 pl-0 pr-8 font-semibold md:table-cell">Event</th>
        <th scope="col" class="py-2 pl-0 pr-4 text-right font-semibold sm:table-cell">Timestamp</th>
        <th scope="col" class="py-2 pl-0"><span class="sr-only">View</span></th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
      <tr v-for="item in state.messages" :key="item.id">
        <td class="whitespace-nowrap py-3 pr-8">
          <div class="flex items-center gap-x-4 leading-6">
            <Badge :category="item.category" />
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-4 sm:table-cell sm:pr-8">
          <NuxtLink :to="`/asset/${formatAssetName(item.asset_name, item.asset)}`" class="leading-6 font-medium text-white">
            {{ formatAssetName(item.asset_name, item.asset) }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-4 text-sm leading-6 text-gray-300">
          {{ formatBalance(item.bindings.quantity, item.asset) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-sm leading-6 text-gray-300 md:table-cell">
          {{ item.bindings.action }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-right text-sm leading-6 text-gray-300 sm:table-cell">
          <time :datetime="item.created_at">{{ new Date(item.confirmed_at).toLocaleString() }}</time>
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-right text-sm font-medium">
          <NuxtLink :to="`/tx/${item.bindings.event}`" class="text-indigo-400 hover:text-indigo-300">View</NuxtLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { ref, onMounted, reactive, watchEffect } from 'vue'

const props = defineProps({
  asset: String,
  address: String,
  command: String,
  category: String,
  initialPage: {
    type: Number,
    default: 1
  }
})

const state = reactive({
  messages: [],
  currentPage: props.initialPage,
  lastPage: 1,
  totalItems: 0,
  loading: true,
})

async function fetchData(page = state.currentPage) {
  state.loading = true;
  const query = `address=${props.address}&category=credits&page=${page}`;

  try {
    const response = await fetch(`https://api.xcp.io/api/messages?${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    state.messages = data.data;
    state.currentPage = data.current_page;
    state.lastPage = data.last_page;
    state.totalItems = data.total

  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    state.loading = false;
  }
}

onMounted(fetchData);

watchEffect(() => {
  fetchData(1);
});

function goToPage(page) {
  fetchData(page);
}

</script>
