<template>
  <TableTemplate
    :api-client-function="apiClientFunction"
    result-key="sweeps"
  >
    <template #table-headers>
      <tr>
        <th
          v-if="!props.address"
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Source
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Destination
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Sweep
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Fee Paid (XCP)
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20"
        >
          Status
        </th>
        <th
          v-if="!props.blockIndex"
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
        v-for="(sweep, index) in data"
        :key="index"
      >
        <td
          v-if="!props.address"
          class="whitespace-nowrap py-3 pr-3"
        >
          <NuxtLink
            :to="`/address/${sweep.source}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ sweep.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3">
          <NuxtLink
            :to="`/address/${sweep.destination}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ sweep.destination }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <SweepFlagsBadge :flags="sweep.flags" />
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ sweep.fee_paid_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <StatusBadge :status="sweep.status" />
        </td>
        <td
          v-if="!props.blockIndex"
          class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell"
        >
          <NuxtLink
            :to="`/block/${sweep.block_index}`"
            class="leading-6 text-white"
          >
            {{ sweep.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(sweep.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right h-16">
          <NuxtLink
            :to="`/tx/${sweep.tx_hash}`"
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
  blockIndex: {
    type: String,
    default: '',
  },
})

const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  if (props.address) {
    return $apiClient.getAddressSweeps(props.address, params)
  }
  else if (props.blockIndex) {
    return $apiClient.getBlockSweeps(props.blockIndex, params)
  }
  else {
    return $apiClient.getSweeps(params)
  }
}
</script>
