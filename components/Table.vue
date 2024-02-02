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
        <span class="font-medium">{{ state.totalItems.toLocaleString() }}</span>
        results
      </p>
    </div>
    <div class="flex flex-1 justify-between sm:justify-end">
      <!-- First Page Button -->
      <button
        @click="goToPage(1)"
        class="inline-flex items-center justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 focus:outline-none disabled:bg-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
        :disabled="state.currentPage === 1"
      >
        &laquo;
      </button>
      <!-- Previous Page Button -->
      <button
        @click="goToPage(state.currentPage - 1)"
        class="ml-2 inline-flex items-center justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 focus:outline-none disabled:bg-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
        :disabled="state.currentPage <= 1"
      >
        &lsaquo;
      </button>
      <!-- Next Page Button -->
      <button
        @click="goToPage(state.currentPage + 1)"
        class="ml-2 inline-flex items-center justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 focus:outline-none disabled:bg-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
        :disabled="state.currentPage >= state.lastPage"
      >
        &rsaquo;
      </button>
      <!-- Last Page Button -->
      <button
        @click="goToPage(state.lastPage)"
        class="ml-2 inline-flex items-center justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 focus:outline-none disabled:bg-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
        :disabled="state.currentPage === state.lastPage"
      >
        &raquo;
      </button>
    </div>
  </nav>
  
  <!-- Loading -->
  <div v-if="state.loading" class="flex justify-center items-center my-20 py-20 text-gray-300">
    <ArrowPathIcon class="animate-spin h-8 w-8 text-gray-500" aria-hidden="true" />
  </div>

  <!-- No Data -->
  <div v-else-if="state.items.length === 0" class="my-10 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No results found.</p>
      <p class="text-sm text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
    </div>
  </div>

  <!-- Table -->
  <div v-else class="mt-6 overflow-x-auto sm:overflow-x-visible">
    <table class="table-auto w-full whitespace-nowrap text-left">
      <thead class="border-t border-b border-white/10 text-sm leading-6 text-white">
        <slot name="table-headers"></slot>
      </thead>
      <tbody class="divide-y divide-white/5">
        <slot name="table-rows" :data="state.items"></slot>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { reactive, onMounted } from 'vue';

const props = defineProps({
  apiUrl: String,
  queryParams: Object,
  initialPage: Number
});

const state = reactive({
  data: [],
  currentPage: props.initialPage || 1,
  lastPage: 1,
  totalItems: 0,
  loading: true,
});

async function fetchData(page = state.currentPage) {
  state.loading = true;
  try {
    const response = await fetch(`${props.apiUrl}?page=${page}&${new URLSearchParams(props.queryParams).toString()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    state.items = data.data;
    state.currentPage = data.current_page;
    state.lastPage = data.last_page;
    state.totalItems = data.total
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    state.loading = false;
  }
}

onMounted(() => fetchData(props.initialPage));

function goToPage(page) {
  if (page > 0 && page <= state.lastPage) {
    fetchData(page);
  }
}

</script>
