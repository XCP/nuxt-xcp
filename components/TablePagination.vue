<!-- Pagination.vue -->
<template>
  <nav class="mt-6 sm:mt-0 flex items-center justify-between" aria-label="Pagination">
    <div>
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
      <slot name="table-controls"/>
    </div>
    <div class="flex flex-1 items-center justify-end">
      <button
        class="inline-flex items-center justify-center rounded-md bg-white/10 px-3 sm:px-2 py-2 text-base font-semibold text-gray-300 hover:bg-white/20 focus:outline-none disabled:bg-gray-700/10 disabled:text-gray-300 disabled:cursor-not-allowed"
        :disabled="!hasPrevious"
        @click="loadFirst"
      >
        &laquo;
      </button>
      <button
        class="ml-2 inline-flex items-center justify-center rounded-md bg-white/10 px-3 sm:px-3 py-2 text-base font-semibold text-gray-300 hover:bg-white/20 focus:outline-none disabled:bg-gray-700/10 disabled:text-gray-300 disabled:cursor-not-allowed"
        :disabled="!hasPrevious"
        @click="loadPrevious"
      >
        &lsaquo;
      </button>
      <button
        class="ml-2 inline-flex items-center justify-center rounded-md bg-white/10 px-3 sm:px-3 py-2 text-base font-semibold text-gray-300 hover:bg-white/20 focus:outline-none disabled:bg-gray-700/10 disabled:text-gray-300 disabled:cursor-not-allowed"
        :disabled="!hasNext"
        @click="loadNext"
      >
        &rsaquo;
      </button>
      <button
        class="ml-2 inline-flex items-center justify-center rounded-md bg-white/10 px-3 sm:px-2 py-2 text-base font-semibold text-gray-300 hover:bg-white/20 focus:outline-none disabled:bg-gray-700/10 disabled:text-gray-300 disabled:cursor-not-allowed"
        :disabled="!hasNext"
        @click="loadLast"
      >
        &raquo;
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  fetchData: {
    type: Function,
    default: () => () => {},
  },
  startItem: {
    type: Number,
    default: 0,
  },
  endItem: {
    type: Number,
    default: 0,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  resultsPerPage: {
    type: Number,
    default: 10,
  },
});

const hasPrevious = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.endItem < props.totalItems)

function loadFirst() {
  if (hasPrevious.value) {
    props.fetchData(0)
  }
}

function loadPrevious() {
  if (hasPrevious.value) {
    props.fetchData((props.currentPage - 2) * props.resultsPerPage)
  }
}

function loadNext() {
  if (hasNext.value) {
    props.fetchData(props.currentPage * props.resultsPerPage)
  }
}

function loadLast() {
  if (hasNext.value) {
    const lastPage = Math.ceil(props.totalItems / props.resultsPerPage)
    props.fetchData((lastPage - 1) * props.resultsPerPage)
  }
}
</script>
