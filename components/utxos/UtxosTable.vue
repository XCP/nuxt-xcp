<template>
  <div class="text-white">
    <div v-if="state.loading" class="text-center">
      Loading...
    </div>
    <div v-else>
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold">Inputs & Outputs</h2>
        <button @click="toggleDetails" class="bg-blue-500 text-white px-4 py-2 rounded-md">
          {{ showDetails ? 'Hide Details' : 'Show Details' }}
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <!-- Inputs -->
        <div class="flex flex-col space-y-4">
          <div v-for="input in state.inputs" :key="input.txid" class="bg-gray-700/10 p-4 rounded-md break-all">
            <div class="flex justify-between items-center mb-2">
              <NuxtLink
                :to="`/address/${input.address}`"
                class="font-medium leading-6 text-base text-red-500"
              >
                {{ input.address }}
              </NuxtLink>
              <span class="text-gray-400">{{ formatBalance(input.value) }} BTC</span>
            </div>
            <div v-if="showDetails" class="text-sm">
              <table class="w-full">
                <tbody>
                  <tr>
                    <td class="text-gray-400 min-w-36 align-top">ScriptSig (ASM):</td>
                    <td class="break-all pb-2">{{ input.scriptSig.asm }}</td>
                  </tr>
                  <tr>
                    <td class="text-gray-400 min-w-36 align-top">ScriptSig (HEX):</td>
                    <td class="break-all pb-2">{{ input.scriptSig.hex }}</td>
                  </tr>
                  <tr>
                    <td class="text-gray-400 min-w-36 align-top">Sequence:</td>
                    <td class="break-all pb-2">{{ input.sequence }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Outputs -->
        <div class="flex flex-col space-y-4">
          <div v-for="output in state.transaction.vout" :key="output.n" class="bg-gray-700/10 p-4 rounded-md break-all">
            <div class="flex justify-between items-center mb-2">
              <NuxtLink
                v-if="output.scriptPubKey.address"
                :to="`/address/${output.scriptPubKey.address}`"
                class="font-medium leading-6 text-base text-green-500"
              >
              {{ output.scriptPubKey.address }}
              </NuxtLink>
              <span v-else class="font-medium leading-6 text-base text-green-500">OP_RETURN</span>
              <span class="text-gray-400">{{ formatBalance(output.value) }} BTC</span>
            </div>
            <div v-if="showDetails" class="text-sm">
              <table class="w-full">
                <tbody class="space-y-2">
                  <tr>
                    <td class="text-gray-400 min-w-36 align-top">ScriptPubKey (ASM):</td>
                    <td class="break-all pb-2">{{ output.scriptPubKey.asm }}</td>
                  </tr>
                  <tr>
                    <td class="text-gray-400 min-w-36 align-top">ScriptPubKey (HEX):</td>
                    <td class="break-all pb-2">{{ output.scriptPubKey.hex }}</td>
                  </tr>
                  <tr>
                    <td class="text-gray-400 min-w-36 align-top">Type:</td>
                    <td class="break-all pb-2">{{ output.scriptPubKey.type }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <h2 class="text-xl font-semibold">Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-gray-700/10 p-4 rounded-md">
          <div class="space-y-1">
            <div><span class="text-gray-400">Size:</span> {{ state.transaction.size }} B</div>
            <div><span class="text-gray-400">Virtual size:</span> {{ state.transaction.vsize }} vB</div>
            <div><span class="text-gray-400">Weight:</span> {{ state.transaction.weight }} WU</div>
          </div>
          <div class="space-y-1">
            <div><span class="text-gray-400">Fee:</span> {{ state.transactionDetails.fee }} satoshis</div>
            <div><span class="text-gray-400">Fee rate:</span> {{ feeRate }} sat/vB</div>
          </div>
          <div class="space-y-1">
            <div><span class="text-gray-400">Version:</span> {{ state.transaction.version }}</div>
            <div><span class="text-gray-400">Locktime:</span> {{ state.transaction.locktime }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="state.error" class="text-red-500 text-center mt-4">
      {{ state.error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useNuxtApp } from '#app';

// Define props
const props = defineProps({
  txHash: {
    type: String,
    required: true,
  },
});

// Define state
const state = ref({
  transaction: null,
  transactionDetails: null,
  inputs: [],
  loading: true,
  error: null,
});

// Toggle details visibility
const showDetails = ref(false);
const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

// Compute fee rate
const feeRate = computed(() => {
  if (state.value.transactionDetails && state.value.transaction.vsize) {
    return (state.value.transactionDetails.fee / state.value.transaction.vsize).toFixed(2);
  }
  return null;
});

// Fetch data function
const fetchTransactionDetails = async (txHash) => {
  const { $apiClient } = useNuxtApp();
  const response = await $apiClient.getTransactionByHash(txHash, true);
  return response.data.result;
};

const fetchTransaction = async () => {
  state.value.loading = true;
  state.value.error = null;

  try {
    const { $apiClient } = useNuxtApp();
    const response = await $apiClient.getBitcoinTransaction({
      tx_hash: props.txHash,
      format: 'json',
      verbose: false,
    });

    state.value.transaction = response.data.result;

    // Fetch additional transaction details
    const transactionDetails = await fetchTransactionDetails(props.txHash);
    state.value.transactionDetails = transactionDetails;

    // Fetch inputs details
    const inputs = await Promise.all(state.value.transaction.vin.map(async (input) => {
      const inputResponse = await $apiClient.getBitcoinTransaction({
        tx_hash: input.txid,
        format: 'json',
        verbose: false,
      });

      const inputTransaction = inputResponse.data.result;
      const matchingOutput = inputTransaction.vout.find(vout => vout.n === input.vout);

      return {
        txid: input.txid,
        address: matchingOutput.scriptPubKey.address,
        value: matchingOutput.value,
        scriptSig: input.scriptSig,
        sequence: input.sequence,
      };
    }));

    state.value.inputs = inputs;

  } catch (error) {
    state.value.error = 'Error fetching transaction data';
  } finally {
    state.value.loading = false;
  }
};

// Format balance
const formatBalance = (value) => {
  return value.toFixed(8);
};

// Fetch data on component mount
onMounted(() => {
  fetchTransaction();
});
</script>
