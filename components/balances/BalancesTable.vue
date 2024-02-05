<template>
  <!-- Pagination -->
  <nav class="mt-6 sm:mt-0 flex items-center justify-between" aria-label="Pagination">
    <p v-if="state.balances.length < 100" class="text-sm text-gray-300 leading-9">
      Showing
      <span class="font-medium">1</span>
      to
      <span class="font-medium">{{ state.balances.length }}</span>
      of
      <span class="font-medium">{{ state.balances.length }}</span>
      results
    </p>
    <p v-else class="text-sm text-gray-300 leading-9">
      Scroll down to load balances
    </p>
  </nav>

  <!-- No Data -->
  <div v-if="state.balances.length === 0" class="my-10 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No results found.</p>
      <p class="text-sm text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
    </div>
  </div>

  <!-- Table -->
  <table v-else class="mt-6 w-full whitespace-nowrap text-left border-b border-white/10">
    <thead class="border-t border-b border-white/10 text-sm leading-6 text-white">
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Asset</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Amount</th>
        <th scope="col" class="py-2 pr-2 font-semibold">% of Supply</th>
        <th scope="col" class="py-2 w-20"><span class="sr-only">View</span></th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
      <tr v-for="balance in state.balances" :key="balance.asset">
        <td class="whitespace-nowrap py-3 pr-3">
          <div class="flex items-center gap-x-4">
              <NuxtImg :src="`https://api.xcp.io/img/icon/${balance.asset_name}`" :alt="balance.asset" class="h-5 w-5 bg-gray-800" loading="lazy" />
              <NuxtLink :to="`/asset/${balance.asset}`" class="font-medium leading-6 text-white">{{ balance.asset }}</NuxtLink>
            </div>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-sm leading-6 text-gray-300">
          {{ formatBalance(balance.quantity, balance) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0  text-sm leading-6 text-gray-300">
          {{ ((balance.quantity / balance.supply) * 100).toFixed(8) }}%
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-sm font-medium text-right">
          <NuxtLink :to="`/asset/${balance.asset}`" class="text-indigo-400 hover:text-indigo-300">View</NuxtLink>
        </td>
      </tr>
    </tbody>
  </table>
  <div ref="lastElement" v-if="!state.allDataLoaded"></div>
  <div v-if="state.allDataLoaded && state.balances.length > 0 || state.balances.length > 0 && state.balances.length < 100" class="flex justify-center mt-16 sm:mt-20 lg:mt-24">
    <button @click="downloadCsv" class="flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300">
      <FolderArrowDownIcon class="mr-2 h-5 w-5 flex-shrink-0" aria-hidden="true" /> Download as CSV
    </button>
  </div>
</template>

<script setup>
import { FolderArrowDownIcon } from '@heroicons/vue/20/solid'
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';

const props = defineProps({
  address: String,
});

const state = reactive({
  balances: [],
  loading: false,
  allDataLoaded: false,
});

const observer = ref(null);
const lastElement = ref(null);

const fetchData = async () => {
  if (state.loading || state.allDataLoaded) return;

  state.loading = true;
  const query = `address=${props.address}&page=${Math.floor(state.balances.length / 100) + 1}`;

  try {
    const response = await fetch(`https://api.xcp.io/api/balances?${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    if (data.length < 100) {
      state.allDataLoaded = true;
    }

    state.balances.push(...data);
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    state.loading = false;
    if (state.allDataLoaded) {
      observer.value?.disconnect();
    }
  }
};

const handleIntersect = (entries) => {
  if (entries[0].isIntersecting && !state.allDataLoaded) {
    fetchData();
  }
};

onMounted(() => {
  fetchData();
  observer.value = new IntersectionObserver(handleIntersect, { threshold: 1.0 });
  if (lastElement.value) observer.value.observe(lastElement.value);
});

onUnmounted(() => {
  if (observer.value) observer.value.disconnect();
});

watch(lastElement, (el) => {
  if (el && observer.value) observer.value.observe(el);
});

const downloadCsv = () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Asset,Amount,% of Supply\n";

  state.balances.forEach((balance) => {
    const percentOfSupply = ((balance.quantity / balance.supply) * 100).toFixed(8);
    csvContent += `${balance.asset},${formatBalance(balance.quantity, balance)},${percentOfSupply}%\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "balances.csv");
  document.body.appendChild(link);

  link.click();
};

</script>
