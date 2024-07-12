<!-- Table.vue -->
<template>
  <div>
    <!-- Pagination -->
    <Pagination
      :current-page="state.currentPage"
      :results-per-page="state.resultsPerPage"
      :startItem="startItem"
      :endItem="endItem"
      :totalItems="state.totalItems"
      :fetchData="fetchData"
    />

    <!-- Loading Spinner -->
    <div v-if="state.loading" class="my-96 flex justify-center items-center" role="status" aria-live="polite">
      <ArrowPathIcon class="h-8 w-8 text-gray-300 animate-spin my-24" />
      <span class="sr-only">Loading...</span>
    </div>

    <!-- Errors -->
    <div v-else-if="state.error" class="my-20 flex justify-center items-center" role="alert">
      <div class="text-center">
        <p class="text-lg text-gray-500">Failed to load data.</p>
        <p class="text-base text-gray-400">We are experiencing an issue. Please try again later.</p>
      </div>
    </div>

    <!-- No Data -->
    <div v-else-if="state.items.length === 0" class="my-20 flex justify-center items-center" role="alert">
      <div class="text-center">
        <p class="text-lg text-gray-500">No results found.</p>
        <p class="text-base text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="mt-6 relative overflow-x-auto">
      <table class="w-full whitespace-nowrap text-left border-white/10" role="table" aria-live="polite">
        <thead class="border-t border-b border-white/10 text-base leading-6 text-white">
          <slot name="table-headers"></slot>
        </thead>
        <tbody class="divide-y divide-white/5 border-b border-white/10">
          <slot name="table-rows" :data="state.items"></slot>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { ref, computed } from 'vue'

const props = defineProps({
  apiClientFunction: Function,
})

const state = ref({
  loading: false,
  error: null,
  items: [],
  totalItems: 0,
  currentPage: 1,
  resultsPerPage: 100,
})

const startItem = computed(() => (state.value.currentPage - 1) * state.value.resultsPerPage + 1)
const endItem = computed(() => Math.min(state.value.currentPage * state.value.resultsPerPage, state.value.totalItems))

const fetchData = async (offset = 0) => {
  if (state.value.loading) return

  state.value.loading = true
  state.value.items = []

  const params = {
    offset: offset,
    limit: state.value.resultsPerPage,
  }

  try {
    const response = await props.apiClientFunction(params)
    const data = response.data

    state.value.items = data.result
    state.value.totalItems = data.result_count
    state.value.currentPage = offset / state.value.resultsPerPage + 1
  } catch (error) {
    state.value.error = 'Fetch error: ' + error
  } finally {
    state.value.loading = false
  }
}

fetchData()
</script>
