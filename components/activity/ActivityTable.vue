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
  </Table>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['last-message']);

function handleLastMessage(message) {
  emit('last-message', message);
}

const props = defineProps({
  address: String,
  initialPage: {
    type: Number,
    default: 1
  }
})

const queryParams = computed(() => {
  const params = {};  
  if (props.address) params.address = props.address;
  if (props.collection) params.collection = props.collection;

  return params;
});

</script>
