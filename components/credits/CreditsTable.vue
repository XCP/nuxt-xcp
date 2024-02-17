<template>
  <Table apiUrl="https://api.xcp.io/api/v1/messages" :queryParams="queryParams" :initialPage="props.initialPage">
    <template v-slot:table-headers>
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold w-20">Type</th>
        <th v-if="!props.asset" scope="col" class="py-2 pr-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Amount</th>
        <th v-if="props.asset" scope="col" class="py-2 pr-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">{{ props.tx ? 'Address' : 'Event' }}</th>
        <th v-if="props.asset || props.collection" scope="col" class="py-2 pr-2 font-semibold">Address</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20 text-right">Block #</th>
        <th scope="col" class="py-2 pl-0 w-20"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template v-slot:table-rows="{ data }">
      <tr v-for="(item, index) in data" :key="index">
        <td class="whitespace-nowrap py-3 pr-8">
          <div class="flex items-center gap-x-4 leading-6">
            <Badge :category="item.category" />
          </div>
        </td>
        <td v-if="!props.asset" class="whitespace-nowrap py-3 pl-0 pr-4 sm:table-cell sm:pr-8">
          <NuxtLink :to="`/asset/${formatAssetName(item.asset_name, item.asset)}`" class="leading-6 font-medium text-white">
            {{ formatAssetName(item.asset_name, item.asset) }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-4 text-sm leading-6 text-gray-300">
          {{ formatBalance(item.bindings.quantity, item.asset) }}
        </td>
        <td v-if="props.asset" class="whitespace-nowrap py-3 pl-0 pr-4 text-sm sm:table-cell sm:pr-8">
          <NuxtLink :to="`/asset/${formatAssetName(item.asset_name, item.asset)}`" class="leading-6 font-medium text-white">
            {{ formatAssetName(item.asset_name, item.asset) }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 pr-8 text-sm leading-6 text-gray-300 md:table-cell">
          <NuxtLink v-if="props.tx" :to="`/address/${item.bindings.address}`" class="leading-6 font-medium text-white">
            {{ item.bindings.address }}
          </NuxtLink>
          <span v-else>{{ item.bindings.action }}</span>
        </td>
        <td v-if="props.asset || props.collection" class="whitespace-nowrap py-3 pl-0 pr-4 text-sm sm:table-cell sm:pr-8">
          <NuxtLink :to="`/address/${item.bindings.address}`" class="leading-6 font-medium text-white">
            {{ item.bindings.address }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-right text-sm leading-6 text-gray-300 sm:table-cell">
          {{ item.block_index.toLocaleString() }}
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-right text-sm font-medium">
          <NuxtLink :to="`/tx/${item.bindings.event}`" class="text-primary">View</NuxtLink>
        </td>
      </tr>
    </template>
  </Table>
</template>

<script setup>
const props = defineProps({
  asset: String,
  address: String,
  category: String,
  collection: String,
  tx: String,
  initialPage: {
    type: Number,
    default: 1
  }
})

const queryParams = computed(() => {
  const params = {};  
  if (props.collection) params.collection = props.collection;
  if (props.address) params.address = props.address;
  if (props.asset) params.asset_name = props.asset;
  if (props.tx) params.tx_hash = props.tx;
  params.category = props.category;

  return params;
});
</script>
