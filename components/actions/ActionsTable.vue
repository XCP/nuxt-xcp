<template>
  <TableTemplate api-url="https://api.xcp.io/api/v1/messages" :query-params="{ tx_hash: props.tx }" :initial-page="props.initialPage">
    <template #table-headers>
      <tr>
        <th scope="col" class="py-2 pl-2 font-semibold">Type</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Action</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Summary</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20 text-right">Block #</th>
        <th scope="col" class="py-2 pl-3"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr v-for="(item, index) in data" :key="index">
        <td class="py-3 pr-8">
          <div class="flex items-center gap-x-4 leading-6">
            <CategoryBadge :category="item.category" />
          </div>
        </td>
        <td class="py-3 pr-8">
          <div class="flex items-center gap-x-4 leading-6 capitalize">
            <CategoryBadge :category="item.command" />
          </div>
        </td>
        <td class="py-3 pl-0 pr-8 text-base leading-6 text-gray-300">
          <MempoolSummary :message="item" />
        </td>
        <td class="py-3 pl-0 text-right text-base leading-6 text-gray-300">
          {{ item.block_index.toLocaleString() }}
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-right text-base font-medium">
          <NuxtLink :to="`/tx/${item.tx_hash}`" class="text-primary">View</NuxtLink>
        </td>
      </tr>
    </template>
  </TableTemplate>
</template>

<script setup>
const props = defineProps({
  tx: String,
  initialPage: {
    type: Number,
    default: 1
  }
})
</script>
