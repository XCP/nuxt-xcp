<template>
  <div>
    <h1>API Test</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

definePageMeta({
  layout: 'empty'
});

const data = ref(null);
const loading = ref(true);
const error = ref(null);

const { $apiClient } = useNuxtApp();

onMounted(async () => {
  try {
    const response = await $apiClient.getBlocks({ limit: 1 });
    data.value = response;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
});
</script>
