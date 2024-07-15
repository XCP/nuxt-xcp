<template>
  <TableTemplate
    :api-client-function="apiClientFunction"
    result-key="broadcasts"
  >
    <template #table-headers>
      <tr>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Text
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20 hidden xl:table-cell"
        >
          Value
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20 hidden xl:table-cell"
        >
          Fee
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20"
        >
          Status
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20"
        >
          Block #
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
        v-for="(broadcast, index) in data"
        :key="index"
      >
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300 truncate">
          {{ formatDescription(broadcast.text, 50) }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300 hidden xl:table-cell">
          {{ broadcast.value }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300 hidden xl:table-cell">
          {{ broadcast.fee_fraction_int_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <StatusBadge :status="broadcast.status" />
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300">
          <NuxtLink
            :to="`/block/${broadcast.block_index}`"
            class="leading-6 text-white"
          >
            {{ broadcast.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300">
          {{ formatTimeAgo(broadcast.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right h-16">
          <NuxtLink
            :to="`/tx/${broadcast.tx_hash}`"
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
  address: {
    type: String,
    default: '',
  },
})

const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  if (props.address) {
    return $apiClient.getAddressBroadcasts(props.address, params)
  }
  else {
    return $apiClient.getBroadcasts(params)
  }
}
</script>
