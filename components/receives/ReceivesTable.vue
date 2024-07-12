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
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Source
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
        v-for="(receive, index) in data"
        :key="index"
      >
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg
              :src="`https://api.xcp.io/img/icon/${formatAssetName(receive.asset, receive.asset_info)}`"
              :alt="formatAssetName(receive.asset, receive.asset_info)"
              class="h-10 w-10 bg-gray-800"
              loading="lazy"
            />
            <NuxtLink
              :to="`/asset/${formatAssetName(receive.asset, receive.asset_info)}`"
              class="font-medium leading-6 text-base text-white"
            >
              {{ formatAssetName(receive.asset, receive.asset_info) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          +{{ receive.quantity_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 min-w-[100px]">
          <NuxtLink
            :to="`/address/${receive.source}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ receive.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <StatusBadge :status="receive.status" />
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          <NuxtLink
            :to="`/block/${receive.block_index}`"
            class="leading-6 text-white"
          >
            {{ receive.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(receive.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right">
          <NuxtLink
            :to="`/tx/${receive.tx_hash}`"
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
    return $apiClient.getAddressReceives(props.address, params)
  }
  else {
    throw new Error('Address prop is required for API call')
  }
}
</script>
