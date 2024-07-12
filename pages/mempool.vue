<template>
  <div>
    <MempoolHeader />

    <div class="my-6">
      <NavigationTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />

      <!-- Tab content -->
      <div v-if="activeTab === 'Activity'">
        <MempoolTable />
      </div>
      <div v-if="activeTab === 'Assets'">
        <MempoolAssetsTable />
      </div>
    </div>
  </div>
</template>

<script setup>
const tabs = [
  { name: 'Activity', hash: 'activity' },
  { name: 'Assets', hash: 'assets' },
]
const { activeTab, handleTabChange } = useTabs('Activity', tabs)
</script>
