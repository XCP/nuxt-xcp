
<template>
  <!-- Pagination -->
  <nav class="mt-6 sm:mt-0 flex items-center justify-between" aria-label="Pagination">
    <div class="flex items-center">
      <p class="text-sm text-gray-300 leading-9">
        Showing all active dispensers
      </p>
    </div>
    <div class="flex">
    </div>
  </nav>

  <!-- Filters -->
  <div v-if="props.collection" class="flex flex-col sm:flex-row justify-between my-4 p-4 bg-gray-800 rounded-lg">
    <!-- Asset Name Filter -->
    <div class="flex items-center space-x-2 my-2">
      <span class="text-sm text-gray-300">Asset Name:</span>
      <input type="text" v-model="assetNameFilter" @input="handleInput" placeholder="Type to filter..." class="input bg-gray-700 text-white" />
    </div>

    <!-- Supply Filter Buttons -->
    <div class="flex items-center space-x-2 my-2">
      <span class="text-sm text-gray-300">Supply:</span>
      <button v-for="option in supplyOptions" :key="option.value" @click="setSupplyFilter(option.value)" :class="{ 'bg-gray-700 text-white': supplyFilter === option.value, 'bg-gray-800 text-gray-300': supplyFilter !== option.value }" class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-700 focus:outline-none">
        {{ option.label }}
      </button>
    </div>

    <!-- Effective Sat Rate Filter Buttons -->
    <div class="flex items-center space-x-2 my-2">
      <span class="text-sm text-gray-300">Effective Sat Rate:</span>
      <button v-for="option in effectiveSatRateOptions" :key="option.value" @click="setEffectiveSatRateFilter(option.value)" :class="{ 'bg-gray-700 text-white': effectiveSatRateFilter === option.value, 'bg-gray-800 text-gray-300': effectiveSatRateFilter !== option.value }" class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-700 focus:outline-none">
        {{ option.label }}
      </button>
    </div>

  </div>

  <!-- Loading -->
  <div v-if="state.loading" class="flex justify-center items-center my-20 py-20 text-gray-300">
    <ArrowPathIcon class="animate-spin h-8 w-8 text-gray-500" aria-hidden="true" />
  </div>

  <!-- No Data -->
  <div v-if="!state.loading && filteredDispensers.length === 0" class="my-10 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No active dispensers.</p>
      <p class="text-sm text-gray-400">Consider placing a buy order on Counterparty's DEX.</p>
    </div>
  </div>

  <!-- Table View -->
  <table v-if="!state.loading && filteredDispensers.length > 0" class="mt-6 w-full whitespace-nowrap text-left border-b border-white/10">
    <thead class="border-t border-b border-white/10 text-sm leading-6 text-white">
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Dispenser</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Dispensing</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Price</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Effective Rate</th>
        <th v-if="props.asset" scope="col" class="py-2 pr-2 font-semibold">Market Depth</th>
        <th scope="col" class="py-2 w-20"><span class="sr-only">View</span></th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
      <tr v-for="dispenser in filteredDispensers" :key="dispenser.tx_hash">
        <td class="whitespace-nowrap py-3 pr-3">
          <div class="flex items-center gap-x-4">
              <NuxtImg :src="`https://api.xcp.io/img/icon/${dispenser.asset_name}`" :alt="dispenser.asset_name" class="h-5 w-5 bg-gray-800" loading="lazy" />
              <NuxtLink :to="`/asset/${formatAssetName(dispenser.asset_name, dispenser)}`" class="font-medium leading-6 text-sm text-white">
                {{ formatAssetName(dispenser.asset_name, dispenser) }}
              </NuxtLink>
            </div>
        </td>
        <td class="whitespace-nowrap py-3 text-sm leading-6 text-gray-300">
          <NuxtLink :to="`/address/${dispenser.source}`" class="font-medium leading-6 text-sm text-white">
            {{ dispenser.source }}
          </NuxtLink>
          <span v-if="dispenser.source !== dispenser.origin" class="block text-xs">Origin: {{ dispenser.origin }}</span>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-sm leading-6 text-gray-300">
          {{ formatBalance(dispenser.give_quantity, dispenser) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-sm leading-6 text-gray-300">
          {{ formatBalance(dispenser.satoshirate, { divisible: true }) }} BTC
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-sm leading-6 text-gray-300">
          {{ formatBalance(dispenser.effective_sat_rate, { divisible: true }) }} BTC
        </td>
        <td v-if="props.asset" class="whitespace-nowrap py-3 pl-0 text-sm leading-6 text-gray-300">
          {{ formatBalance(dispenser.depth, dispenser) }} <br />
          {{ formatBalance(dispenser.depth_value, { divisible: true }) }} BTC
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-sm font-medium text-right">
          <NuxtLink :to="`/address/${dispenser.source}`" class="text-primary">View</NuxtLink>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="!state.loading && filteredDispensers.length > 0" class="flex justify-center mt-16 sm:mt-20 lg:mt-24">
    <button @click="downloadCsv" class="flex items-center px-6 py-3 bg-green-700 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300">
      <FolderArrowDownIcon class="mr-2 h-5 w-5 flex-shrink-0" aria-hidden="true" /> Download as CSV
    </button>
  </div>
</template>

<script setup>
import { ArrowPathIcon, FolderArrowDownIcon } from '@heroicons/vue/20/solid'
import { ref, reactive, watch, computed, onMounted } from 'vue';

// Props
const props = defineProps({
  asset: String,
  collection: String,
});

// State
const state = reactive({
  dispensers: [],
  loading: false,
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
  { label: '<20k', value: 20000 },
  { label: '<200k', value: 200000 },
  { label: '<2m', value: 2000000 },
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
    const assetNameCondition = dispenser.asset_name.includes(debouncedAssetName.value);

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

const downloadCsv = () => {
  trackEvent('Download');

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Asset,Dispenser,Dispensing,Price (BTC),Effective Rate,Available\n";

  filteredDispensers.forEach((dispenser) => {
    csvContent += `${formatAssetName(dispenser.asset, dispenser)},${dispenser.source},"${formatBalance(dispenser.give_quantity, dispenser)}","${formatBalance(dispenser.satoshirate, { divisible: true })}","${formatBalance(dispenser.effective_sat_rate, { divisible: true })}","${formatBalance(dispenser.give_remaining, dispenser)}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "dispensers.csv");
  document.body.appendChild(link);

  link.click();
};

watch(assetNameFilter, () => {
  if (assetNameFilter.value.length >= 3) {
    debouncedFilter();
  }
}, { immediate: true });

onMounted(fetchData);
</script>
