<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="min-w-0 flex-1">
      <h1 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Collection
      </h1>
      <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
      </div>
    </div>
    <div class="hidden sm:block mt-5 flex lg:ml-4 lg:mt-0">
    </div>
  </div>

  <div class="my-6">
    <Tabs :tabs="tabs" :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Tab content -->
    <div v-if="activeTab === 'Activity'">
      <ActivityTable :collection="collection" />
    </div>
    <div v-if="activeTab === 'Assets'">
      <CollectionTable :collection="collection" />
    </div>
    <div v-if="activeTab === 'Credits'">
      <CreditsTable :collection="collection" category="credits" />
    </div>
    <div v-if="activeTab === 'Debits'">
      <DebitsTable :collection="collection" category="debits" />
    </div>
    <div v-if="activeTab === 'Dispensers'">
      <ActivityTable :collection="collection" category="dispensers" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, watchEffect } from 'vue';

const route = useRoute();
const collection = ref(route.params.collection);

const tabs = [
  { name: 'Activity' },
  { name: 'Assets' },
  { name: 'Credits' },
  { name: 'Debits' },
  { name: 'Dispensers' },
];
const activeTab = ref('Assets');

const handleTabChange = (selectedTab) => {
  activeTab.value = selectedTab;
};

watchEffect(() => {
  collection.value = route.params.collection;
});

</script>
