<template>
  <Table :api-client-function="apiClientFunction">
    <template #table-headers>
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Price (BTC)</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Dispenses</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Available</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Block #</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Time</th>
        <th scope="col" class="py-2 pl-0 w-20"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr v-for="(dispenser, index) in data" :key="index">
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg :src="`https://api.xcp.io/img/icon/${formatAssetName(dispenser.asset, dispenser.asset_info)}`" :alt="formatAssetName(dispense.asset, dispense.asset_info)" class="h-10 w-10 bg-gray-800" loading="lazy" />
            <NuxtLink :to="`/asset/${formatAssetName(dispenser.asset, dispenser.asset_info)}`" class="font-medium leading-6 text-base text-white">
              {{ formatAssetName(dispenser.asset, dispenser.asset_info) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ dispenser.satoshirate_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ dispenser.give_quantity_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ dispenser.give_remaining_normalized }} / {{ dispenser.escrow_quantity_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          <NuxtLink :to="`/block/${dispenser.block_index}`" class="leading-6 text-white">
            {{ dispenser.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(dispenser.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right">
          <NuxtLink :to="`/tx/${dispenser.tx_hash}`" class="text-primary">View</NuxtLink>
        </td>
      </tr>
    </template>
  </Table>
</template>

<script setup>
import { useNuxtApp } from '#app'

const props = defineProps({
  address: String,
})

const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  if (props.address) {
    return $apiClient.getAddressDispensers(props.address, params)
  } else {
    throw new Error('Address prop is required for API call')
  }
}
</script>
