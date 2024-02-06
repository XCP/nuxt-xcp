<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="min-w-0 flex-1">
      <h1 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Counterparty Assets
      </h1>
    </div>
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
    <div v-for="asset in state.assets" :key="asset.asset_name" class="flex flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">
      <!-- Nuxt Link Wrapping the Image and Asset Name -->
      <NuxtLink :to="`/asset/${formatAssetName(asset.asset_name, asset)}`">
        <!-- Aspect Ratio Block -->
        <div class="aspect-w-5 aspect-h-7 w-full">
          <NuxtImg :src="`https://api.xcp.io/img/full/${asset.asset_name}`" :alt="formatAssetName(asset.asset_name, asset)" class="rounded-2xl object-contain w-full h-full" loading="lazy" />
        </div>
        <div class="p-4 pb-0">
          <!-- Asset Name -->
          <div class="font-medium leading-6 text-white">{{ formatAssetName(asset.asset_name, asset) }}</div>
        </div>
      </NuxtLink>
      <div class="p-4 pt-0">
        <div class="text-sm leading-6 text-gray-300">{{ formatBalance(asset.supply, asset) }}</div>
      </div>
    </div>
    <div ref="lastElement" v-if="!state.allDataLoaded"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
// Import necessary components and icons if you use them

// Reactive state to manage assets, loading state, and pagination
const state = reactive({
  assets: [],
  loading: false,
  allDataLoaded: false,
});

// References for the last element and the observer
const lastElement = ref(null);
const observer = ref(null);

// Async function to fetch data
const fetchData = async () => {
  if (state.loading || state.allDataLoaded) return;

  state.loading = true;
  // Modify the query to include pagination parameters correctly
  const query = `page=${Math.floor(state.assets.length / 100) + 1}`;

  try {
    const response = await fetch(`https://api.xcp.io/api/assets?${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    if (data.data.length < 100) {
      state.allDataLoaded = true;
    }

    state.assets.push(...data.data);
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    state.loading = false;
  }
};

// IntersectionObserver callback
const handleIntersect = (entries, observer) => {
  if (entries[0].isIntersecting && !state.allDataLoaded) {
    fetchData();
  }
};

// Lifecycle hooks to manage the observer
onMounted(() => {
  fetchData();
  observer.value = new IntersectionObserver(handleIntersect, {
    threshold: 1.0,
  });
  if (lastElement.value) {
    observer.value.observe(lastElement.value);
  }
});

onUnmounted(() => {
  observer.value.disconnect();
});
</script>
