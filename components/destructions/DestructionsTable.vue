<template>
  <Table :api-client-function="apiClientFunction">
    <template #table-headers>
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Quantity</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Source</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Status</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Time</th>
        <th scope="col" class="py-2 pl-0 w-20"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr v-for="(destruction, index) in data" :key="index">
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg :src="`https://api.xcp.io/img/icon/${formatAssetName(destruction.asset, destruction.asset_info)}`" :alt="formatAssetName(destruction.asset, destruction.asset_info)" class="h-10 w-10 bg-gray-800" loading="lazy" />
            <NuxtLink :to="`/asset/${formatAssetName(destruction.asset, destruction.asset_info)}`" class="font-medium leading-6 text-base text-white">
              {{ formatAssetName(destruction.asset, destruction.asset_info) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          -{{ destruction.quantity_normalized }}
        </td>
        <td v-if="!props.address" class="whitespace-nowrap py-3 pr-3 min-w-[100px]">
          <NuxtLink :to="`/address/${destruction.source}`" class="font-medium leading-6 text-base text-white">
            {{ destruction.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <Status :status="destruction.status" />
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ formatTimeAgo(destruction.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right">
          <NuxtLink :to="`/tx/${destruction.tx_hash}`" class="text-primary">View</NuxtLink>
        </td>
      </tr>
    </template>
  </Table>
</template>

<script setup>
import { useNuxtApp } from '#app'

const props = defineProps({
  blockIndex: String,
})

const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  if (props.blockIndex) {
    return $apiClient.getBlockDestructions(props.blockIndex, params)
  } else {
    throw new Error('Block index prop is required for API call')
  }
}

</script>
