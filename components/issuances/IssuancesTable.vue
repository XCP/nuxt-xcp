<template>
  <Table :apiClientFunction="apiClientFunction">
    <template #table-headers>
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Quantity</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Lock</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Reset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Transfer</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Fee Paid (XCP)</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Block #</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Time</th>
        <th scope="col" class="py-2 pl-0 w-20"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr v-for="(issuance, index) in data" :key="index">
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg :src="`https://api.xcp.io/img/icon/${formatAssetName(issuance.asset, issuance)}`" :alt="formatAssetName(issuance.asset, issuance)" class="h-10 w-10 bg-gray-800" loading="lazy" />
            <NuxtLink :to="`/asset/${formatAssetName(issuance.asset, issuance)}`" class="font-medium leading-6 text-base text-white">
              {{ formatAssetName(issuance.asset, issuance) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ formatBalance(issuance.quantity, issuance) }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ issuance.locked ? 'Yes' : 'No' }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ issuance.reset ? 'Yes' : 'No' }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ issuance.transfer ? 'Yes' : 'No' }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ issuance.fee_paid_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          <NuxtLink :to="`/block/${issuance.block_index}`" class="leading-6 text-white">
            {{ issuance.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(issuance.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right">
          <NuxtLink :to="`/tx/${issuance.tx_hash}`" class="text-primary">View</NuxtLink>
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
    return $apiClient.getAddressIssuances(props.address, params)
  } else {
    throw new Error('Address prop is required for API call')
  }
}

</script>
