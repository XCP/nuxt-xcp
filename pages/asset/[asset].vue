<template>
  <header>
    <!-- Secondary navigation -->
    <nav class="flex overflow-x-auto border-b border-white/10 py-4">
      <ul role="list" class="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8">
        <li v-for="item in secondaryNavigation" :key="item.name">
          <a :href="item.href" :class="item.current ? 'text-indigo-400' : ''">{{ item.name }}</a>
        </li>
      </ul>
    </nav>

    <!-- Heading -->
    <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
      <div>
        <div class="flex items-center gap-x-3">
          <div class="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
            <div class="h-2 w-2 rounded-full bg-current" />
          </div>
          <h1 class="flex gap-x-3 text-base leading-7">
            <span class="font-semibold text-white">Planetaria</span>
            <span class="text-gray-600">/</span>
            <span class="font-semibold text-white">mobile-api</span>
          </h1>
        </div>
        <p class="mt-2 text-xs leading-6 text-gray-400">Deploys from GitHub via main branch</p>
      </div>
      <div class="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">Production</div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(stat, statIdx) in stats" :key="stat.name" :class="[statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '', 'border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
        <p class="text-sm font-medium leading-6 text-gray-400">{{ stat.name }}</p>
        <p class="mt-2 flex items-baseline gap-x-2">
          <span class="text-4xl font-semibold tracking-tight text-white">{{ stat.value }}</span>
          <span v-if="stat.unit" class="text-sm text-gray-400">{{ stat.unit }}</span>
        </p>
      </div>
    </div>
  </header>

  <!-- Activity list -->
  <MessagesTable :asset="asset" />
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const asset = ref(route.params.asset);

watchEffect(() => {
  asset.value = route.params.asset;
});

const stats = [
  { name: 'Number of deploys', value: '405' },
  { name: 'Average deploy time', value: '3.65', unit: 'mins' },
  { name: 'Number of servers', value: '3' },
  { name: 'Success rate', value: '98.5%' },
]

</script>
