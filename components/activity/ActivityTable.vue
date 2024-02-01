<template>
  <!-- Pagination -->
  <nav class="flex items-center justify-between" aria-label="Pagination">
    <div class="hidden sm:block">
      <p class="text-sm text-gray-300">
        Showing
        <span class="font-medium">{{ (state.currentPage - 1) * 100 + 1 }}</span>
        to
        <span class="font-medium">{{ Math.min(state.currentPage * 100, state.totalItems) }}</span>
        of
        <span class="font-medium">{{ state.totalItems }}</span>
        results
      </p>
    </div>
    <div class="flex flex-1 justify-between sm:justify-end">
      <!-- First Page Button -->
      <button
        @click="goToPage(1)"
        class="relative inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-gray-500 hover:bg-gray-700 focus-visible:outline-offset-0 disabled:hover:bg-gray-800"
        :disabled="state.currentPage === 1"
      >
        &laquo;
      </button>
      <!-- Previous Page Button -->
      <button
        @click="goToPage(state.currentPage - 1)"
        class="relative ml-3 inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-gray-500 hover:bg-gray-700 focus-visible:outline-offset-0 disabled:hover:bg-gray-800"
        :disabled="state.currentPage <= 1"
      >
        &lsaquo;
      </button>
      <!-- Next Page Button -->
      <button
        @click="goToPage(state.currentPage + 1)"
        class="relative ml-3 inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-gray-500 hover:bg-gray-700 focus-visible:outline-offset-0 disabled:hover:bg-gray-800"
        :disabled="state.currentPage >= state.lastPage"
      >
        &rsaquo;
      </button>
      <!-- Last Page Button -->
      <button
        @click="goToPage(state.lastPage)"
        class="relative ml-3 inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-gray-500 hover:bg-gray-700 focus-visible:outline-offset-0 disabled:hover:bg-gray-800"
        :disabled="state.currentPage === state.lastPage"
      >
        &raquo;
      </button>
    </div>
  </nav>
  <!-- Loading -->
  <div v-if="state.loading" class="flex justify-center items-center my-10 text-gray-300">
    <ArrowPathIcon class="animate-spin h-8 w-8 text-gray-500" aria-hidden="true" />
  </div>
  <!-- No Data -->
  <div v-else-if="state.messages.length === 0" class="my-10 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No results found.</p>
      <p class="text-sm text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
    </div>
  </div>
  <!-- Table -->
  <div v-else class="mt-6 overflow-x-scroll">
    <table class="table-auto w-full whitespace-nowrap text-left">
      <colgroup>
        <col class="w-full sm:w-2/12" />
        <col class="lg:w-3/12" />
        <col class="lg:w-2/12" />
        <col class="lg:w-3/12" />
        <col class="lg:w-2/12" />
      </colgroup>
      <thead class="border-b border-white/10 text-sm leading-6 text-white">
        <tr>
          <th scope="col" class="py-2 pr-8 font-semibold">Type</th>
          <th scope="col" class="py-2 pl-0 pr-8 font-semibold sm:table-cell">Asset</th>
          <th scope="col" class="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">Quantity</th>
          <th scope="col" class="py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20">Summary</th>
          <th scope="col" class="py-2 pl-0 text-right font-semibold sm:table-cell">Timestamp</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        <tr v-for="item in state.messages" :key="item.id">
          <td class="py-3 pr-8">
            <div class="flex items-center gap-x-4 leading-6">
              <Badge :category="item.category" />
            </div>
          </td>
          <td class="py-3 pl-0 pr-4 sm:table-cell sm:pr-8">
            <NuxtLink :to="`/asset/${formatAssetName(item.asset_name, item.asset)}`" class="leading-6 font-medium text-white">
              {{ formatAssetName(item.asset_name, item.asset) }}
            </NuxtLink>
          </td>
          <td class="py-3 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20 text-gray-300">
            {{ item.bindings.quantity || item.bindings.dispense_quantity ? formatBalance(item.bindings.quantity ?? item.bindings.dispense_quantity, item.asset) : '' }}
          </td>
          <td class="py-3 pl-0 pr-8 text-sm leading-6 text-gray-300 md:table-cell lg:pr-20">
            {{ summarize(item) }}
          </td>
          <td class="py-3 pl-0 text-right text-sm leading-6 text-gray-300 sm:table-cell">
            <time :datetime="item.created_at">{{ new Date(item.confirmed_at).toLocaleString() }}</time>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { defineEmits, onMounted, reactive, watchEffect } from 'vue'

const props = defineProps({
  asset: String,
  address: String,
  command: String,
  category: String,
  initialPage: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['last-message'])

const state = reactive({
  messages: [],
  currentPage: props.initialPage,
  lastPage: 1,
  totalItems: 0,
  loading: true,
})

async function fetchData(page = state.currentPage) {
  state.loading = true;
  let query = `page=${page}`;

  if (props.asset) {
    query += `&asset_name=${props.asset}`;
  }

  if (props.address) {
    query += `&address=${props.address}`;
  }

  if (props.command) {
    query += `&command=${props.command}`;
  }

  if (props.category) {
    query += `&category=${props.category}`;
  }

  try {
    const response = await fetch(`https://api.xcp.io/api/messages?${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    state.messages = data.data;
    state.currentPage = data.current_page;
    state.lastPage = data.last_page;
    state.totalItems = data.total

    if (state.currentPage === 1 && state.messages.length > 0) {
      emit('last-message', state.messages[0])
    }

  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    state.loading = false;
  }
}

onMounted(fetchData);

watchEffect(() => {
  fetchData(1);
});

function goToPage(page) {
  fetchData(page);
}

function summarize(message) {
  switch (message.category) {
    case 'bet_expirations':
      return `Bet expired for ${message.bindings.bet_hash}`;
    case 'bet_match_expirations':
      return `Bet match expired between ${message.bindings.tx0_address} and ${message.bindings.tx1_address}`;
    case 'bet_match_resolutions':
      return `Bet match resolved: ${message.bindings.winner}`;
    case 'bet_matches':
      return `Bet matched between ${message.bindings.tx0_address} and ${message.bindings.tx1_address}`;
    case 'bets':
      return `Bet placed by ${message.bindings.source}`;
    case 'broadcasts':
      return `Broadcast: ${message.bindings.text}`;
    case 'btcpays':
      return `BTC paid to ${message.bindings.destination}`;
    case 'cancels':
      return `Cancel order: ${message.bindings.offer_hash}`;
    case 'order_expirations':
      return `Order expired: ${message.bindings.order_hash}`;
    case 'order_match_expirations':
      return `Order match expired between ${message.bindings.tx0_address} and ${message.bindings.tx1_address}`;
    case 'order_matches':
      return `Order matched between ${message.bindings.tx0_address} and ${message.bindings.tx1_address}`;
    case 'orders':
      return `Order placed by ${message.bindings.source} for ${message.bindings.get_asset}`;
    case 'replace':
      return `Replacement by ${message.bindings.address}`;
    case 'rps':
      return `RPS game by ${message.bindings.source} with ${message.bindings.possible_moves} possible moves`;
    case 'rps_expirations':
      return `RPS game expired for ${message.bindings.source}`;
    case 'rps_match_expirations':
      return `RPS match expired between ${message.bindings.tx0_address} and ${message.bindings.tx1_address}`;
    case 'rps_matches':
      return `RPS match between addresses`;
    case 'rpsresolves':
      return `RPS resolved with move ${message.bindings.move}`;
    case 'sweeps':
      return `Sweep performed by ${message.bindings.source}`;
    case 'credits':
      return `Credit to ${message.address}`;
    case 'debits':
      return `Debit from ${message.address}`;
    case 'issuances':
      return `Issuance of ${message.bindings.asset}`;
    case 'sends':
      return `Send to ${message.bindings.destination}`;
    case 'dispensers':
      return `Dispenser created by ${message.bindings.source}`;
    case 'dispenses':
      return `Dispense by ${message.bindings.source}`;
    case 'dividends':
      return `Dividend of ${message.bindings.asset}`;
    case 'destructions':
      return `Destruction of ${message.bindings.asset}`;
    case 'dispenser_refills':
      return `Dispenser refilled by ${message.bindings.source}`;
    case 'burns':
      return `Burn of ${message.bindings.burned} BTC`;
    default:
      return `Unknown category: ${message.category}`;
  }
}

</script>
