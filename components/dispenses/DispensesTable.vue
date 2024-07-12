<template>
  <Table :apiClientFunction="apiClientFunction">
    <template #table-headers>
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Dispensed</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Price (BTC)</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Total (BTC)</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Source</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Block #</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Time</th>
        <th scope="col" class="py-2 pl-0 w-20"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr v-for="(dispense, index) in data" :key="index">
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg :src="`https://api.xcp.io/img/icon/${formatAssetName(dispense.asset, dispense.asset_info)}`" :alt="formatAssetName(dispense.asset, dispense.asset_info)" class="h-10 w-10 bg-gray-800" loading="lazy" />
            <NuxtLink :to="`/asset/${formatAssetName(dispense.asset, dispense.asset_info)}`" class="font-medium leading-6 text-base text-white">
              {{ formatAssetName(dispense.asset, dispense.asset_info) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ dispense.dispense_quantity_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ dispense.dispenser.satoshirate_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ calculateBTCPaid(dispense.dispense_quantity_normalized, dispense.dispenser.give_quantity_normalized, dispense.dispenser.satoshirate_normalized) }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 min-w-[100px]">
          <NuxtLink :to="`/address/${dispense.source}`" class="font-medium leading-6 text-base text-white">
            {{ dispense.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ dispense.block_index.toLocaleString() }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(dispense.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right">
          <NuxtLink :to="`/tx/${dispense.tx_hash}`" class="text-primary">View</NuxtLink>
        </td>
      </tr>
    </template>
  </Table>
</template>

<script setup>
import { useNuxtApp } from '#app'

const props = defineProps({
  address: String,
  type: {
    type: String,
    required: true,
    validator: value => ['sends', 'receives'].includes(value)
  }
})

const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  if (props.address) {
    if (props.type === 'sends') {
      return $apiClient.getAddressDispensesSends(props.address, params)
    } else if (props.type === 'receives') {
      return $apiClient.getAddressDispensesReceives(props.address, params)
    }
  } else {
    throw new Error('Address prop is required for API call')
  }
}

const calculateBTCPaid = (dispenseQuantity, giveQuantity, satoshirate) => {
  const dispenses = dispenseQuantity / giveQuantity;
  return (dispenses * satoshirate).toFixed(8);
}
</script>
