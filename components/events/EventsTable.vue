<template>
  <Table :apiClientFunction="apiClientFunction">
    <template #table-headers>
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Event</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Summary</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Time</th>
        <th scope="col" class="py-2 pl-0 w-20"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr v-for="(event, index) in data" :key="index">
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ event.event }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <EventSummary :event="event" />
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ formatTimeAgo(blockTime) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right">
          <NuxtLink :to="`/tx/${event.tx_hash}`" class="text-primary">View</NuxtLink>
        </td>
      </tr>
    </template>
  </Table>
</template>

<script setup>
import { useNuxtApp } from '#app'

const props = defineProps({
  blockIndex: String,
})

const { $apiClient } = useNuxtApp()
const blockTime = ref(null);

const apiClientFunction = async (params = {}) => {
  params.verbose = true

  if (props.blockIndex) {
    const response = await $apiClient.getBlockEvents(props.blockIndex, params);
    if (response && response.data.result && response.data.result.length > 0) {
      blockTime.value = response.data.result[0].params.block_time;
    }
    return response;
  } else {
    throw new Error('Block index prop is required for API call')
  }
}

</script>
