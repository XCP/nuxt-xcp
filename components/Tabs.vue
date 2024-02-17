<template>
  <!-- Mobile view: Dropdown -->
  <div class="sm:hidden">
    <label for="tabs" class="sr-only">Select a tab</label>
    <select
      id="tabs"
      class="block w-full text-white bg-gray-800 rounded text-sm focus:outline-none md:w-auto"
      @change="emitTabChange($event.target.value)"
    >
      <option v-for="tab in tabs" :key="tab.name" :value="tab.name" :selected="tab.name === activeTab">{{ tab.name }}</option>
    </select>
  </div>

  <!-- Desktop view: Tab links -->
  <div class="hidden sm:block mb-6">
    <nav class="flex" aria-label="Tabs">
      <ul class="flex w-full border-b border-white/10">
        <li v-for="(tab, index) in tabs" :key="tab.name" class="last:mr-0">
          <button
            @click="emitTabChange(tab.name)"
            :class="[
              'px-4 py-2 mr-[1px] text-sm font-medium rounded-none',
              tab.name === activeTab
                ? 'bg-white/10 text-white'
                : 'bg-gray-700/10 text-gray-300 hover:bg-white/20 hover:text-white'
            ]"
            class="first:rounded-tl-md last:rounded-tr-md"
          >
            {{ tab.name }}
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
const { trackEvent } = useFathom();

const props = defineProps({
  tabs: Array,
  activeTab: String
});

const emit = defineEmits(['tab-change']);

const emitTabChange = (selectedTab) => {
  trackEvent(selectedTab);
  emit('tab-change', selectedTab);
};
</script>
