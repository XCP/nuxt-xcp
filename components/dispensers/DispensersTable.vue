<template>
  <TableTemplate
    :api-client-function="apiClientFunction"
    :change-key="selectedStatus"
    result-key="dispensers"
  >
    <template #table-controls>
      <!-- Status filter dropdown -->
      <div class="ml-4">
        <select
          v-model="selectedStatus"
          class="text-white bg-gray-800 rounded px-3 py-1 text-base focus:outline-none md:w-auto"
        >
          <option v-for="(statusName, statusValue) in DISPENSER_STATUS_NAME" :key="statusValue" :value="statusValue">
            {{ statusName }}
          </option>
        </select>
      </div>
    </template>
    <template #table-headers>
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Price (BTC)</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Dispenses</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Available</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Status</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Block #</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Time</th>
        <th scope="col" class="py-2 pl-0 w-20"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr v-for="(dispenser, index) in data" :key="index">
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg
              :src="`https://api.xcp.io/img/icon/${formatAssetName(dispenser.asset, dispenser.asset_info)}`"
              :alt="formatAssetName(dispenser.asset, dispenser.asset_info)"
              class="h-10 w-10"
              loading="lazy"
            />
            <NuxtLink :to="`/asset/${dispenser.asset}`" class="font-medium leading-6 text-base text-white">
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
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <DispenserStatusBadge :status="dispenser.status" />
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          <NuxtLink :to="`/block/${dispenser.block_index}`" class="leading-6 text-white">
            {{ dispenser.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(dispenser.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right h-16">
          <NuxtLink :to="`/tx/${dispenser.tx_hash}`" class="text-primary">View</NuxtLink>
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

const DISPENSER_STATUS_NAME = {
  0: 'Open',
  10: 'Closed',
  11: 'Closing',
}

const selectedStatus = ref(0)

const apiClientFunction = (params = {}) => {
  params.verbose = true
  params.status = parseInt(selectedStatus.value)

  if (props.address) {
    return $apiClient.getAddressDispensers(props.address, params)
  } else if (props.assetName) {
    return $apiClient.getAssetDispensers(props.assetName, params)
  } else {
    return $apiClient.getDispensers(params)
  }
}
</script>
