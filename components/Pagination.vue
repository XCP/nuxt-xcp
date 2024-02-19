<template>
  <nav class="mt-6 sm:mt-0 flex items-center justify-between" aria-label="Pagination">
    <div class="hidden sm:block">
      <p class="text-base text-gray-300">
        Showing
        <span class="font-medium">{{ startItem.toLocaleString() }}</span>
        to
        <span class="font-medium">{{ endItem.toLocaleString() }}</span>
        of
        <span class="font-medium">{{ totalItems.toLocaleString() }}</span>
        results
      </p>
    </div>
    <div class="hidden lg:flex items-center">
      <slot name="table-controls"></slot>
    </div>
    <div class="flex flex-1 items-center justify-between sm:justify-end">
      <div>
        <!-- First Page Button -->
        <button
          @click="updateCurrentPage(1)"
          class="inline-flex items-center justify-center rounded-md bg-white/10 px-3 py-2 text-base font-semibold text-gray-300 hover:bg-white/20 focus:outline-none disabled:bg-gray-700/10 disabled:text-gray-300 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
        >
          &laquo;
        </button>
        <!-- Previous Page Button -->
        <button
          @click="updateCurrentPage(currentPage - 1)"
          class="ml-2 inline-flex items-center justify-center rounded-md bg-white/10 px-3 py-2 text-base font-semibold text-gray-300 hover:bg-white/20 focus:outline-none disabled:bg-gray-700/10 disabled:text-gray-300 disabled:cursor-not-allowed"
          :disabled="currentPage <= 1"
        >
          &lsaquo;
        </button>
      </div>
      <div class="sm:hidden text-center flex-1">
        <p class="text-base text-gray-300">
          Page
          <span class="font-medium">{{ currentPage }}</span>
          of
          <span class="font-medium">{{ lastPage }}</span>
        </p>
      </div>
      <div>
        <!-- Next Page Button -->
        <button
          @click="updateCurrentPage(currentPage + 1)"
          class="ml-2 inline-flex items-center justify-center rounded-md bg-white/10 px-3 py-2 text-base font-semibold text-gray-300 hover:bg-white/20 focus:outline-none disabled:bg-gray-700/10 disabled:text-gray-300 disabled:cursor-not-allowed"
          :disabled="currentPage >= lastPage"
        >
          &rsaquo;
        </button>
        <!-- Last Page Button -->
        <button
          @click="updateCurrentPage(lastPage)"
          class="ml-2 inline-flex items-center justify-center rounded-md bg-white/10 px-3 py-2 text-base font-semibold text-gray-300 hover:bg-white/20 focus:outline-none disabled:bg-gray-700/10 disabled:text-gray-300 disabled:cursor-not-allowed"
          :disabled="currentPage === lastPage"
        >
          &raquo;
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalItems: Number,
  currentPage: Number,
  itemsPerPage: Number,
})

const emits = defineEmits(['update:currentPage'])

const lastPage = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))

function updateCurrentPage(page) {
  emits('update:currentPage', page)
}
</script>