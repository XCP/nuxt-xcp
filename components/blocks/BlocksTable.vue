<template>
  <TableTemplate
    :api-client-function="apiClientFunction"
    result-key="blocks"
  >
    <template #table-headers>
      <tr>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20"
        >
          Block #
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold min-w-[200px]"
        >
          Block Hash
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold min-w-[200px]"
        >
          Transactions
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-40"
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
        v-for="(block, index) in data"
        :key="index"
      >
        <td class="whitespace-nowrap py-3 pr-3">
          <NuxtLink
            :to="`/block/${block.block_index}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ block.block_index.toLocaleString() }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-white">
          {{ block.block_hash }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300 hidden xl:table-cell">
          {{ block.transaction_count }}
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ formatTimeAgo(block.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right h-16">
          <NuxtLink
            :to="`/block/${block.block_index}`"
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
const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  return $apiClient.getBlocks(params)
}
</script>
