<template>
  <TableTemplate :api-client-function="apiClientFunction" :change-key="selectedStatus">
    <template #table-controls>
      <!-- Status filter dropdown -->
      <div class="ml-4">
        <select v-model="selectedStatus" class="text-white bg-gray-800 rounded px-3 py-1 text-base focus:outline-none md:w-auto">
          <option value="open">Open</option>
          <option value="filled">Filled</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
          <option value="dropped">Dropped</option>
        </select>
      </div>
    </template>
    <template #table-headers>
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Source</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Bet</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Wager (XCP)</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Counterwager (XCP)</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Target Value</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Leverage</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Expiration</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Status</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Block #</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Time</th>
        <th scope="col" class="py-2 pl-0 w-20"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr v-for="(bet, index) in data" :key="index">
        <td class="whitespace-nowrap py-3 pr-3 min-w-[100px]">
          <NuxtLink :to="`/address/${bet.source}`" class="font-medium leading-6 text-base text-white">
            {{ bet.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <BetTypeBadge :type="bet.bet_type" />
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ formatBalance(bet.wager_quantity, {divisible: true}) }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ formatBalance(bet.counterwager_quantity, {divisible: true}) }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ bet.target_value }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ bet.leverage }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <NuxtLink :to="`/block/${bet.expire_index}`" class="leading-6 text-white">
            {{ bet.expire_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <StatusBadge :status="bet.status" />
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <NuxtLink :to="`/block/${bet.block_index}`" class="leading-6 text-white">
            {{ bet.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ formatTimeAgo(bet.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right">
          <NuxtLink :to="`/tx/${bet.tx_hash}`" class="text-primary">View</NuxtLink>
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
})

const { $apiClient } = useNuxtApp()

const selectedStatus = ref('open')

const apiClientFunction = (params = {}) => {
  params.verbose = true
  params.status = selectedStatus.value

  if (props.address) {
    return $apiClient.getAddressBets(props.address, params)
  } else {
    throw new Error('Address prop is required for API call')
  }
}
</script>
