<template>
  <TableTemplate :api-client-function="apiClientFunction">
    <template #table-headers>
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Amount</th>
        <th v-if="!props.address" scope="col" class="py-2 pr-2 font-semibold">Address</th>
        <th v-if="!props.blockIndex" scope="col" class="py-2 pr-2 font-semibold w-20">Action</th>
        <th v-if="!props.blockIndex" scope="col" class="py-2 pr-2 font-semibold w-20">Block #</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Time</th>
        <th scope="col" class="py-2 pl-0 w-20"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr v-for="(debit, index) in data" :key="index">
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg :src="`https://api.xcp.io/img/icon/${formatAssetName(debit.asset, debit.asset_info)}`" :alt="formatAssetName(debit.asset, debit.asset_info)" class="h-10 w-10 bg-gray-800" loading="lazy" />
            <NuxtLink :to="`/asset/${formatAssetName(debit.asset, debit.asset_info)}`" class="font-medium leading-6 text-base text-white">
              {{ formatAssetName(debit.asset, debit.asset_info) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-4 text-base leading-6 text-gray-300">
          -{{ debit.quantity_normalized }}
        </td>
        <td v-if="!props.address" class="whitespace-nowrap py-3 pr-3 min-w-[100px]">
          <NuxtLink :to="`/address/${debit.address}`" class="font-medium leading-6 text-base text-white">
            {{ debit.address }}
          </NuxtLink>
        </td>
        <td v-if="!props.blockIndex" class="whitespace-nowrap py-3 pr-8">
          <div class="flex items-center gap-x-4 leading-6 text-white capitalize">
            {{ debit.action }}
          </div>
        </td>
        <td v-if="!props.blockIndex" class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          <NuxtLink :to="`/block/${debit.block_index}`" class="leading-6 text-white">
            {{ debit.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(debit.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-right text-base font-medium">
          <NuxtLink :to="`/tx/${debit.event}`" class="text-primary" aria-label="View transaction details">View</NuxtLink>
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
    default: ''
  },
  asset: {
    type: String,
    default: ''
  },
  blockIndex: {
    type: Number,
    default: 0
  }
})

const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  if (props.address) {
    return $apiClient.getAddressDebits(props.address, params)
  } else if (props.asset) {
    return $apiClient.getAssetDebits(props.asset, params)
  } else if (props.blockIndex) {
    return $apiClient.getBlockDebits(props.blockIndex, params)
  } else {
    throw new Error('No valid prop provided for API call')
  }
}
</script>
