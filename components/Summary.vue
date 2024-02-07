<template>
  <div>
    <span v-if="message.category === 'bet_expirations'">
      <NuxtLink :to="`/tx/${message.bindings.bet_hash}`" class="leading-6 font-medium text-white">
        {{ message.bindings.bet_hash }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'bet_match_expirations'">
      <NuxtLink :to="`/tx/${message.bindings.bet_match_id}`" class="leading-6 font-medium text-white">
        {{ message.bindings.bet_match_id }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'bet_match_resolutions'">
      Winner: {{ formatBetWinner(message.bindings.winner) }}
    </span>
    <span v-else-if="message.category === 'bet_matches'">
      <span v-if="message.command === 'update'" class="capitalize">
        {{ message.bindings.status }}
      </span>
      <span v-else>
        <NuxtLink :to="`/tx/${message.bindings.tx0_hash}`" class="leading-6 font-medium text-white">
          {{ message.bindings.tx0_hash }}
        </NuxtLink>
      </span>
    </span>
    <span v-else-if="message.category === 'bets'">
      <span v-if="message.command === 'update'" class="capitalize">
        Status: {{ message.bindings.status }}
      </span>
      <span v-else>
        Wager {{ formatBalance(message.bindings.wager_quantity, {divisible: true}) }}
        <NuxtLink :to="`/asset/XCP`" class="leading-6 font-medium text-white">
          XCP
        </NuxtLink>
        on
        <NuxtLink :to="`/address/${message.bindings.feed_address}`" class="leading-6 font-medium text-white">
          {{ message.bindings.feed_address }}
        </NuxtLink>
        ({{ formatBetType(message.bindings.bet_type) }})
      </span>
    </span>
    <span v-else-if="message.category === 'broadcasts'">
      {{ message.bindings.text }}
    </span>
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
      {{ formatBalance(message.bindings.forward_quantity, message.asset_two) }}
      <NuxtLink :to="`/asset/${formatAssetName(message.bindings.forward_asset, message.asset_two)}`" class="leading-6 font-medium text-white">
        {{ formatAssetName(message.bindings.forward_asset, message.asset_two) }}
      </NuxtLink>
      for
      {{ formatBalance(message.bindings.backward_quantity, message.asset) }}
      <NuxtLink :to="`/asset/${formatAssetName(message.bindings.backward_asset, message.asset)}`" class="leading-6 font-medium text-white">
        {{ formatAssetName(message.bindings.backward_asset, message.asset) }}
      </NuxtLink>
      with
      <NuxtLink :to="`/address/${message.bindings.tx1_address}`" class="leading-6 font-medium text-white">
        {{ message.bindings.tx1_address }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'orders'">
      <span v-if="message.command === 'update'" class="capitalize">
        <span v-if="message.bindings.status === 'open'">
          Remaining: 
          {{ formatBalance(message.bindings.give_remaining, message.asset) }}
          <NuxtLink :to="`/asset/${formatAssetName(message.bindings.give_asset, message.asset)}`" class="leading-6 font-medium text-white">
            {{ formatAssetName(message.bindings.give_asset, message.asset) }}
          </NuxtLink>
        </span>
        <span v-else>
          Status: {{ message.bindings.status }}
        </span>
      </span>
      <span v-else-if="message.bindings.status === 'open'">
        {{ formatBalance(message.bindings.give_quantity, message.asset) }}
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.give_asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.give_asset, message.asset) }}
        </NuxtLink>
        for
        {{ formatBalance(message.bindings.get_quantity, message.asset_two) }}
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.get_asset, message.asset_two)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.get_asset, message.asset_two) }}
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
    <span v-else-if="message.category === 'sweeps'">
      Sweep 
      <NuxtLink :to="`/address/${message.bindings.source}`" class="leading-6 font-medium text-white">
        {{ message.bindings.source }}
      </NuxtLink>
      to 
      <NuxtLink :to="`/address/${message.bindings.destination}`" class="leading-6 font-medium text-white">
        {{ message.bindings.destination }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'credits'">{{ message.address }}</span>
    <span v-else-if="message.category === 'debits'">{{ message.address }}</span>
    <span v-else-if="message.category === 'issuances'">
      <span v-if="message.bindings.transfer">
        Transfer
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.asset, message.asset) }}
        </NuxtLink>
        to
        <NuxtLink :to="`/address/${message.bindings.issuer}`" class="leading-6 font-medium text-white">
          {{ message.bindings.issuer }}
        </NuxtLink>
      </span>
      <span v-else-if="message.bindings.locked">
        Lock asset
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.asset, message.asset) }}
        </NuxtLink>
      </span>
      <span v-else-if="message.bindings.reset">
        Reset asset
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.asset, message.asset) }}
        </NuxtLink>
      </span>
      <span v-else-if="message.bindings.quantity === 0">
        Update info
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.asset, message.asset) }}
        </NuxtLink>
      </span>
      <span v-else>
        Issue
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
      <span v-if="message.command === 'update'">
        Remaining: {{ formatBalance(message.bindings.give_remaining, message.asset) }}
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.asset, message.asset) }}
        </NuxtLink>
      </span>
      <span v-else>
        Dispensing:
        {{ formatBalance(message.bindings.give_remaining, message.asset) }}
        <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
          {{ formatAssetName(message.bindings.asset, message.asset) }}
        </NuxtLink>
        ({{ formatBalance(message.bindings.give_quantity, message.asset) }}
        <span class="leading-6 font-medium text-white">{{ formatAssetName(message.bindings.asset, message.asset) }}</span>
        per
        {{ formatBalance(message.bindings.satoshirate, {divisible: true}) }}
        <span class="leading-6 font-medium text-white">BTC</span>)
      </span>
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
      {{ formatBalance(message.bindings.quantity_per_unit, message.asset_two) }}
      <NuxtLink :to="`/asset/${formatAssetName(message.bindings.dividend_asset, message.asset_two)}`" class="leading-6 font-medium text-white">
        {{ formatAssetName(message.bindings.dividend_asset, message.asset_two) }}
      </NuxtLink>
      per unit of
      <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
        {{ formatAssetName(message.bindings.asset, message.asset) }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'destructions'">
      {{ formatBalance(message.bindings.quantity, message.asset) }}
      <NuxtLink :to="`/asset/${formatAssetName(message.bindings.asset, message.asset)}`" class="leading-6 font-medium text-white">
        {{ formatAssetName(message.bindings.asset, message.asset) }}
      </NuxtLink>
    </span>
    <span v-else-if="message.category === 'dispenser_refills'">Dispenser refilled by {{ message.bindings.source }}</span>
    <span v-else-if="message.category === 'burns'">
      Burned {{ formatBalance(message.bindings.burned, {divisible: true}) }}
      <NuxtLink :to="`/asset/BTC`" class="leading-6 font-medium text-white">
        BTC
      </NuxtLink>
      for
      {{ formatBalance(message.bindings.earned, {divisible: true}) }}
      <NuxtLink :to="`/asset/XCP`" class="leading-6 font-medium text-white">
        XCP
      </NuxtLink>
    </span>
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
