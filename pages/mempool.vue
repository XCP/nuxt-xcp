<template>
  <MempoolHeader />

  <div class="my-6">
    <Tabs :tabs="tabs" :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Tab content -->
    <div v-if="activeTab === 'Activity'">
      <MempoolTable />
    </div>
    <div v-if="activeTab === 'Assets'">
      <MempoolAssetsTable />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tabs = [
  { name: 'Activity', hash: 'activity' },
  { name: 'Assets', hash: 'assets' }
];
const { activeTab, handleTabChange } = useTabs('Activity', tabs);

</script>
