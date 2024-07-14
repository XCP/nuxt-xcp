<template>
  <div>
    <!-- Navigation -->
    <nav
      class="mt-6 sm:mt-0 flex items-center justify-between"
      aria-label="Pagination"
    >
      <div class="flex items-center">
        <p
          v-if="state.transactions.length < totalTransactions"
          class="text-base text-gray-300 leading-9"
        >
          Showing
          <span class="font-medium">{{ state.transactions.length > 0 ? 1 : 0 }}</span>
          to
          <span class="font-medium">{{ state.transactions.length }}</span>
          of
          <span class="font-medium">{{ totalTransactions }}</span>
          results
        </p>
        <p
          v-else
          class="text-base text-gray-300 leading-9"
        >
          Scroll down to load more...
        </p>
      </div>
      <!-- Buttons -->
      <div class="flex">
        <!-- Refresh Results -->
        <button
          class="bg-gray-800 text-gray-300 h-10 inline-flex items-center justify-center rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 focus:outline-none"
          @click="refreshData(); trackEvent('Refresh Results')"
        >
          <ArrowPathIcon class="h-4 w-4" />
        </button>
      </div>
    </nav>

    <!-- Loading -->
    <div
      v-if="state.loading"
      class="flex justify-center items-center my-20 py-20 text-gray-300"
    >
      <ArrowPathIcon
        class="animate-spin h-8 w-8 text-gray-500"
        aria-hidden="true"
      />
    </div>

    <!-- No Data -->
    <div
      v-if="state.transactions.length === 0 && !state.loading"
      class="my-10 flex justify-center items-center"
    >
      <div class="text-center">
        <p class="text-lg text-gray-500">
          No transactions found.
        </p>
        <p class="text-base text-gray-400">
          Try again in a couple of minutes.
        </p>
      </div>
    </div>

    <!-- Table View -->
    <div
      v-else
      class="mt-6 relative overflow-x-auto"
    >
      <table class="w-full whitespace-nowrap text-left border-white/10">
        <thead class="border-t border-b border-white/10 text-base leading-6 text-white">
          <tr>
            <th
              scope="col"
              class="py-2 pr-2 font-semibold"
            >
              Time
            </th>
            <th
              scope="col"
              class="py-2 pr-2 font-semibold"
            >
              Type
            </th>
            <th
              scope="col"
              class="py-2 pr-2 font-semibold"
            >
              Source
            </th>
            <th
              scope="col"
              class="py-2 pr-2 font-semibold"
            >
              Asset
            </th>
            <th
              scope="col"
              class="py-2 pr-2 font-semibold"
            >
              Summary
            </th>
            <th
              scope="col"
              class="hidden xl:block py-2 pr-2 font-semibold"
            >
              TX Hash
            </th>
            <th
              scope="col"
              class="py-2 w-20"
            >
              <span class="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr
            v-for="transaction in state.transactions"
            :key="transaction.tx_hash"
          >
            <td class="whitespace-nowrap py-3 pl-0 pr-3 text-base leading-6 text-gray-300">
              {{ formatTimeAgo(transaction.timestamp) }}
            </td>
            <td class="whitespace-nowrap py-3 pl-0 pr-3 text-base leading-6 text-gray-300">
              <CategoryBadge :category="transaction.category" />
            </td>
            <td class="whitespace-nowrap py-3 pr-3 min-w-64">
              <NuxtLink
                :to="`/address/${transaction.creditSource || transaction.bindings.source}`"
                class="font-medium leading-6 text-base text-white"
              >
                {{ transaction.creditSource || transaction.bindings.source }}
              </NuxtLink>
            </td>
            <td class="whitespace-nowrap py-3 pr-3">
              <div class="flex items-center gap-x-4">
                <NuxtImg
                  :src="`https://api.xcp.io/img/icon/${transaction.bindings.asset || transaction.bindings.give_asset}`"
                  :alt="transaction.bindings.asset || transaction.bindings.give_asset"
                  class="h-10 w-10 bg-gray-800"
                  loading="lazy"
                />
              </div>
            </td>
            <td class="whitespace-nowrap py-3 pl-0 pr-3 text-base leading-6 text-gray-300">
              <MempoolSummary :event="transaction" />
            </td>
            <td class="hidden xl:block whitespace-nowrap py-3 pr-3 min-w-64">
              <NuxtLink
                :to="`/tx/${transaction.tx_hash}`"
                class="font-medium leading-6 text-base text-white"
              >
                {{ transaction.tx_hash }}
              </NuxtLink>
            </td>
            <td class="whitespace-nowrap py-3 pl-3 text-base font-medium text-right">
              <NuxtLink
                :to="`/tx/${transaction.tx_hash}`"
                class="text-primary"
              >
                View
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="!state.allDataLoaded"
      ref="lastElement"
    />
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue'

const { trackEvent } = useFathom()

const state = reactive({
  transactions: [],
  loading: false,
  allDataLoaded: false,
  initialLoad: true,
  nextCursor: null,
  carryOverEvent: null,
})

const refreshData = () => {
  state.transactions = []
  state.loading = false
  state.allDataLoaded = false
  state.initialLoad = true
  state.nextCursor = null
  state.carryOverEvent = null
  fetchData()
}

const observer = ref(null)
const lastElement = ref(null)
const totalTransactions = ref(0)

const { $apiClient } = useNuxtApp()

// Fetch total transactions and total BTC amount
const fetchTransactionCount = async () => {
  try {
    const response = await $apiClient.getMempoolEventsByName('TRANSACTION_PARSED', { limit: 1 })
    totalTransactions.value = response.data.result_count
  }
  catch (error) {
    console.error('Fetch transaction count error:', error)
  }
}

const fetchData = async () => {
  if (state.loading || state.allDataLoaded) return

  state.loading = true
  const params = {
    cursor: state.nextCursor,
    limit: 1000,
  }

  try {
    const response = await $apiClient.getMempoolEvents(params)
    const data = response.data
    if (state.totalCount === 0) {
      state.totalCount = data.result_count
    }

    const filteredData = []
    const seenTxHashes = new Set()
    const currentBatchTxHashes = new Set()
    let foundValidEvent = false

    let i = 0
    // Handle carry over event if it exists
    if (state.carryOverEvent) {
      filteredData.push(state.carryOverEvent)
      seenTxHashes.add(state.carryOverEvent.tx_hash)
      state.carryOverEvent = null
    }

    while (i < data.result.length) {
      const currentEvent = data.result[i]
      currentBatchTxHashes.add(currentEvent.tx_hash)

      if (currentEvent.event === 'TRANSACTION_PARSED') {
        let j = i + 1

        while (j < data.result.length && data.result[j].tx_hash === currentEvent.tx_hash) {
          const nextEvent = data.result[j]
          if (nextEvent.event !== 'DEBIT' && nextEvent.event !== 'CREDIT') {
            nextEvent.bindings = JSON.parse(nextEvent.bindings)

            if (nextEvent.category === 'dispenses') {
              const creditEvent = data.result.find(event => event.tx_hash === nextEvent.tx_hash && event.event === 'CREDIT')
              if (creditEvent) {
                nextEvent.creditSource = JSON.parse(creditEvent.bindings).address
              }
            }

            if (!seenTxHashes.has(currentEvent.tx_hash)) {
              filteredData.push(nextEvent)
              seenTxHashes.add(currentEvent.tx_hash)
            }
            foundValidEvent = true
            break // Exit the inner while loop after finding the first non-DEBIT/CREDIT event
          }
          j++
        }

        if (!foundValidEvent) {
          state.carryOverEvent = currentEvent // Set carry over event if not found in current batch
        }
      }
      i++
    }

    // Push current filtered data
    state.transactions.push(...filteredData)

    // Check if we need to fetch more data manually
    if (!foundValidEvent && currentBatchTxHashes.size > 0) {
      state.nextCursor = data.next_cursor // Update cursor for next API call
      await fetchData() // Manually trigger next page fetch if no valid events found in current batch
    }
    else if (data.result.length < 1000) {
      state.allDataLoaded = true
    }
    else {
      state.nextCursor = data.next_cursor // Update cursor for next API call
    }
  }
  catch (error) {
    console.error('Fetch error:', error)
  }
  finally {
    state.loading = false
    state.initialLoad = false
    if (state.allDataLoaded) {
      observer.value?.disconnect()
    }
  }
}

const handleIntersect = async (entries) => {
  if (entries[0].isIntersecting && !state.allDataLoaded) {
    await fetchData()
  }
}

onMounted(() => {
  fetchData()
  fetchTransactionCount()
  observer.value = new IntersectionObserver(handleIntersect, { threshold: 1.0 })
  if (lastElement.value) observer.value.observe(lastElement.value)
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
})

watch(lastElement, (el) => {
  if (el && observer.value) observer.value.observe(el)
})
</script>
