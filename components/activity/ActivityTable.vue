<template>
  <TableTemplate
    api-url="https://api.xcp.io/api/v1/messages"
    :query-params="queryParams"
    :initial-page="props.initialPage"
  >
    <template #table-headers>
      <tr>
        <th
          scope="col"
          class="py-2 pl-2 font-semibold"
        >
          Type
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
          Summary
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20 text-right"
        >
          Block #
        </th>
        <th
          scope="col"
          class="py-2 pl-3"
        >
          <span class="sr-only">View</span>
        </th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr
        v-for="(item, index) in data"
        :key="index"
      >
        <td class="py-3 pr-8">
          <div class="flex items-center gap-x-4 leading-6">
            <CategoryBadge :category="item.category" />
          </div>
        </td>
        <td class="whitespace-nowrap py-3 pr-3">
          <div class="flex items-center gap-x-4">
            <NuxtImg
              :src="`https://api.xcp.io/img/icon/${item.asset_name}`"
              :alt="item.asset"
              class="h-10 w-10"
              loading="lazy"
            />
          </div>
        </td>
        <td class="py-3 pl-0 pr-8 text-base leading-6 text-gray-300">
          <MempoolSummary :message="item" />
        </td>
        <td class="py-3 pl-0 text-right text-base leading-6 text-gray-300">
          {{ item.block_index.toLocaleString() }}
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-right text-base font-medium">
          <NuxtLink
            :to="`/tx/${item.tx_hash}`"
            class="text-primary"
          >
            View
          </NuxtLink>
        </td>
      </tr>
    </template>
    <template #table-controls>
      <!-- Category filter dropdown -->
      <div class="ml-4">
        <select
          v-model="selectedCategory"
          class="text-white bg-gray-800 rounded px-3 py-1 text-base focus:outline-none md:w-auto"
          @change="changeCategory"
        >
          <option
            value=""
            selected
          >
            Show All
          </option>
          <option
            v-for="cat in availableCategories"
            :key="cat"
            :value="cat"
          >
            {{ formatSnakeCase(cat) }}
          </option>
        </select>
      </div>
    </template>
  </TableTemplate>
</template>

<script setup>
const { trackEvent } = useFathom()

const props = defineProps({
  asset: String,
  address: {
    type: String,
    default: '',
  },
  category: String,
  collection: String,
  initialPage: {
    type: Number,
    default: 1,
  },
})

const availableCategories = [
  'sends', 'dispenses', 'dispensers', 'orders', 'order_matches', 'order_expirations',
  'issuances', 'destructions', 'broadcasts', 'dividends',
]

const selectedCategory = ref(props.category || '')

const queryParams = computed(() => {
  const params = {}
  if (props.collection) params.collection = props.collection
  if (selectedCategory.value) params.category = selectedCategory.value
  if (props.address) params.address = props.address
  if (props.assetName) params.asset_name = props.assetName

  return params
})

const changeCategory = (cat) => {
  trackEvent(`Category: ${cat}`)
}
</script>
