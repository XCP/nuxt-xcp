<template>
  <div>
    <!-- Pagination -->
    <TablePagination
      :current-page="state.currentPage"
      :results-per-page="state.resultsPerPage"
      :start-item="startItem"
      :end-item="endItem"
      :total-items="state.totalItems"
      :fetch-data="fetchData"
    >
      <template #table-controls>
        <slot name="table-controls" />
      </template>
    </TablePagination>

    <!-- Table -->
    <div class="mt-6 relative overflow-x-auto">
      <table
        class="w-full whitespace-nowrap text-left border-white/10"
        role="table"
        aria-live="polite"
      >
        <thead class="border-t border-b border-white/10 text-base leading-6 text-white">
          <slot name="table-headers" />
        </thead>
        <tbody class="divide-y divide-white/5 border-b border-white/10">
          <template v-if="state.loading">
            <tr>
              <td
                :colspan="columnCount"
                class="py-16 text-center"
                role="cell"
                aria-busy="true"
              >
                <ArrowPathIcon class="h-8 w-8 text-gray-300 animate-spin mx-auto" />
                <span class="sr-only">Loading...</span>
              </td>
            </tr>
          </template>
          <template v-else-if="state.error">
            <tr>
              <td
                :colspan="columnCount"
                class="py-16 text-center"
                role="cell"
              >
                <div>
                  <p class="text-lg text-gray-500">
                    Failed to load data.
                  </p>
                  <p class="text-base text-gray-400">
                    We are experiencing an issue. Please try again later.
                  </p>
                </div>
              </td>
            </tr>
          </template>
          <template v-else-if="state.items.length === 0">
            <tr>
              <td
                :colspan="columnCount"
                class="py-16 text-center"
                role="cell"
              >
                <div>
                  <p class="text-lg text-gray-500">
                    No {{ resultKey }} {{ foundKey }}.
                  </p>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <slot
              name="table-rows"
              :data="state.items"
            />
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  apiClientFunction: {
    type: Function,
    default: () => {},
  },
  changeKey: {
    type: String,
    default: '',
  },
  resultKey: {
    type: String,
    default: 'results',
  },
  foundKey: {
    type: String,
    default: 'found',
  },
})

const state = ref({
  loading: false,
  error: null,
  items: [],
  totalItems: 0,
  currentPage: 1,
  resultsPerPage: 50,
})

// Use a ref to track the number of columns for colspan attribute
const columnCount = ref(0)

// After rendering the slot content, count the number of columns
onMounted(() => {
  const tableHeaders = document.querySelectorAll('thead > tr > th')
  columnCount.value = tableHeaders.length
  fetchData() // Fetch data
})

const startItem = computed(() => (state.value.currentPage - 1) * state.value.resultsPerPage + 1)
const endItem = computed(() => Math.min(state.value.currentPage * state.value.resultsPerPage, state.value.totalItems))

const { fetchData } = useFetchData(state, props.apiClientFunction)

const debouncedFetchData = debounce(fetchData, 300)

watch(() => props.changeKey, () => {
  debouncedFetchData()
})
</script>
