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
                class="py-48 text-center"
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
                class="py-48 text-center"
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
                class="py-48 text-center"
              >
                <div>
                  <p class="text-lg text-gray-500">
                    No results found.
                  </p>
                  <p class="text-base text-gray-400">
                    Try adjusting your search to find what you're looking for.
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
import { ref, computed, watch } from 'vue'

const props = defineProps({
  apiClientFunction: {
    type: Function,
    default: () => {},
  },
  changeKey: {
    type: String,
    default: '',
  },
})

const state = ref({
  loading: false,
  error: null,
  items: [],
  totalItems: 0,
  currentPage: 1,
  resultsPerPage: 100,
})

// Use a ref to track the number of columns
const columnCount = ref(0)

// After rendering the slot content, count the number of columns
onMounted(() => {
  const tableHeaders = document.querySelectorAll('thead > tr > th')
  columnCount.value = tableHeaders.length
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
  }
  catch (error) {
    state.value.error = 'Fetch error: ' + error
  }
  finally {
    state.value.loading = false
  }
}

watch(() => props.changeKey, () => {
  fetchData()
})

fetchData()
</script>
