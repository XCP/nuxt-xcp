<template>
  <TableTemplate :api-client-function="apiClientFunction">
    <template #table-headers>
      <tr>
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
          Offer Hash
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Status
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
        v-for="(cancel, index) in data"
        :key="index"
      >
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <NuxtLink
            :to="`/address/${cancel.source}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ cancel.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <NuxtLink
            :to="`/tx/${cancel.offer_hash}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ cancel.offer_hash }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <StatusBadge :status="cancel.status" />
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ formatTimeAgo(cancel.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right h-16">
          <NuxtLink
            :to="`/tx/${cancel.tx_hash}`"
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
})

const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  if (props.blockIndex) {
    return $apiClient.getBlockCancels(props.blockIndex, params)
  }
  else {
    throw new Error('Block index prop is required for API call')
  }
}
</script>
