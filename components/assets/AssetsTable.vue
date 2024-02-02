
import type { MenuItem } from '@headlessui/vue';

import type { LockClosedIcon } from '@heroicons/vue/24/outline';
<template>
  <Table apiUrl="https://api.xcp.io/api/assets" :queryParams="{ address: props.address }" :initialPage="props.initialPage">
    <template v-slot:table-headers>
      <tr>
        <th scope="col" class="py-2 pl-2 font-semibold">Lock</th>
        <th scope="col" class="py-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 font-semibold">Type</th>
        <th scope="col" class="py-2 font-semibold">Supply</th>
        <th scope="col" class="py-2 font-semibold text-right">Block #</th>
        <th scope="col" class="py-2"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template v-slot:table-rows="{ data }">
      <tr v-for="(item, index) in data" :key="index">
        <td class="whitespace-nowrap py-3 pr-8">
          <div class="flex items-center gap-x-4 leading-6">
            <span v-if="item.locked" class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-400/10 text-green-400 ring-green-400/20">
              <LockClosedIcon class="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
            </span>
            <span v-else class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-yellow-400/10 text-yellow-400 ring-yellow-400/20">
              <LockOpenIcon class="h-5 w-5 flex-shrink-0 text-yellow-500" aria-hidden="true" />
            </span>
          </div>
        </td>
        <td class="whitespace-nowrap py-3">
          <NuxtLink :to="`/asset/${formatAssetName(item.asset_name, item)}`" class="leading-6 font-medium text-white">
            {{ formatAssetName(item.asset_name, item) }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 text-sm leading-6 text-gray-300 capitalize">
          {{ item.type }}{{ item.divisible ? ', Divisible' : '' }}
        </td>
        <td class="whitespace-nowrap py-3 text-sm leading-6 text-gray-300">
          {{ formatBalance(item.supply, item) }}
        </td>
        <td class="whitespace-nowrap py-3 text-sm leading-6 text-gray-300 text-right">
          {{ item.block_index.toLocaleString() }}
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-sm font-medium text-right">
          <NuxtLink :to="`/asset/${formatAssetName(item.asset_name, item)}`" class="text-indigo-400 hover:text-indigo-300">View</NuxtLink>
        </td>
      </tr>
    </template>
  </Table>
</template>

<script setup>
import { LockClosedIcon, LockOpenIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  address: String,
  initialPage: {
    type: Number,
    default: 1
  }
})
</script>
