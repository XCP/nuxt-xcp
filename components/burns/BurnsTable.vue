<template>
  <Table :apiClientFunction="apiClientFunction">
    <template #table-headers>
      <tr>
        <th v-if="!props.address" scope="col" class="py-2 pr-2 font-semibold min-w-[100px]">Source</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Burned (BTC)</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Earned (XCP)</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Block #</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Time</th>
        <th scope="col" class="py-2 pl-0 w-20"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr v-for="(burn, index) in data" :key="index">
        <td v-if="!props.address" class="whitespace-nowrap py-3 pr-3 min-w-[100px]">
          <NuxtLink :to="`/address/${burn.source}`" class="font-medium leading-6 text-base text-white">
            {{ burn.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ burn.burned_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ burn.earned_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          <NuxtLink :to="`/block/${burn.block_index}`" class="leading-6 text-white">
            {{ burn.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(burn.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right">
          <NuxtLink :to="`/tx/${burn.tx_hash}`" class="text-primary">View</NuxtLink>
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
    return $apiClient.getAddressBurns(props.address, params)
  } else {
    throw new Error('Address prop is required for API call')
  }
}

</script>