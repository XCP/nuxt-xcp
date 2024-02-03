<template>
  <div>
    <span v-if="message.category === 'bet_expirations'">
      <NuxtLink :to="`/tx/${message.bindings.bet_hash}`" class="leading-6 font-medium text-white">
        {{ message.bindings.bet_hash }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'bet_match_expirations'">{{ message.bindings.tx1_address }}</span>
    <span v-else-if="message.category === 'bet_match_resolutions'">{{ message.bindings.winner }}</span>
    <span v-else-if="message.category === 'bet_matches'">{{ message.bindings.tx1_address }}</span>
    <span v-else-if="message.category === 'bets'">Bet placed by {{ message.bindings.source }}</span>
    <span v-else-if="message.category === 'broadcasts'">{{ message.bindings.text }}</span>
    <span v-else-if="message.category === 'btcpays'">
      {{ formatBalance(message.bindings.btc_amount, {divisible: true}) }} BTC sent to
      <NuxtLink :to="`/address/${message.bindings.destination}`" class="leading-6 font-medium text-white">
        {{ message.bindings.destination }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'cancels'">
      <NuxtLink :to="`/tx/${message.bindings.offer_hash}`" class="leading-6 font-medium text-white">
        {{ message.bindings.offer_hash }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'order_expirations'">
      <NuxtLink :to="`/tx/${message.bindings.order_hash}`" class="leading-6 font-medium text-white">
        {{ message.bindings.order_hash }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'order_match_expirations'">{{ message.bindings.tx1_address }}</span>
    <span v-else-if="message.category === 'order_matches'">
      <strong>{{ formatBalance(message.bindings.forward_quantity, message.bindings.forward_asset) }}</strong>
      <span>{{ message.bindings.forward_asset }}</span>
      exchanged for
      <strong>{{ formatBalance(message.bindings.backward_quantity, message.bindings.backward_asset) }}</strong>
      <span>{{ message.bindings.backward_asset }}</span>
      between
      <NuxtLink :to="`/address/${message.bindings.tx0_address}`" class="leading-6 font-medium text-white">
        {{ message.bindings.tx0_address }}
      </NuxtLink>
      and
      <NuxtLink :to="`/address/${message.bindings.tx1_address}`" class="leading-6 font-medium text-white">
        {{ message.bindings.tx1_address }}
      </NuxtLink>.
    </span>
    <span v-else-if="message.category === 'orders'">
      <span v-if="message.bindings.status === 'open'">
        {{ formatBalance(message.bindings.give_quantity, message.asset) }}
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.give_asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.give_asset, message.asset) }}
        </NuxtLink>
        for
        {{ formatBalance(message.bindings.get_quantity, message.bindings.get_asset) }}
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.get_asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.get_asset, message.asset) }}
        </NuxtLink>
      </span>
      <span v-else-if="message.bindings.status === 'expired'">
        Order for
        {{ formatBalance(message.bindings.give_quantity, message.bindings.give_asset) }}
        {{ message.bindings.give_asset }}
        to get
        {{ formatBalance(message.bindings.get_quantity, message.bindings.get_asset) }}
        {{ message.bindings.get_asset }}
        expired.
      </span>
    </span>
    <span v-else-if="message.category === 'replace'">{{ message.bindings.address }}</span>
    <span v-else-if="message.category === 'rps'">RPS game by {{ message.bindings.source }} with {{ message.bindings.possible_moves }} possible moves</span>
    <span v-else-if="message.category === 'rps_expirations'">RPS game expired for {{ message.bindings.source }}</span>
    <span v-else-if="message.category === 'rps_match_expirations'">RPS match expired between {{ message.bindings.tx0_address }} and {{ message.bindings.tx1_address }}</span>
    <span v-else-if="message.category === 'rps_matches'">RPS match between addresses</span>
    <span v-else-if="message.category === 'rpsresolves'">RPS resolved with move {{ message.bindings.move }}</span>
    <span v-else-if="message.category === 'sweeps'">{{ message.bindings.destination }}</span>
    <span v-else-if="message.category === 'credits'">{{ message.address }}</span>
    <span v-else-if="message.category === 'debits'">{{ message.address }}</span>
    <span v-else-if="message.category === 'issuances'">
      <span v-if="message.bindings.transfer">
        Ownership of
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.asset, message.asset) }}
        </NuxtLink>
        transferred.
      </span>
      <span v-else-if="message.bindings.locked">
        Locked asset
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.asset, message.asset) }}
        </NuxtLink>
      </span>
      <span v-else-if="message.bindings.reset">
        Supply of
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.asset, message.asset) }}
        </NuxtLink>
        reset.
      </span>
      <span v-else>
        Issued
        {{ formatBalance(message.bindings.quantity, message.asset) }}
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.asset, message.asset) }}
        </NuxtLink>
      </span>
    </span>
    <span v-else-if="message.category === 'sends'">
      {{ formatBalance(message.bindings.quantity, message.asset) }}
      <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
        {{ formatAssetName(message.bindings.asset, message.asset) }}
      </NuxtLink>
      to
      <NuxtLink :to="`/address/${message.bindings.destination}`" class="leading-6 font-medium text-white">
        {{ message.bindings.destination }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'dispensers'">
      {{ formatBalance(message.bindings.give_quantity, message.asset) }}
      <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
        {{ formatAssetName(message.bindings.asset, message.asset) }}
      </NuxtLink>
      for
      {{ formatBalance(message.bindings.satoshirate, {divisible: true}) }}
      <NuxtLink :to="`/asset/BTC`" class="leading-6 font-medium text-white">
        BTC
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'dispenses'">
      {{ formatBalance(message.bindings.dispense_quantity, message.asset) }}
      <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
        {{ formatAssetName(message.bindings.asset, message.asset) }}
      </NuxtLink>
      from
      <NuxtLink :to="`/address/${message.bindings.source}`" class="leading-6 font-medium text-white">
        {{ message.bindings.source }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'dividends'">
      Dividend distributed:
      <strong>{{ formatBalance(message.bindings.quantity_per_unit, message.bindings.dividend_asset) }}</strong>
      <span>{{ message.bindings.dividend_asset }}</span>
      per unit of
      <NuxtLink :to="`/asset/${message.bindings.asset}`" class="leading-6 font-medium text-white">
        {{ message.bindings.asset }}
      </NuxtLink>
      by
      <NuxtLink :to="`/address/${message.bindings.source}`" class="leading-6 font-medium text-white">
        {{ message.bindings.source }}
      </NuxtLink>.
    </span>
    <span v-else-if="message.category === 'destructions'">
      {{ formatBalance(message.bindings.quantity, message.asset) }}
      <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
        {{ formatAssetName(message.bindings.asset, message.asset) }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'dispenser_refills'">Dispenser refilled by {{ message.bindings.source }}</span>
    <span v-else-if="message.category === 'burns'">Burn of {{ message.bindings.burned }} BTC</span>
    <span v-else>Unknown category: {{ message.category }}</span>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
};
</script>
