<template>
  <div>
    <nav v-if="viewModes && viewModes.length > 1" class="flex justify-end space-x-2 p-4">
      <button v-for="mode in viewModes" :key="mode" @click="viewMode = mode" :class="{'text-blue-600': viewMode === mode, 'text-gray-500': viewMode !== mode}" class="focus:outline-none">
        <!-- Icons or text for toggling view modes could go here -->
        {{ mode.toUpperCase() }}
      </button>
    </nav>
    <div v-if="loading" class="flex justify-center items-center p-10">
      <span>Loading...</span> <!-- Placeholder, replace with a spinner or similar -->
    </div>
    <div v-if="items.length === 0 && !loading" class="text-center p-10">
      <span>No data found.</span>
    </div>
    <div v-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <slot name="grid-item" v-for="item in items" :key="item[itemKey]" :item="item"></slot>
    </div>
    <div v-else class="mt-6 relative overflow-x-auto"">
      <table class="w-full whitespace-nowrap text-left border-white/10">
        <thead>
          <slot name="table-header"></slot>
        </thead>
        <tbody>
          <slot name="table-row" v-for="item in items" :key="item[itemKey]" :item="item"></slot>
        </tbody>
      </table>
    </div>
    <div ref="lastElement"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watchEffect } from 'vue';

const props = defineProps({
  fetchUrl: String,
  queryParameters: Object,
  itemKey: String,
  viewModes: {
    type: Array,
    default: () => ['table', 'grid']
  },
});

const state = reactive({
  items: [],
  loading: false,
  allDataLoaded: false,
});
const viewMode = ref(props.viewModes[0]);
const lastElement = ref(null);
const observer = ref(null);

// Function to fetch data
const fetchData = async () => {
  if (state.loading || state.allDataLoaded) return;

  state.loading = true;
  const queryParams = new URLSearchParams(props.queryParameters).toString();
  const url = `${props.fetchUrl}?${queryParams}&page=${Math.ceil(state.items.length / 100) + 1}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    state.items.push(...data);
    if (data.length < 100) {
      state.allDataLoaded = true;
    }
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    state.loading = false;
  }
};

// IntersectionObserver callback
const handleIntersect = ([entry]) => {
  if (entry.isIntersecting && !state.allDataLoaded) {
    fetchData();
  }
};

// Setup and teardown of IntersectionObserver
onMounted(() => {
  observer.value = new IntersectionObserver(handleIntersect, { threshold: 1.0 });
  if (lastElement.value) observer.value.observe(lastElement.value);
  fetchData(); // Initial fetch
});

onUnmounted(() => {
  if (observer.value) observer.value.disconnect();
});

// Reactively watch query parameters to refetch data as they change
watchEffect(() => {
  state.items = []; // Reset items
  state.allDataLoaded = false; // Reset loading state
  fetchData(); // Fetch data with new parameters
});
</script>
