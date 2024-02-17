<template>
  <Table apiUrl="https://api.xcp.io/api/messages" :queryParams="queryParams" :initialPage="props.initialPage" :emit="true" @last-message="handleLastMessage">
    <template v-slot:table-headers>
      <tr>
        <th scope="col" class="py-2 pl-2 font-semibold">Type</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Summary</th>
        <th scope="col" class="py-2 pr-2 font-semibold w-20 text-right">Block #</th>
        <th scope="col" class="py-2 pl-3"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template v-slot:table-rows="{ data }">
      <tr v-for="(item, index) in data" :key="index">
        <td class="py-3 pr-8">
          <div class="flex items-center gap-x-4 leading-6">
            <Badge :category="item.category" />
          </div>
        </td>
        <td class="py-3 pl-0 pr-8 text-sm leading-6 text-gray-300">
          <Summary :message="item" />
        </td>
        <td class="py-3 pl-0 text-right text-sm leading-6 text-gray-300">
          {{ item.block_index.toLocaleString() }}
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-right text-sm font-medium">
          <NuxtLink :to="`/tx/${item.tx_hash}`" class="text-indigo-400 hover:text-indigo-300">View</NuxtLink>
        </td>
      </tr>
    </template>
    <template v-slot:table-controls>
      <!-- Category filter dropdown -->
      <div class="ml-4">
        <select v-model="selectedCategory" @change="changeCategory" class="text-white bg-gray-800 rounded px-3 py-1 text-sm focus:outline-none md:w-auto">
          <option value="" selected>Show All</option>
          <option v-for="category in availableCategories" :key="category" :value="category">{{ formatSnakeCase(category) }}</option>
        </select>
      </div>
    </template>
  </Table>
</template>

<script setup>
const { trackEvent } = useFathom();

const emit = defineEmits(['last-message']);

function handleLastMessage(message) {
  emit('last-message', message);
}

const props = defineProps({
  asset: String,
  address: String,
  category: String,
  collection: String,
  initialPage: {
    type: Number,
    default: 1
  }
})

const availableCategories = [
  'sends', 'dispenses', 'dispensers', 'orders', 'order_matches', 'order_expirations',
  'issuances', 'destructions', 'broadcasts', 'dividends',
];

const selectedCategory = ref(props.category || "");

const queryParams = computed(() => {
  const params = {};  
  if (props.collection) params.collection = props.collection;
  if (selectedCategory) params.category = selectedCategory.value;
  if (props.address) params.address = props.address;
  if (props.asset) params.asset_name = props.asset;

  return params;
});

const changeCategory = (category) => {
  trackEvent(`Category: ${category}`);
};

</script>
