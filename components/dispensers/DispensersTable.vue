
import type { DispensersTable } from '#build/components';
<template>
  <!-- Pagination -->
  <nav class="mt-6 sm:mt-0 flex items-center justify-between" aria-label="Pagination">
    <div class="flex items-center">
      <p class="text-sm text-gray-300 leading-9">
        Scroll down to load more...
      </p>
    </div>
    <div class="flex">
    </div>
  </nav>

  <!-- Loading -->
  <div v-if="state.loading" class="flex justify-center items-center my-20 py-20 text-gray-300">
    <ArrowPathIcon class="animate-spin h-8 w-8 text-gray-500" aria-hidden="true" />
  </div>

  <!-- No Data -->
  <div v-if="state.dispensers.length === 0" class="my-10 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No active dispensers.</p>
      <p class="text-sm text-gray-400">Consider placing a buy order on Counterparty's DEX.</p>
    </div>
  </div>

  <!-- Table View -->
  <table if="state.dispensers.length > 0" class="mt-6 w-full whitespace-nowrap text-left border-b border-white/10">
    <thead class="border-t border-b border-white/10 text-sm leading-6 text-white">
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Dispenser</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Dispensing</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Available</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Price</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Effective Rate</th>
        <th scope="col" class="py-2 w-20"><span class="sr-only">View</span></th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
      <tr v-for="dispenser in state.dispensers" :key="dispenser.tx_hash">
        <td class="whitespace-nowrap py-3 pr-3">
          <div class="flex items-center gap-x-4">
              <NuxtImg :src="`https://api.xcp.io/img/icon/${dispenser.asset}`" :alt="dispenser.asset" class="h-5 w-5 bg-gray-800" loading="lazy" />
              <NuxtLink :to="`/asset/${formatAssetName(dispenser.asset, dispenser)}`" class="font-medium leading-6 text-sm text-white">
                {{ formatAssetName(dispenser.asset, dispenser) }}
              </NuxtLink>
            </div>
        </td>
        <td class="whitespace-nowrap py-3 text-sm font-medium">
          <NuxtLink :to="`/address/${dispenser.source}`" class="font-medium leading-6 text-sm text-white">
            {{ dispenser.source }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-sm leading-6 text-gray-300">
          {{ formatBalance(dispenser.give_quantity, dispenser) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-sm leading-6 text-gray-300">
          {{ formatBalance(dispenser.give_remaining, dispenser) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-sm leading-6 text-gray-300">
          {{ formatBalance(dispenser.satoshirate, { divisible: true }) }} BTC
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-sm leading-6 text-gray-300">
          {{ formatBalance(dispenser.effective_sat_rate, { divisible: true }) }} BTC
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-sm font-medium text-right">
          <NuxtLink :to="`/address/${dispenser.source}`" class="text-indigo-400 hover:text-indigo-300">View</NuxtLink>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="state.dispensers.length > 0" class="flex justify-center mt-16 sm:mt-20 lg:mt-24">
    <button @click="downloadCsv" class="flex items-center px-6 py-3 bg-green-700 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300">
      <FolderArrowDownIcon class="mr-2 h-5 w-5 flex-shrink-0" aria-hidden="true" /> Download as CSV
    </button>
  </div>
</template>

<script setup>
import { ArrowPathIcon, FolderArrowDownIcon, ListBulletIcon, ViewColumnsIcon, } from '@heroicons/vue/20/solid'
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';
const { trackEvent } = useFathom();

const props = defineProps({
  asset: String,
});

const state = reactive({
  dispensers: [],
  loading: false,
});

const fetchData = async () => {
  if (state.loading) return;

  state.loading = true;
  const query = `asset=${props.asset}`;

  try {
    const response = await fetch(`https://api.xcp.io/api/dispensers?${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    state.dispensers = data;
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    state.loading = false;
  }
};

onMounted(() => {
  fetchData();
});

const downloadCsv = () => {
  trackEvent('Download');

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Asset,Dispenser,Dispensing,Price (BTC),Effective Rate,Available\n";

  state.dispensers.forEach((dispenser) => {
    csvContent += `${formatAssetName(dispenser.asset, dispenser)},${dispenser.source},"${formatBalance(dispenser.give_quantity, dispenser)}","${formatBalance(dispenser.satoshirate, { divisible: true })}","${formatBalance(dispenser.effective_sat_rate, { divisible: true })}","${formatBalance(dispenser.give_remaining, dispenser)}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "dispensers.csv");
  document.body.appendChild(link);

  link.click();
};

</script>
