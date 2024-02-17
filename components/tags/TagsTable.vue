<template>
  <!-- Pagination -->
  <nav class="mt-6 sm:mt-0 flex items-center justify-between" aria-label="Pagination">
    <div class="flex items-center">
      <p class="text-sm text-gray-300 leading-9">
        <p>Tracking <span class="font-medium">{{ totalAssetsCount.toLocaleString() }}</span> assets in <span class="font-medium">{{ state.tags.length.toLocaleString() }}</span> collections.</p>
      </p>
    </div>
    <!-- Table/Grid Toggle Buttons -->
    <div class="flex">
      <!-- Table View Button -->
      <button
        @click="viewMode = 'table'; trackEvent('List View')"
        class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-700 focus:outline-none"
        :class="{ 'bg-gray-700 text-white': viewMode === 'table', 'bg-gray-800 text-gray-300': viewMode === 'grid' }"
      >
        <ListBulletIcon class="h-4 w-4" />
      </button>
      <!-- Grid View Button -->
      <button
        @click="viewMode = 'grid'; trackEvent('Grid View')"
        class="ml-2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-700 focus:outline-none"
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
  <div v-if="state.tags.length === 0" class="my-10 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No results found.</p>
      <p class="text-sm text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
    </div>
  </div>

  <!-- Grid View -->
  <div v-if="viewMode === 'grid' && state.tags.length > 0" class="grid grid-cols-2 sm:grid-cols-4 2xl:grid-cols-6 gap-4 mt-6">
    <div v-for="tag in state.tags" :key="tag.slug" class="flex flex-col overflow-hidden rounded-2xl border border-gray-700 rounded bg-gray-800">
      
      <!-- Nuxt Link Wrapping the Image and Asset Name -->
      <NuxtLink :to="`/collection/${tag.slug}`">
        
        <!-- Aspect Ratio Block -->
        <div class="aspect-w-5 aspect-h-7 w-full">
          <NuxtImg :src="`https://api.xcp.io/img/logo/${tag.slug}`" :alt="tag.name" class="rounded-2xl object-contain w-full h-full" :style="tag.stamp ? 'image-rendering: pixelated' : null" loading="lazy" />
        </div>

        <div class="p-4 pb-0">
          <!-- Asset Name -->
          <div class="font-medium leading-6 text-white">{{ tag.name }}</div>
        </div>
      </NuxtLink>
      
      <div class="p-4 pt-0">
        <div class="text-sm leading-6 text-gray-300">{{ tag.assets_count.toLocaleString() }}</div>
      </div>
      
    </div>
  </div> 

  <!-- Table View -->
  <table v-else-if="state.tags.length > 0" class="mt-6 w-full whitespace-nowrap text-left border-white/10">
    <thead class="border-t border-b border-white/10 text-sm leading-6 text-white">
      <tr>
        <th scope="col" class="py-2 pr-2 font-semibold">Collection</th>
        <th scope="col" class="py-2 pr-2 font-semibold">Assets</th>
        <th scope="col" class="py-2 w-20"><span class="sr-only">View</span></th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
      <tr v-for="tag in state.tags" :key="tag.slug">
        <td class="whitespace-nowrap py-3 pr-3">
          <div class="flex items-center gap-x-4">
              <NuxtImg :src="`https://api.xcp.io/img/icon/${tag.slug}`" :alt="tag.name" class="h-5 w-5 bg-gray-800" loading="lazy" />
              <NuxtLink :to="`/collection/${tag.slug}`" class="font-medium leading-6 text-white">{{ tag.name }}</NuxtLink>
            </div>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-sm leading-6 text-gray-300">
          {{ tag.assets_count.toLocaleString() }}
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-sm font-medium text-right">
          <NuxtLink :to="`/collection/${tag.slug}`" class="text-primary">View</NuxtLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ArrowPathIcon, FolderArrowDownIcon, ListBulletIcon, ViewColumnsIcon, } from '@heroicons/vue/20/solid'
import { computed, ref, onMounted, onUnmounted, reactive, watch } from 'vue';
const { trackEvent } = useFathom();

const props = defineProps({
  type: String,
});

const state = reactive({
  tags: [],
  loading: false,
});

const viewMode = ref('grid');

const totalAssetsCount = computed(() => {
  return state.tags.reduce((sum, tag) => sum + tag.assets_count, 0);
});

const fetchData = async () => {
  if (state.loading) return;

  state.loading = true;

  try {
    const response = await fetch(`https://api.xcp.io/api/v1/tags?type=${props.type}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    state.tags.push(...data);
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    state.loading = false;
  }
};

onMounted(() => {
  fetchData();
});

</script>
