<template>
  <!-- Pagination -->
  <nav class="mt-6 sm:mt-0 flex items-center justify-between" aria-label="Pagination">
    <div class="flex items-center">
      <p v-if="state.balances.length < 30" class="text-base text-gray-300 leading-9">
        Showing
        <span class="font-medium">1</span>
        to
        <span class="font-medium">{{ state.balances.length }}</span>
        of
        <span class="font-medium">{{ state.balances.length }}</span>
        results
      </p>
      <p v-else class="text-base text-gray-300 leading-9">
        Scroll down to load more...
      </p>
    </div>
    <!-- Table/Grid Toggle Buttons -->
    <div class="flex">
      <!-- Table View Button -->
      <button
        @click="viewMode = 'table'; trackEvent('List View')"
        class="inline-flex items-center justify-center rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 focus:outline-none"
        :class="{ 'bg-gray-700 text-white': viewMode === 'table', 'bg-gray-800 text-gray-300': viewMode === 'grid' }"
      >
        <ListBulletIcon class="h-4 w-4" />
      </button>
      <!-- Grid View Button -->
      <button
        @click="viewMode = 'grid'; trackEvent('Grid View')"
        class="ml-2 inline-flex items-center justify-center rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 focus:outline-none"
        :class="{ 'bg-gray-700 text-white ': viewMode === 'grid', 'bg-gray-800 text-gray-300': viewMode === 'table' }"
      >
        <ViewColumnsIcon class="h-4 w-4" />
      </button>
    </div>
  </nav>

  <!-- Loading -->
  <div v-if="state.loading" class="flex justify-center items-center my-20 py-20 text-gray-300">
    <ArrowPathIcon class="animate-spin h-8 w-8 text-gray-500" aria-hidden="true" />
  </div>

  <!-- No Data -->
  <div v-if="state.balances.length === 0" class="my-10 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No holders found.</p>
      <p class="text-base text-gray-400">The entire supply may be escrowed in a dex order or dispenser.</p>
    </div>
  </div>

  <!-- Grid View -->
  <div v-if="viewMode === 'grid' && state.balances.length > 0" class="grid grid-cols-2 sm:grid-cols-4 2xl:grid-cols-6 gap-4 mt-6">
    <div v-for="balance in state.balances" :key="balance.asset" class="flex flex-col overflow-hidden rounded-2xl border border-gray-700 rounded bg-gray-800">
      
      <!-- Nuxt Link Wrapping the Image and Asset Name -->
      <NuxtLink :to="`/asset/${balance.asset}`">
        
        <!-- Aspect Ratio Block -->
        <div class="aspect-w-5 aspect-h-7 w-full">
          <NuxtImg :src="`https://api.xcp.io/img/full/${balance.asset_name}`" :alt="balance.asset" class="rounded-2xl object-contain w-full h-full" :style="balance.asset.startsWith('A') ? 'image-rendering: pixelated' : null" loading="lazy" />
        </div>

        <div class="p-4 pb-0">
          <!-- Asset Name -->
          <div class="font-medium leading-6 text-white">{{ balance.asset }}</div>
        </div>
      </NuxtLink>
      
      <div class="p-4 pt-0">
        <div class="text-base leading-6 text-gray-300">{{ formatBalance(balance.quantity, balance) }}</div>
        <div class="text-base leading-6 text-gray-300">{{ ((balance.quantity / balance.supply) * 100).toFixed(8) }}%</div>
      </div>
      
    </div>
  </div>

  <!-- Table View -->
  <div v-else-if="state.balances.length > 0" class="mt-6 relative overflow-x-auto">
    <table class="table-auto w-full whitespace-nowrap text-left border-b border-white/10">
      <thead class="border-t border-b border-white/10 text-base leading-6 text-white">
        <tr>
          <th scope="col" class="py-2 pr-2 font-semibold">Asset</th>
          <th scope="col" class="py-2 pr-2 font-semibold">Amount</th>
          <th scope="col" class="py-2 pr-2 font-semibold">% of Supply</th>
          <th scope="col" class="py-2 pr-2 font-semibold">Address</th>
          <th scope="col" class="py-2 w-20"><span class="sr-only">View</span></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        <tr v-for="balance in state.balances" :key="balance.asset">
          <td class="whitespace-nowrap py-3 pr-3">
            <div class="flex items-center gap-x-4">
                <NuxtImg :src="`https://api.xcp.io/img/icon/${balance.asset_name}`" :alt="balance.asset" class="h-10 w-10 bg-gray-800" loading="lazy" />
                <NuxtLink :to="`/asset/${balance.asset}`" class="font-medium leading-6 text-white">{{ balance.asset }}</NuxtLink>
              </div>
          </td>
          <td class="whitespace-nowrap py-3 pl-0 text-base leading-6 text-gray-300">
            {{ formatBalance(balance.quantity, balance) }}
          </td>
          <td class="whitespace-nowrap py-3 pl-0 text-base leading-6 text-gray-300">
            {{ ((balance.quantity / balance.supply) * 100).toFixed(8) }}%
          </td>
          <td class="whitespace-nowrap py-3 pl-0 text-base leading-6 text-gray-300">
            <NuxtLink :to="`/address/${balance.address}`" class="font-medium leading-6 text-white">{{ balance.address }}</NuxtLink>
          </td>
          <td class="whitespace-nowrap py-3 pl-3 text-base font-medium text-right">
            <NuxtLink :to="`/address/${balance.address}`" class="text-primary">View</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div ref="lastElement" v-if="!state.allDataLoaded"></div>
</template>

<script setup>
import { ArrowPathIcon, FolderArrowDownIcon, ListBulletIcon, ViewColumnsIcon, } from '@heroicons/vue/20/solid'
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';
const { trackEvent } = useFathom();

const props = defineProps({
  asset: String,
});

const state = reactive({
  balances: [],
  loading: false,
  allDataLoaded: false,
  initialLoad: true,
});

const observer = ref(null);
const lastElement = ref(null);
const viewMode = ref('table');

const fetchData = async () => {
  if (state.loading || state.allDataLoaded) return;

  state.loading = true;

  const query = `asset=${props.asset}&page=${Math.floor(state.balances.length / 30) + 1}`;

  try {
    const response = await fetch(`https://api.xcp.io/api/v1/holders?${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    if (data.length < 30) {
      state.allDataLoaded = true;
    }

    state.balances.push(...data);
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    state.loading = false;
    state.initialLoad = false;
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

</script>
