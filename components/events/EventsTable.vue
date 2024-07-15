<template>
  <TableTemplate
    :api-client-function="apiClientFunction"
    result-key="events"
  >
    <template #table-headers>
      <tr>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Event
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Summary
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20"
        >
          Time
        </th>
        <th
          scope="col"
          class="py-2 pl-0 w-20"
        >
          <span class="sr-only">View</span>
        </th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr
        v-for="(event, index) in data"
        :key="index"
      >
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ event.event }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <EventSummary
            v-if="isConfirmed !== false"
            :event="event"
          />
          <MempoolSummary
            v-else
            :event="event"
          />
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ event.timestamp ? formatTimeAgo(event.timestamp) : '' }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right h-16">
          <NuxtLink
            :to="`/tx/${event.tx_hash}`"
            class="text-primary"
          >
            View
          </NuxtLink>
        </td>
      </tr>
    </template>
  </TableTemplate>
</template>

<script setup>
import { useNuxtApp } from '#app'

const props = defineProps({
  blockIndex: {
    type: String,
    default: '',
  },
  txHash: {
    type: String,
    default: '',
  },
})

const isConfirmed = ref(null)

const { $apiClient } = useNuxtApp()

const apiClientFunction = async (params = {}) => {
  params.verbose = true

  if (props.blockIndex) {
    return $apiClient.getBlockEvents(props.blockIndex, params)
  }
  else if (props.txHash) {
    try {
      const response = await $apiClient.getTransactionEventsByHash(props.txHash, params)
      if (response && response.data.result && response.data.result.length > 0) {
        isConfirmed.value = true
        return $apiClient.getTransactionEventsByHash(props.txHash, params)
      }
      else {
        console.log('Transaction events not found, checking mempool')
        const mempoolResponse = await $apiClient.getMempoolEventsByTxHash(props.txHash, params)
        if (mempoolResponse && mempoolResponse.data.result && mempoolResponse.data.result.length > 0) {
          isConfirmed.value = false
          return $apiClient.getMempoolEventsByTxHash(props.txHash, params)
        }
        else {
          throw new Error('Transaction not found in mempool')
        }
      }
    }
    catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }
  else {
    return $apiClient.getEvents(params)
  }
}
</script>
