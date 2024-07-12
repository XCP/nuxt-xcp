<template>
  <Table :apiClientFunction="apiClientFunction">
    <template #table-headers>
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold min-w-[100px]">Source</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Destination</th>
        <th scope="col" class="py-2 pr-2 font-semibold">BTC Amount</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Fee</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Block #</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Time</th>
        <th scope="col" class="py-2 pl-0 w-20"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr v-for="(transaction, index) in data" :key="index">
        <td class="whitespace-nowrap py-3 pr-3 min-w-[100px]">
          <NuxtLink :to="`/address/${transaction.source}`" class="font-medium leading-6 text-base text-white">
            {{ transaction.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ transaction.destination || 'N/A' }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ transaction.btc_amount_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ transaction.fee }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ transaction.block_index.toLocaleString() }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(transaction.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right">
          <NuxtLink :to="`/tx/${transaction.tx_hash}`" class="text-primary">View</NuxtLink>
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
    return $apiClient.getAddressTransactions(props.address, params)
  } else {
    throw new Error('Address prop is required for API call')
  }
}

</script>
