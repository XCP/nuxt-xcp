<template>
  <TableTemplate
    :api-client-function="apiClientFunction"
    result-key="issuances"
  >
    <template #table-headers>
      <tr>
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
          Quantity
        </th>
        <th
          v-if="!props.address"
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Source
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold hidden xl:table-cell"
        >
          Description
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Action
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
          v-if="!props.blockIndex"
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
        v-for="(issuance, index) in data"
        :key="index"
      >
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <div class="flex items-center gap-x-4">
            <NuxtImg
              :src="`https://api.xcp.io/img/icon/${formatAssetName(issuance.asset, issuance)}`"
              :alt="formatAssetName(issuance.asset, issuance)"
              class="h-10 w-10 bg-gray-800"
              loading="lazy"
            />
            <NuxtLink
              :to="`/asset/${formatAssetName(issuance.asset, issuance)}`"
              class="font-medium leading-6 text-base text-white"
            >
              {{ formatAssetName(issuance.asset, issuance) }}
            </NuxtLink>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ formatBalance(issuance.quantity, issuance) }}
        </td>
        <td
          v-if="!props.address"
          class="whitespace-nowrap py-3 pr-3 min-w-[100px]"
        >
          <NuxtLink
            :to="`/address/${issuance.source}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ issuance.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300 hidden xl:table-cell">
          <div
            class="truncate"
            :title="issuance.description"
          >
            {{ formatDescription(issuance.description, 100) }}
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <div class="flex gap-2 items-center font-medium">
            <div v-if="issuance.locked" class="flex items-center gap-1">
              <LockClosedIcon class="h-4 w-4 text-green-400" aria-hidden="true" />
              <span class="text-xs text-green-400">Lock</span>
            </div>
            <div v-if="issuance.reset" class="flex items-center gap-1">
              <ArrowPathIcon class="h-4 w-4 text-blue-400" aria-hidden="true" />
              <span class="text-xs text-blue-400">Reset</span>
            </div>
            <div v-if="issuance.transfer" class="flex items-center gap-1">
              <PaperAirplaneIcon class="h-4 w-4 text-purple-400" aria-hidden="true" />
              <span class="text-xs text-purple-400">Transfer</span>
            </div>
            <div v-if="issuance.quantity > 0" class="flex items-center gap-1">
              <PlusCircleIcon class="h-4 w-4 text-orange-400" aria-hidden="true" />
              <span class="text-xs text-orange-400">Issue</span>
            </div>
            <div v-if="index < data.length - 1 && issuance.description !== data[index + 1].description" class="flex items-center gap-1">
              <PencilSquareIcon class="h-4 w-4 text-indigo-400" aria-hidden="true" />
              <span class="text-xs text-indigo-400">Edit</span>
            </div>
            <div v-if="index === data.length - 1" class="flex items-center gap-1">
              <SparklesIcon class="h-4 w-4 text-yellow-500" aria-hidden="true" />
              <span class="text-xs text-yellow-500">Create</span>
            </div>
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ issuance.fee_paid_normalized }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <StatusBadge :status="issuance.status" />
        </td>
        <td
          v-if="!props.blockIndex"
          class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell"
        >
          <NuxtLink
            :to="`/block/${issuance.block_index}`"
            class="leading-6 text-white"
          >
            {{ issuance.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-base leading-6 text-gray-300 md:table-cell">
          {{ formatTimeAgo(issuance.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right h-16">
          <NuxtLink
            :to="`/tx/${issuance.tx_hash}`"
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
import { LockClosedIcon, ArrowPathIcon, PaperAirplaneIcon, PlusCircleIcon, PencilSquareIcon, SparklesIcon } from '@heroicons/vue/20/solid'
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
  blockIndex: {
    type: String,
    default: '',
  },
})

const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  if (props.address) {
    return $apiClient.getAddressIssuances(props.address, params)
  }
  else if (props.asset) {
    return $apiClient.getAssetIssuances(props.asset, params)
  }
  else if (props.blockIndex) {
    return $apiClient.getBlockIssuances(props.blockIndex, params)
  }
  else {
    return $apiClient.getIssuances(params)
  }
}
</script>
