
<template>
  <!-- Pagination -->
  <nav v-if="state.dispensers.length > 0" class="mt-6 sm:mt-0 flex items-center justify-between" aria-label="Pagination">
    <div class="flex items-center">
      <p class="text-gray-300 leading-9">
        Showing all active dispensers
      </p>
    </div>
    <div class="flex">
      <button
        @click="state.showFilters = !state.showFilters; trackEvent('Toggle Filters')"
        class="inline-flex items-center justify-center rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 focus:outline-none"
        :class="{ 'bg-gray-700 text-white': state.showFilters, 'bg-gray-800 text-gray-300': !state.showFilters }"
      >
        <FunnelIcon class="h-4 w-4" />
      </button>
    </div>
  </nav>

  <!-- Filters -->
  <div v-if="props.collection && state.showFilters" class="flex flex-col sm:flex-row justify-between my-4 p-4 bg-gray-800 rounded-lg">
    <!-- Asset Name Filter -->
    <div class="flex items-center space-x-2 my-2">
      <input type="text" v-model="assetNameFilter" @input="handleInput" placeholder="Type asset name..." class="input bg-gray-700 text-white" />
    </div>

    <!-- Effective Sat Rate Filter Buttons -->
    <div class="flex items-center justify-between space-x-2 my-2">
      <span class="text-base text-gray-300">Sat Rate:</span>
      <button v-for="option in effectiveSatRateOptions" :key="option.value" @click="setEffectiveSatRateFilter(option.value)" :class="{ 'bg-gray-700 text-white': effectiveSatRateFilter === option.value, 'bg-gray-800 text-gray-300': effectiveSatRateFilter !== option.value }" class="inline-flex items-center justify-center rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 focus:outline-none">
        {{ option.label }}
      </button>
    </div>

    <!-- Supply Filter Buttons -->
    <div class="flex items-center justify-between space-x-2 my-2">
      <span class="text-base text-gray-300">Supply:</span>
      <button v-for="option in supplyOptions" :key="option.value" @click="setSupplyFilter(option.value)" :class="{ 'bg-gray-700 text-white': supplyFilter === option.value, 'bg-gray-800 text-gray-300': supplyFilter !== option.value }" class="inline-flex items-center justify-center rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 focus:outline-none">
        {{ option.label }}
      </button>
    </div>

    <!-- Reset Filters Button -->
    <div class="flex items-center space-x-2 my-2">
      <button @click="resetFilters" class="inline-flex items-center justify-center rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 focus:outline-none bg-gray-800 text-gray-300">
        <ArrowPathIcon class="h-5 w-5 mr-2" /> Reset Filters
      </button>
    </div>

  </div>

  <!-- Loading -->
  <div v-if="state.loading" class="flex justify-center items-center my-20 py-20 text-gray-300">
    <ArrowPathIcon class="animate-spin h-8 w-8 text-gray-500" aria-hidden="true" />
  </div>

  <!-- No Data -->
  <div v-if="!state.loading && state.dispensers.length === 0" class="my-20 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No active dispensers.</p>
      <p class="text-base text-gray-400">Consider placing a buy order on Counterparty's DEX.</p>
    </div>
  </div>

  <!-- No Data -->
  <div v-else-if="!state.loading && filteredDispensers.length === 0" class="my-20 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No matching dispensers.</p>
      <p class="text-base text-gray-400">Update or reset your filters to start over.</p>
    </div>
  </div>

  <!-- Table View -->
  <div v-if="!state.loading && filteredDispensers.length > 0" class="mt-6 relative overflow-x-auto">
    <table class="w-full whitespace-nowrap text-left border-white/10">
      <thead class="border-t border-b border-white/10 text-base leading-6 text-white">
        <tr>
          <th scope="col" class="py-2 pr-2 font-semibold">Asset</th>
          <th scope="col" class="py-2 pr-2 font-semibold">Dispensing</th>
          <th scope="col" class="py-2 pr-2 font-semibold">Price</th>
          <th scope="col" class="py-2 pr-2 font-semibold">Dispenser</th>
          <th v-if="props.asset" scope="col" class="py-2 pr-2 font-semibold">Market Depth</th>
          <th scope="col" class="py-2 w-20"><span class="sr-only">View</span></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        <tr v-for="dispenser in filteredDispensers" :key="dispenser.tx_hash">
          <td class="whitespace-nowrap py-3 pr-3 min-w-64">
            <div class="flex items-center gap-x-4">
              <NuxtImg :src="`https://api.xcp.io/img/icon/${dispenser.asset_name}`" :alt="dispenser.asset_name" class="h-10 w-10 bg-gray-800" loading="lazy" />
              <NuxtLink :to="`/asset/${formatAssetName(dispenser.asset_name, dispenser)}`" class="font-medium leading-6 text-base text-white">
                {{ formatAssetName(dispenser.asset_name, dispenser) }}
              </NuxtLink>
            </div>
          </td>
          <td class="whitespace-nowrap py-3 pr-3 leading-6 text-gray-300">
            {{ formatBalance(dispenser.give_quantity, dispenser) }}
          </td>
          <td class="whitespace-nowrap py-3 pr-3 leading-6 text-gray-300">
            {{ formatBalance(dispenser.satoshirate, { divisible: true }) }} BTC
            <span v-if="dispenser.satoshirate !== dispenser.effective_sat_rate" class="block text-xs">Rate: {{ formatBalance(dispenser.effective_sat_rate, { divisible: true }) }} BTC</span>
          </td>
          <td class="whitespace-nowrap py-3 pr-3 leading-6 text-gray-300">
            <NuxtLink :to="`/tx/${dispenser.tx_hash}`" class="font-medium leading-6 text-white">
              {{ dispenser.source }}
            </NuxtLink>
            <span v-if="dispenser.source !== dispenser.origin" class="block text-xs">Origin: {{ dispenser.origin }}</span>
          </td>
          <td v-if="props.asset" class="whitespace-nowrap py-3 pr-3 leading-6 text-white">
            {{ formatBalance(dispenser.depth, dispenser) }}
            <span class="block text-xs text-gray-300">{{ formatBalance(dispenser.depth_value, { divisible: true }) }} BTC</span>
          </td>
          <td class="whitespace-nowrap py-3 font-medium text-right">
            <NuxtLink :to="`/tx/${dispenser.tx_hash}`" class="text-primary">View</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ArrowPathIcon, FolderArrowDownIcon, FunnelIcon } from '@heroicons/vue/20/solid'
import { ref, reactive, watch, computed, onMounted } from 'vue';

const { trackEvent } = useFathom();

// Props
const props = defineProps({
  asset: String,
  collection: String,
});

// State
const state = reactive({
  dispensers: [],
  loading: false,
  showFilters: false,
});
const supplyFilter = ref(Number.MAX_SAFE_INTEGER);
const effectiveSatRateFilter = ref(Number.MAX_SAFE_INTEGER);
const assetNameFilter = ref('');
const debouncedAssetName = ref('');

// Options
const supplyOptions = [
  { label: '<100', value: 100 },
  { label: '<1k', value: 1000 },
  { label: '<10k', value: 10000 },
  { label: 'All', value: Number.MAX_SAFE_INTEGER },
];
const effectiveSatRateOptions = [
  { label: '<50k', value: 50000 },
  { label: '<500k', value: 500000 },
  { label: '<5m', value: 5000000 },
  { label: 'All', value: Number.MAX_SAFE_INTEGER },
];

// Compute
const filteredDispensers = computed(() => {
  // Check if no filters are applied
  const noFiltersApplied = supplyFilter.value === Number.MAX_SAFE_INTEGER &&
                           effectiveSatRateFilter.value === Number.MAX_SAFE_INTEGER &&
                           debouncedAssetName.value === '';

  // If no filters are applied, return the entire dispensers array
  if (noFiltersApplied) {
    return state.dispensers;
  }

  // Otherwise, apply the filters
  return state.dispensers.filter(dispenser => {
    const supplyCondition = dispenser.supply < supplyFilter.value;
    const effectiveRateCondition = dispenser.effective_sat_rate < effectiveSatRateFilter.value;

    // Skip the item if it doesn't meet the supply or effective rate conditions
    if (!supplyCondition || !effectiveRateCondition) return false;

    // Check if the asset name matches the filter (considering debouncing)
    const assetNameCondition = dispenser.asset_name.includes(debouncedAssetName.value) || dispenser.asset_longname?.includes(debouncedAssetName.value);

    return assetNameCondition;
  });
});

const queryParams = computed(() => {
  const params = {};
  if (props.collection) params.collection = props.collection;
  if (props.asset) params.asset_name = props.asset;
  return params;
});

// Methods
const setSupplyFilter = (value) => supplyFilter.value = value;
const setEffectiveSatRateFilter = (value) => effectiveSatRateFilter.value = value;
const handleInput = () => assetNameFilter.value = assetNameFilter.value.toUpperCase();
const resetFilters = () => {
  supplyFilter.value = Number.MAX_SAFE_INTEGER;
  effectiveSatRateFilter.value = Number.MAX_SAFE_INTEGER;
  assetNameFilter.value = '';
  debouncedAssetName.value = '';
};

// Debounce function (utility)
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Debounced filter
const debouncedFilter = debounce(() => {
  debouncedAssetName.value = assetNameFilter.value;
}, 300);

// API fetch method
const fetchData = async () => {
  state.loading = true;
  try {
    const queryString = new URLSearchParams(queryParams.value).toString();
    const response = await fetch(`https://api.xcp.io/api/v1/dispensers?${queryString}`);
    if (!response.ok) throw new Error('Network response was not ok');
    state.dispensers = await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    state.loading = false;
  }
};

watch(assetNameFilter, () => {
  debouncedFilter();

  if (assetNameFilter.value === '') {
    debouncedAssetName.value = '';
  }
}, { immediate: true });

onMounted(fetchData);
</script>
