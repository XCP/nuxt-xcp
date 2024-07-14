<template>
  <TableTemplate
    :api-client-function="apiClientFunction"
    result-key="dividends"
  >
    <template #table-headers>
      <tr>
        <th
          v-if="!props.address"
          scope="col"
          class="py-2 pr-2 font-semibold min-w-[100px]"
        >
          Source
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Asset
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Dividend
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Quantity Per Unit
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Fee Paid (XCP)
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20"
        >
          Status
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20"
        >
          Block #
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20"
        >
          Time
        </th>
        <th
          scope="col"
          class="py-2 pl-0 w-20"
        >
          <span class="sr-only">View</span>
        </th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr
        v-for="(dividend, index) in data"
        :key="index"
      >
        <td
          v-if="!props.address"
          class="whitespace-nowrap py-3 pr-3 min-w-[100px]"
        >
          <NuxtLink
            :to="`/address/${dividend.source}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ dividend.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg
              :src="`https://api.xcp.io/img/icon/${formatAssetName(dividend.asset, dividend.asset_info)}`"
              :alt="formatAssetName(dividend.asset, dividend.asset_info)"
              class="h-10 w-10 bg-gray-800"
              loading="lazy"
            />
            <NuxtLink
              :to="`/asset/${formatAssetName(dividend.asset, dividend.asset_info)}`"
              class="font-medium leading-6 text-base text-white"
            >
              {{ formatAssetName(dividend.asset, dividend.asset_info) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg
              :src="`https://api.xcp.io/img/icon/${formatAssetName(dividend.dividend_asset, dividend.dividend_asset_info)}`"
              :alt="formatAssetName(dividend.dividend_asset, dividend.dividend_asset_info)"
              class="h-10 w-10 bg-gray-800"
              loading="lazy"
            />
            <NuxtLink
              :to="`/asset/${formatAssetName(dividend.dividend_asset, dividend.dividend_asset_info)}`"
              class="font-medium leading-6 text-base text-white"
            >
              {{ formatAssetName(dividend.dividend_asset, dividend.dividend_asset_info) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ dividend.quantity_per_unit_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ dividend.fee_paid_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <StatusBadge :status="dividend.status" />
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          <NuxtLink
            :to="`/block/${dividend.block_index}`"
            class="leading-6 text-white"
          >
            {{ dividend.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(dividend.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right h-16">
          <NuxtLink
            :to="`/tx/${dividend.tx_hash}`"
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
    return $apiClient.getAddressDividends(props.address, params)
  }
  else if (props.asset) {
    return $apiClient.getAssetDividends(props.asset, params)
  }
  else {
    return $apiClient.getDividends(params)
  }
}
</script>
