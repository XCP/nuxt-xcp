<template>
  <div class="container mx-auto">
    <div class="lg:flex lg:items-start lg:justify-between lg:gap-x-8">
      <!-- Image Container -->
      <div @click="toggleModal" class="lg:w-1/3 lg:cursor-pointer">
        <!-- Aspect Ratio Block -->
        <div class="aspect-w-5 aspect-h-7 w-full rounded-3xl border border-gray-700 rounded bg-gray-800">
          <Image :asset="asset" :apiData="apiData" />
        </div>
      </div>

      <!-- Header Content -->
      <div class="lg:w-2/3 mt-6 lg:mt-0">
        <div class="lg:flex lg:items-center lg:justify-between">
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
              {{ asset }}
            </h1>
          </div>
          <div class="hidden sm:block mt-5 flex lg:ml-4 lg:mt-0">
            <Dropdown :items="dropdownItems" /> 
          </div>
        </div>
        <div v-if="filteredTags" class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-2">
          <div v-for="tag in filteredTags" class="mt-2 flex items-center text-lg text-gray-300">
            <CheckBadgeIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400" aria-hidden="true" />
            <a :href="`/collection/${tag.slug}`">{{ tag.name }}</a>
            <span v-if="tag.stamp && apiData.messages?.bindings?.description?.toLowerCase().includes('stamp:')" class="ml-2 inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">Stamp</span>
          </div>
        </div>
        <div v-else class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-2">
          <div class="mt-2 flex items-center text-lg text-gray-300">
            <ArrowPathIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500 animate-spin" aria-hidden="true" />
            <span>Loading...</span>
          </div>
        </div>
        <header class="mt-6">
          <!-- Heading -->
          <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <div class="flex items-center gap-x-3">
                <h2 class="flex gap-x-3 text-base leading-7">
                  <span class="font-semibold text-white">Floor Price: 0.10000000 BTC</span>
                </h2>
              </div>
              <p class="mt-2 text-xs leading-6 text-gray-400">Deploys from GitHub via main branch</p>
            </div>
            <div class="order-first flex-none rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-400/30 sm:order-none">Production</div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="(stat, statIdx) in stats" :key="stat.name" :class="[statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '', 'border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">{{ stat.name }}</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ stat.value }}</span>
                <span v-if="stat.unit" class="text-sm text-gray-400">{{ stat.unit }}</span>
                <span v-if="stat.lock === 'locked'" class="text-sm text-gray-400">
                  <LockClosedIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
                </span>
                <span v-if="stat.lock === 'unlocked'" class="text-sm text-gray-400">
                  <LockOpenIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
                </span>
              </p>
            </div>
          </div>
        </header>
      </div>
    </div>
  </div>

  <div class="my-6">
    <Tabs :tabs="tabs" :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Tab content -->
    <div v-if="activeTab === 'Activity'">
      <MessagesTable :asset="asset" />
    </div>
    <div v-if="activeTab === 'Balances'">
      <HoldersTable :asset="asset" />
    </div>
    <div v-if="activeTab === 'Dispensers'">
      <DispensersTable :asset="asset" />
    </div>
    <div v-if="activeTab === 'Orders'">
      <OrdersTable :baseAsset="asset" />
    </div>
  </div>

  <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center">
      <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="toggleModal"></div>

      <!-- Modal Content -->
      <div class="inline-block transform overflow-hidden bg-black rounded-3xl shadow-xl transition-all my-8 align-middle max-w-xl w-full">
        <div class="flex items-start">
          <!-- Here you put the content you want inside the modal, for example, an image -->
          <div class="w-full">
            <!-- Image goes here -->
            <Image :asset="asset" :apiData="apiData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  LockOpenIcon,
  LockClosedIcon,
  ArrowPathIcon,
  CheckBadgeIcon
} from '@heroicons/vue/20/solid';
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const { isDesktop } = useDevice();

const route = useRoute();
const asset = ref(route.params.asset);
const apiData = ref({ block_index: 0, divisible: 0, locked: 0, supply: 0, owner: '', issuer: '', type: '', asset_name: '', asset_longname: '', messages: [], tags: [] });
const showModal = ref(false);

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
  { name: 'Activity', hash: 'activity' },
  { name: 'Balances', hash: 'balances' },
  { name: 'Dispensers', hash: 'dispensers' },
  { name: 'Orders', hash: 'orders' },
];
const { activeTab, handleTabChange } = useTabs('Balances', tabs);

const toggleModal = () => {
  if (isDesktop) {
    showModal.value = !showModal.value;
  }
};

const fetchData = async () => {
  try {
    const response = await fetch(`https://api.xcp.io/api/v1/asset?asset=${asset.value}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    apiData.value.block_index = data.block_index;
    apiData.value.divisible = data.divisible;
    apiData.value.locked = data.locked;
    apiData.value.supply = data.supply;
    apiData.value.owner = data.owner;
    apiData.value.issuer = data.issuer;
    apiData.value.type = data.type;
    apiData.value.tags = data.tags;
    apiData.value.messages = data.messages;
    apiData.value.asset_name = data.asset_name;
    apiData.value.asset_longname = data.asset_longname;
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

const filteredTags = computed(() => {
  return apiData.value.tags.filter(tag => tag.type === 'collection');
});

const stats = computed(() => [
  { name: 'Market Cap', value: '$300,000', unit: '5.6 BTC' },
  { name: '# Supply', value: formatSupply(apiData.value.supply, apiData.value).replace('.00', ''), lock: apiData.value.locked ? 'locked' : 'unlocked' },
  { name: 'Year Issued', value: new Date(apiData.value.messages.confirmed_at).getFullYear().toString() },
]);

const encodedData = computed(() => {
  const jsonData = JSON.stringify({
    name: asset.value,
    imageUrl: !asset.value.includes('.') 
      ? `https://api.xcp.io/img/full/${asset.value}` 
      : `https://api.xcp.io/img/full/${apiData.asset_name}`
  });
  return btoa(encodeURIComponent(jsonData));
});

useSeoMeta({
  title: asset.value,
  ogTitle: asset.value,
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: `https://api.xcp.io/img/share?data=${encodedData.value}`,
  twitterCard: 'summary_large_image',
})
</script>
