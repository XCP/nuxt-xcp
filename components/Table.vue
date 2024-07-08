<template>
  <!-- Pagination and Additional Controls -->
  <Pagination :total-items="totalItems" :current-page="currentPage" :items-per-page="100" @update:currentPage="updateCurrentPage">
    <template v-slot:table-controls>
      <slot name="table-controls"></slot>
    </template>
  </Pagination>
  
  <!-- Loading -->
  <div v-if="pending" class="flex justify-center items-center my-20 py-20 text-gray-300">
    <ArrowPathIcon class="animate-spin h-8 w-8 text-gray-500" aria-hidden="true" />
  </div>

  <!-- Errors -->
  <div v-else-if="error" class="my-20 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">Failed to load data.</p>
      <p class="text-base text-gray-400">We are experiencing an issue. Please try again later.</p>
    </div>
  </div>

  <!-- No Data -->
  <div v-else-if="items.length === 0" class="my-20 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No results found.</p>
      <p class="text-base text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
    </div>
  </div>

  <!-- Table -->
  <div v-else class="mt-6 relative overflow-x-auto">
    <table class="w-full whitespace-nowrap text-left border-white/10">
      <thead class="border-t border-b border-white/10 text-base leading-6 text-white">
        <slot name="table-headers"></slot>
      </thead>
      <tbody class="divide-y divide-white/5">
        <slot name="table-rows" :data="items"></slot>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { ref, watch, computed } from 'vue'
import { useFetch } from 'nuxt/app'

const props = defineProps({
  apiUrl: String,
  queryParams: Object,
  initialPage: Number,
  emit: Boolean,
})

const emits = defineEmits(['last-message'])

const currentPage = ref(props.initialPage || 1)
const queryParams = computed(() => new URLSearchParams({
  ...props.queryParams,
  page: currentPage.value,
}).toString())

const { data, pending, refresh, error } = useFetch(() => `${props.apiUrl}?${queryParams.value}`, {
  watch: [queryParams],
})

const totalItems = computed(() => data.value?.total || 0)
const items = computed(() => data.value?.data || [])
const lastPage = computed(() => data.value?.last_page || 1)

watch(currentPage, () => {
  refresh()
})

if (props.emit && currentPage.value === 1 && items.value.length > 0) {
  emits('last-message', items.value[0])
}

function updateCurrentPage(page) {
  if (page > 0 && page <= lastPage.value) {
    currentPage.value = page
  }
}
</script>
