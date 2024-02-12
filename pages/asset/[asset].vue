<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="min-w-0 flex-1">
      <h1 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        {{ asset }}
      </h1>
      <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
        <div class="mt-2 flex items-center text-sm text-gray-300">
          <BriefcaseIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
          {{ apiData.owner }}
        </div>
      </div>
    </div>
    <div class="hidden sm:block mt-5 flex lg:ml-4 lg:mt-0">
      <Dropdown :items="dropdownItems" />
    </div>
  </div>

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

  <div class="rounded-md bg-green-900 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-green-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-green-200">Order completed</h3>
        <div class="mt-2 text-sm text-green-300">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam.</p>
        </div>
        <div class="mt-4">
          <div class="-mx-2 -my-1.5 flex">
            <button type="button" class="rounded-md bg-green-800 px-2 py-1.5 text-sm font-medium text-green-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-900">View status</button>
            <button type="button" class="ml-3 rounded-md bg-green-800 px-2 py-1.5 text-sm font-medium text-green-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-900">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="my-6">
    <Tabs :tabs="tabs" :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Tab content -->
    <div v-if="activeTab === 'Messages'">
      <MessagesTable :asset="asset" />
    </div>
    <div v-if="activeTab === 'Holders'">
      <BalancesTable :asset="asset" />
    </div>
    <div v-if="activeTab === 'Credits'">
      <CreditsTable :asset="asset" category="credits" />
    </div>
    <div v-if="activeTab === 'Debits'">
      <DebitsTable :asset="asset" category="debits" />
    </div>
  </div>
</template>

<script setup>
import {
  BriefcaseIcon,
} from '@heroicons/vue/20/solid';
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const asset = ref(route.params.asset);
const apiData = ref({ block_index: 0, divisible: 0, locked: 0, supply: 0, owner: '', issuer: '', type: '', asset_name: '', asset_longname: '' });

const dropdownItems = computed(() => [
  {
    href: `https://pepe.wtf/asset/${asset.value}`,
    imgSrc: '/img/pepewtf.png',
    title: 'pepe.wtf',
  },
  {
    href: `https://scarce.city/marketplace/digital/${asset.value}`,
    imgSrc: '/img/scarcecity.png',
    title: 'scarce.city',
  },
  {
    href: `https://www.xchain.io/asset/${asset.value}`,
    imgSrc: '/img/xchainio.png',
    title: 'xchain.io',
  },
  {
    href: `https://www.xcp.dev/asset/${asset.value}`,
    imgSrc: '/img/xcpdev.png',
    title: 'xcp.dev',
  },
  {
    href: `https://xcp.ninja/asset/${asset.value}`,
    imgSrc: '/img/xcpninja.png',
    title: 'xcp.ninja',
  }
]);

const tabs = [
  { name: 'Activity' },
  { name: 'Balances' },
  { name: 'Credits' },
  { name: 'Debits' },
];
const activeTab = ref('Messages');

const handleTabChange = (selectedTab) => {
  activeTab.value = selectedTab;
};

const fetchData = async () => {
  try {
    const response = await fetch(`https://api.xcp.io/api/assets?asset=${asset.value}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    apiData.value.block_index = data.data[0].block_index;
    apiData.value.divisible = data.data[0].divisible;
    apiData.value.locked = data.data[0].locked;
    apiData.value.supply = data.data[0].supply;
    apiData.value.owner = data.data[0].owner;
    apiData.value.issuer = data.data[0].issuer;
    apiData.value.type = data.data[0].type;
    apiData.value.asset_name = data.data[0].asset_name;
    apiData.value.asset_longname = data.data[0].asset_longname;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

watchEffect(() => {
  asset.value = route.params.asset;
});

onMounted(() => {
  fetchData();
});

const stats = [
  { name: 'Number of deploys', value: '405' },
  { name: 'Average deploy time', value: '3.65', unit: 'mins' },
  { name: 'Number of servers', value: '3' },
  { name: 'Success rate', value: '98.5%' },
]

useSeoMeta({
  title: asset.value,
  ogTitle: asset.value,
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})

</script>
