<template>
  <TableTemplate
    :api-client-function="apiClientFunction"
    :change-key="selectedStatus"
    result-key="orders"
  >
    <template #table-controls>
      <!-- Status filter dropdown -->
      <div class="ml-4">
        <select
          v-model="selectedStatus"
          class="text-white bg-gray-800 rounded px-3 py-1 text-base focus:outline-none md:w-auto"
        >
          <option value="all">
            All
          </option>
          <option value="open">
            Open
          </option>
          <option value="filled">
            Filled
          </option>
          <option value="expired">
            Expired
          </option>
          <option value="cancelled">
            Cancelled
          </option>
        </select>
      </div>
    </template>
    <template #table-headers>
      <tr>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Selling
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
          Buying
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Quantity
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
        v-for="(order, index) in data"
        :key="index"
      >
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg
              :src="`https://api.xcp.io/img/icon/${formatAssetName(order.give_asset, order.give_asset_info)}`"
              :alt="formatAssetName(order.give_asset, order.give_asset_info)"
              class="h-10 w-10"
              loading="lazy"
            />
            <NuxtLink
              :to="`/asset/${order.give_asset}`"
              class="font-medium leading-6 text-base text-white"
            >
              {{ formatAssetName(order.give_asset, order.give_asset_info) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ order.give_quantity_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg
              :src="`https://api.xcp.io/img/icon/${formatAssetName(order.get_asset, order.get_asset_info)}`"
              :alt="formatAssetName(order.get_asset, order.get_asset_info)"
              class="h-10 w-10"
              loading="lazy"
            />
            <NuxtLink
              :to="`/asset/${order.give_asset}`"
              class="font-medium leading-6 text-base text-white"
            >
              {{ formatAssetName(order.get_asset, order.get_asset_info) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ order.get_quantity_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <StatusBadge :status="order.status" />
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          <NuxtLink
            :to="`/block/${order.block_index}`"
            class="leading-6 text-white"
          >
            {{ order.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(order.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right h-16">
          <NuxtLink
            :to="`/tx/${order.tx_hash}`"
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
import { ref } from 'vue'
import { useNuxtApp } from '#app'

const props = defineProps({
  address: {
    type: String,
    default: '',
  },
  assetName: {
    type: String,
    default: '',
  },
})

const { $apiClient } = useNuxtApp()

const selectedStatus = ref('all')

const apiClientFunction = (params = {}) => {
  params.verbose = true
  params.status = selectedStatus.value

  if (props.address) {
    return $apiClient.getAddressOrders(props.address, params)
  }
  else if (props.assetName) {
    return $apiClient.getAssetOrders(props.assetName, params)
  }
  else {
    return $apiClient.getOrders(params)
  }
}
</script>
