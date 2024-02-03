<template>
  <!-- No Results View -->
  <div v-if="state.balances.length === 0" class="my-10 flex justify-center items-center">
    <div class="text-center">
      <p class="text-lg text-gray-500">No results found.</p>
      <p class="text-sm text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
    </div>
  </div>
  <!-- Table -->
  <table v-else class="mt-6 w-full whitespace-nowrap text-left">
    <colgroup>
      <col class="w-full sm:w-6/12" />
      <col class="lg:w-6/12" />
    </colgroup>
    <thead class="border-b border-white/10 text-sm leading-6 text-white">
      <tr>
        <th scope="col" class="py-2 pr-0 font-semibold">Asset</th>
        <th scope="col" class="py-2 pl-0 font-semibold">Amount</th>
        <th scope="col" class="py-2 pl-0 font-semibold">% of Supply</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
      <tr v-for="balance in state.balances" :key="balance.asset">
        <td class="whitespace-nowrap py-3 pr-3">
          <div class="flex items-center gap-x-4">
              <img :src="`https://xchain.io/icon/${balance.asset}.png`" :alt="balance.asset" class="h-5 w-5 bg-gray-800" />
              <NuxtLink :to="`/asset/${balance.asset}`" class="font-medium leading-6 text-white">{{ balance.asset }}</NuxtLink>
            </div>
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-sm leading-6 text-gray-300">
          {{ formatBalance(balance.quantity, balance) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0  text-sm leading-6 text-gray-300">
          {{ ((balance.quantity / balance.supply) * 100).toFixed(8) }}%
        </td>
      </tr>
    </tbody>
  </table>
  <div ref="lastElement" v-if="!state.allDataLoaded">
    <ArrowPathIcon class="h-5 w-5" aria-hidden="true" />
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';

const props = defineProps({
  address: String,
});

const state = reactive({
  balances: [],
  loading: false,
  allDataLoaded: false,
});

const observer = ref(null);
const lastElement = ref(null);

const fetchData = async () => {
  if (state.loading || state.allDataLoaded) return;

  state.loading = true;
  const query = `address=${props.address}&page=${state.balances.length / 100 + 1}`;

  try {
    const response = await fetch(`https://api.xcp.io/api/balances?${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    if (data.length === 0) {
      state.allDataLoaded = true;
    } else {
      state.balances.push(...data);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    state.loading = false;
  }
};

const handleIntersect = (entries, observer) => {
  if (entries[0].isIntersecting) {
    fetchData();
  }
};

onMounted(() => {
  fetchData();
  observer.value = new IntersectionObserver(handleIntersect, { threshold: 1.0 });
  if (lastElement.value) observer.value.observe(lastElement.value);
});

onUnmounted(() => {
  if (observer.value) observer.value.disconnect();
});

watch(lastElement, (el) => {
  if (el && observer.value) observer.value.observe(el);
});

</script>
