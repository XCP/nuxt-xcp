<template>
  <!-- Navigation -->
  <nav class="mt-6 sm:mt-0 flex items-center justify-between" aria-label="Pagination">
    <div class="flex items-center">
      <p v-if="state.assets.length < 100" class="text-base text-gray-300 leading-9">
        Showing
        <span class="font-medium">1</span>
        to
        <span class="font-medium">{{ state.assets.length }}</span>
        of
        <span class="font-medium">{{ state.assets.length }}</span>
        results
      </p>
      <p v-else class="text-base text-gray-300 leading-9">
        Scroll down to load more...
      </p>
    </div>
    <!-- Buttons -->
    <div class="flex">
      <!-- Refresh Results -->
      <button
        @click="refreshData(); trackEvent('Refresh Results')"
        class="bg-gray-800 text-gray-300 h-10	inline-flex items-center justify-center rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 focus:outline-none"
      >
        <ArrowPathIcon class="h-4 w-4" />
      </button>
    </div>
  </nav>

  <!-- Loading -->
  <div v-if="state.loading" class="flex justify-center items-center my-20 py-20 text-gray-300">
    <ArrowPathIcon class="animate-spin h-8 w-8 text-gray-500" aria-hidden="true" />
  </div>

  <!-- No Data -->
  <div v-if="state.assets.length === 0 && !state.loading" class="my-10 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No assets in mempool.</p>
      <p class="text-base text-gray-400">Try again in a couple of minutes.</p>
    </div>
  </div>

  <!-- Table View -->
  <div else class="mt-6 relative overflow-x-auto">
    <table class="w-full whitespace-nowrap text-left border-white/10">
      <thead class="border-t border-b border-white/10 text-base leading-6 text-white">
        <tr>
          <th scope="col" colspan="2" class="py-2 pr-2 font-semibold">Asset</th>
          <th scope="col" class="py-2 pr-2 font-semibold"># of Transactions</th>
          <th scope="col" class="py-2 pr-2 font-semibold"># of Addresses</th>
          <th scope="col" class="py-2 w-20"><span class="sr-only">View</span></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        <tr v-for="asset in state.assets" :key="asset.name">
          <td class="whitespace-nowrap py-3 pr-3">
            <div class="flex items-center gap-x-4">
              <NuxtImg :src="`https://api.xcp.io/img/icon/${asset.name}`" :alt="asset.name" class="h-10 w-10 bg-gray-800" loading="lazy" />
            </div>
          </td>
          <td class="whitespace-nowrap py-3 pr-3 min-w-64">
            <NuxtLink :to="`/asset/${asset.name}`" class="font-medium leading-6 text-base text-white">{{ asset.name }}</NuxtLink>
          </td>
          <td class="whitespace-nowrap py-3 pl-0 text-base leading-6 text-gray-300">
            {{ asset.numberOfTransactions }}
          </td>
          <td class="whitespace-nowrap py-3 pl-0 text-base leading-6 text-gray-300">
            {{ asset.numberOfAddresses }}
          </td>
          <td class="whitespace-nowrap py-3 pl-3 text-base font-medium text-right">
            <NuxtLink :to="`/asset/${asset.name}`" class="text-primary">View</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/20/solid';

const { trackEvent } = useFathom();

const state = reactive({
  loading: false,
  totalTransactions: 0,
  assets: []
});

const refreshData = () => {
  state.loading = false;
  state.totalTransactions = 0;
  state.assets = [];
  fetchData();
};

const { $apiClient } = useNuxtApp();

const fetchData = async () => {
  state.loading = true;

  let hasMoreData = true;
  let nextCursor = null;
  const addressSet = new Set();

  while (hasMoreData) {
    const params = {
      cursor: nextCursor,
      limit: 1000
    };

    try {
      const response = await $apiClient.getMempoolEvents(params);
      const data = response.data;

      const filteredData = [];
      const seenTxHashes = new Set();

      for (let i = 0; i < data.result.length - 1; i++) {
        const currentEvent = data.result[i];
        const nextEvent = data.result[i + 1];

        if (currentEvent.event === 'TRANSACTION_PARSED' && nextEvent.tx_hash === currentEvent.tx_hash) {
          if (!seenTxHashes.has(currentEvent.tx_hash)) {
            if (nextEvent.event !== 'DEBIT' && nextEvent.event !== 'CREDIT') {
              nextEvent.bindings = JSON.parse(nextEvent.bindings);

              const assetName = nextEvent.bindings.asset || nextEvent.bindings.give_asset;

              if (!assetName) {
                continue; // Skip events with no asset
              }

              if (nextEvent.category === 'dispenses') {
                const creditEvent = data.result.find(event => event.tx_hash === nextEvent.tx_hash && event.event === 'CREDIT');
                if (creditEvent) {
                  nextEvent.creditSource = JSON.parse(creditEvent.bindings).address;
                }
              }

              filteredData.push(nextEvent);
              seenTxHashes.add(currentEvent.tx_hash);

              // Count total transactions
              state.totalTransactions += 1;

              // Track unique addresses
              addressSet.add(nextEvent.bindings.source);
              if (nextEvent.creditSource) {
                addressSet.add(nextEvent.creditSource);
              }

              // Update asset data
              const asset = state.assets.find(a => a.name === assetName);
              if (asset) {
                asset.numberOfTransactions += 1;
                asset.addresses.add(nextEvent.bindings.source);
                if (nextEvent.creditSource) {
                  asset.addresses.add(nextEvent.creditSource);
                }
              } else {
                state.assets.push({
                  name: assetName,
                  numberOfTransactions: 1,
                  addresses: new Set([nextEvent.bindings.source, nextEvent.creditSource].filter(Boolean))
                });
              }
            }
          }
        }
      }

      if (filteredData.length < 1000) {
        hasMoreData = false;
      }

      nextCursor = data.next_cursor;
    } catch (error) {
      console.error('Fetch summary data error:', error);
      hasMoreData = false;
    }
  }

  // Update number of addresses for each asset and remove the addresses set
  state.assets.forEach(asset => {
    asset.numberOfAddresses = asset.addresses.size;
    delete asset.addresses;
  });

  // Sort assets by number of addresses and then by number of transactions
  state.assets.sort((a, b) => {
    if (b.numberOfAddresses === a.numberOfAddresses) {
      return b.numberOfTransactions - a.numberOfTransactions;
    }
    return b.numberOfAddresses - a.numberOfAddresses;
  });

  state.loading = false;
};

onMounted(() => {
  fetchData();
});
</script>
