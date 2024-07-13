<template>
  <TableTemplate :api-client-function="apiClientFunction">
    <template #table-headers>
      <tr>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20"
        >
          Lock
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold min-w-[100px]"
        >
          Asset
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold min-w-[200px] hidden xl:table-cell"
        >
          Description
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
        v-for="(asset, index) in data"
        :key="index"
      >
        <td class="whitespace-nowrap py-3 pr-">
          <div class="flex items-center gap-x-4 leading-6">
            <span
              v-if="asset.locked"
              class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-400/10 text-green-400 ring-green-400/20"
            >
              <LockClosedIcon
                class="h-4 w-4 flex-shrink-0 text-green-500"
                aria-hidden="true"
              />
            </span>
            <span
              v-else
              class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-yellow-400/10 text-yellow-400 ring-yellow-400/20"
            >
              <LockOpenIcon
                class="h-4 w-4 flex-shrink-0 text-yellow-500"
                aria-hidden="true"
              />
            </span>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 min-w-[100px]">
          <div class="flex items-center justify-between gap-x-4">
            <div class="flex items-center gap-x-4">
              <NuxtImg
                :src="`https://api.xcp.io/img/icon/${asset.asset}`"
                :alt="asset.asset"
                class="h-10 w-10 bg-gray-800"
                loading="lazy"
              />
              <NuxtLink
                :to="`/asset/${formatAssetName(asset.asset, asset)}`"
                class="font-medium leading-6 text-base text-white"
              >
                {{ formatAssetName(asset.asset, asset) }}
              </NuxtLink>
            </div>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300 hidden xl:table-cell">
          <div
            class="truncate"
            :title="asset.description"
          >
            {{ formatDescription(asset.description, 100) }}
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          <NuxtLink
            :to="`/block/${asset.first_issuance_block_index}`"
            class="leading-6 text-white"
          >
            {{ asset.first_issuance_block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(asset.first_issuance_block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right">
          <NuxtLink
            :to="`/asset/${formatAssetName(asset.asset, asset)}`"
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
import { LockClosedIcon, LockOpenIcon } from '@heroicons/vue/20/solid'
import { useNuxtApp } from '#app'

const props = defineProps({
  address: {
    type: String,
    default: '',
  },
})

const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  if (props.address) {
    return $apiClient.getAddressAssets(props.address, params)
  }
  else {
    return $apiClient.getAssets(params)
  }
}
</script>
