<template>
  <TableTemplate :api-client-function="apiClientFunction">
    <template #table-headers>
      <tr>
        <th
          v-if="!props.asset"
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Asset
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Amount
        </th>
        <th
          v-if="!props.address"
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Address
        </th>
        <th
          scope="col"
          class="py-2 w-20"
        >
          <span class="sr-only">View</span>
        </th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr
        v-for="balance in data"
        :key="balance.asset"
      >
        <td
          v-if="!props.address"
          class="whitespace-nowrap py-3 pr-3 min-w-64"
        >
          <div class="flex items-center gap-x-4">
            <NuxtImg
              :src="`https://api.xcp.io/img/icon/${balance.asset}`"
              :alt="formatAssetName(balance.asset, balance.asset_info)"
              class="h-10 w-10 bg-gray-800"
              loading="lazy"
            />
            <span
              class="leading-6 text-base text-white"
            >
              {{ balance.quantity_normalized }}
            </span>
          </div>
        </td>
        <td
          v-if="!props.address"
          class="whitespace-nowrap py-3 pr-3 min-w-64"
        >
          <NuxtLink
            :to="`/address/${balance.address}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ balance.address }}
          </NuxtLink>
        </td>
        <td
          v-if="!props.address"
          class="whitespace-nowrap py-3 pl-3 text-base font-medium text-right"
        >
          <NuxtLink
            :to="`/address/${balance.address}`"
            class="text-primary"
          >
            View
          </NuxtLink>
        </td>
        <td
          v-if="!props.asset"
          class="whitespace-nowrap py-3 pr-3 min-w-64"
        >
          <div class="flex items-center gap-x-4">
            <NuxtImg
              :src="`https://api.xcp.io/img/icon/${balance.asset}`"
              :alt="formatAssetName(balance.asset, balance.asset_info)"
              class="h-10 w-10 bg-gray-800"
              loading="lazy"
            />
            <NuxtLink
              :to="`/asset/${formatAssetName(balance.asset, balance.asset_info)}`"
              class="font-medium leading-6 text-base text-white"
            >
              {{ formatAssetName(balance.asset, balance.asset_info) }}
            </NuxtLink>
          </div>
        </td>
        <td
          v-if="!props.asset"
          class="whitespace-nowrap py-3 pl-0 text-base leading-6 text-gray-300"
        >
          {{ balance.quantity_normalized }}
        </td>
        <td
          v-if="!props.asset"
          class="whitespace-nowrap py-3 pl-3 text-base font-medium text-right"
        >
          <NuxtLink
            :to="`/asset/${formatAssetName(balance.asset, balance.asset_info)}`"
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
import { useNuxtApp } from '#app'

const props = defineProps({
  address: {
    type: String,
    default: '',
  },
  asset: {
    type: String,
    default: '',
  },
})

const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  if (props.address) {
    return $apiClient.getAddressBalances(props.address, params)
  }
  else if (props.asset) {
    return $apiClient.getAssetBalances(props.asset, params)
  }
  else {
    throw new Error('Address or Asset prop is required for API call')
  }
}
</script>
