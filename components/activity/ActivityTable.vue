<template>
  <Table apiUrl="https://api.xcp.io/api/messages" :queryParams="{ address: props.address }" :initialPage="props.initialPage">
    <template v-slot:table-headers>
      <tr>
        <th scope="col" class="py-2 pl-2 font-semibold">Type</th>
        <th scope="col" class="py-2 pl-0 font-semibold">Asset</th>
        <th scope="col" class="py-2 pl-0 font-semibold">Quantity</th>
        <th scope="col" class="py-2 pl-0 font-semibold">Address</th>
        <th scope="col" class="py-2 pl-0 font-semibold text-right">Block #</th>
        <th scope="col" class="py-2 pl-3"><span class="sr-only">View</span></th>
      </tr>
    </template>
    <template v-slot:table-rows="{ data }">
      <tr v-for="(item, index) in data" :key="index">
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
          {{ item.block_index.toLocaleString() }}
        </td>
        <td class="whitespace-nowrap py-3 pl-3 text-right text-sm font-medium">
          <NuxtLink :to="`/tx/${item.bindings.event}`" class="text-indigo-400 hover:text-indigo-300">View</NuxtLink>
        </td>
      </tr>
    </template>
  </Table>
</template>

<script setup>

const props = defineProps({
  address: String,
  initialPage: {
    type: Number,
    default: 1
  }
})

function summarize(message) {
  switch (message.category) {
    case 'bet_expirations':
      return `Bet expired for ${message.bindings.bet_hash}`;
    case 'bet_match_expirations':
      return message.bindings.tx1_address;
    case 'bet_match_resolutions':
      return message.bindings.winner;
    case 'bet_matches':
      return message.bindings.tx1_address;
    case 'bets':
      return `Bet placed by ${message.bindings.source}`;
    case 'broadcasts':
      return message.bindings.text;
    case 'btcpays':
      return message.bindings.destination;
    case 'cancels':
      return `Cancel order: ${message.bindings.offer_hash}`;
    case 'order_expirations':
      return `Order expired: ${message.bindings.order_hash}`;
    case 'order_match_expirations':
      return message.bindings.tx1_address;
    case 'order_matches':
      return message.bindings.tx1_address;
    case 'orders':
      return message.bindings.get_asset;
    case 'replace':
      return message.bindings.address;
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
      return message.bindings.destination;
    case 'credits':
      return message.address;
    case 'debits':
      return message.address;
    case 'issuances':
      return `Issuance of ${message.bindings.asset}`;
    case 'sends':
      return message.bindings.destination;
    case 'dispensers':
      return `Dispenser created by ${message.bindings.source}`;
    case 'dispenses':
      return message.bindings.source;
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
