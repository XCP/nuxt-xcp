<template>
  <TableTemplate :api-client-function="apiClientFunction">
    <template #table-headers>
      <tr>
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
          Quantity
        </th>
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
        v-for="(send, index) in data"
        :key="index"
      >
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg
              :src="`https://api.xcp.io/img/icon/${formatAssetName(send.asset, send.asset_info)}`"
              :alt="formatAssetName(send.asset, send.asset_info)"
              class="h-10 w-10 bg-gray-800"
              loading="lazy"
            />
            <NuxtLink
              :to="`/asset/${formatAssetName(send.asset, send.asset_info)}`"
              class="font-medium leading-6 text-base text-white"
            >
              {{ formatAssetName(send.asset, send.asset_info) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ props.address ? '-' : '' }}{{ send.quantity_normalized }}
        </td>
        <td
          v-if="!props.address"
          class="whitespace-nowrap py-3 pr-3 min-w-[100px]"
        >
          <NuxtLink
            :to="`/address/${send.source}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ send.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 min-w-[100px]">
          <NuxtLink
            :to="`/address/${send.destination}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ send.destination }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <StatusBadge :status="send.status" />
        </td>
        <td
          v-if="!props.blockIndex"
          class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell"
        >
          <NuxtLink
            :to="`/block/${send.block_index}`"
            class="leading-6 text-white"
          >
            {{ send.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(send.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right">
          <NuxtLink
            :to="`/tx/${send.tx_hash}`"
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
    return $apiClient.getAddressSends(props.address, params)
  }
  else if (props.blockIndex) {
    return $apiClient.getBlockSends(props.blockIndex, params)
  }
  else {
    throw new Error('Address or Index Block prop is required for API call')
  }
}
</script>
