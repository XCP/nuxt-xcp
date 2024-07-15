<template>
  <div>
    <span v-if="event.category === 'bet_expirations'">
      <NuxtLink
        :to="`/tx/${parsedBindings.bet_hash}`"
        class="leading-6 font-medium text-white"
      >
        {{ parsedBindings.bet_hash }}
      </NuxtLink>
    </span>
    <span v-else-if="event.category === 'bet_match_expirations'">
      <NuxtLink
        :to="`/tx/${parsedBindings.bet_match_id}`"
        class="leading-6 font-medium text-white"
      >
        {{ parsedBindings.bet_match_id }}
      </NuxtLink>
    </span>
    <span v-else-if="event.category === 'bet_match_resolutions'">
      Winner: {{ formatBetWinner(parsedBindings.winner) }}
    </span>
    <span v-else-if="event.category === 'bet_matches'">
      <span
        v-if="event.command === 'update'"
        class="capitalize"
      >
        {{ parsedBindings.status }}
      </span>
      <span v-else>
        <NuxtLink
          :to="`/tx/${parsedBindings.tx0_hash}`"
          class="leading-6 font-medium text-white"
        >
          {{ parsedBindings.tx0_hash }}
        </NuxtLink>
      </span>
    </span>
    <span v-else-if="event.category === 'bets'">
      <span
        v-if="event.command === 'update'"
        class="capitalize"
      >
        Status: {{ parsedBindings.status }}
      </span>
      <span v-else>
        Wager {{ formatBalance(parsedBindings.wager_quantity, { divisible: true }) }}
        <NuxtLink
          :to="`/asset/XCP`"
          class="leading-6 font-medium text-white"
        >
          XCP
        </NuxtLink>
        on
        <NuxtLink
          :to="`/address/${parsedBindings.feed_address}`"
          class="leading-6 font-medium text-white"
        >
          {{ parsedBindings.feed_address }}
        </NuxtLink>
        ({{ formatBetType(parsedBindings.bet_type) }})
      </span>
    </span>
    <span v-else-if="event.category === 'broadcasts'">
      {{ parsedBindings.text }}
    </span>
    <span v-else-if="event.category === 'btcpays'">
      {{ formatBalance(parsedBindings.btc_amount, { divisible: true }) }} BTC sent to
      <NuxtLink
        :to="`/address/${parsedBindings.destination}`"
        class="leading-6 font-medium text-white"
      >
        {{ parsedBindings.destination }}
      </NuxtLink>
    </span>
    <span v-else-if="event.category === 'cancels'">
      <NuxtLink
        :to="`/tx/${parsedBindings.offer_hash}`"
        class="leading-6 font-medium text-white"
      >
        {{ parsedBindings.offer_hash }}
      </NuxtLink>
    </span>
    <span v-else-if="event.category === 'order_expirations'">
      <NuxtLink
        :to="`/tx/${parsedBindings.order_hash}`"
        class="leading-6 font-medium text-white"
      >
        {{ parsedBindings.order_hash }}
      </NuxtLink>
    </span>
    <span v-else-if="event.category === 'order_match_expirations'">{{ parsedBindings.tx1_address }}</span>
    <span v-else-if="event.category === 'order_matches'">
      {{ formatBalance(parsedBindings.forward_quantity, event.asset_two) }}
      <NuxtLink
        :to="`/asset/${parsedBindings.forward_asset}`"
        class="leading-6 font-medium text-white"
      >
        {{ formatAssetName(parsedBindings.forward_asset, event.asset_two) }}
      </NuxtLink>
      for
      {{ formatBalance(parsedBindings.backward_quantity, event.asset) }}
      <NuxtLink
        :to="`/asset/${parsedBindings.backward_asset}`"
        class="leading-6 font-medium text-white"
      >
        {{ formatAssetName(parsedBindings.backward_asset, event.asset) }}
      </NuxtLink>
      with
      <NuxtLink
        :to="`/address/${parsedBindings.tx1_address}`"
        class="leading-6 font-medium text-white"
      >
        {{ parsedBindings.tx1_address }}
      </NuxtLink>
    </span>
    <span v-else-if="event.category === 'orders'">
      <span
        v-if="event.command === 'update'"
        class="capitalize"
      >
        <span v-if="parsedBindings.status === 'open'">
          Remaining:
          {{ formatBalance(parsedBindings.give_remaining, event.asset) }}
          <NuxtLink
            :to="`/asset/${parsedBindings.give_asset}`"
            class="leading-6 font-medium text-white"
          >
            {{ formatAssetName(parsedBindings.give_asset, event.asset) }}
          </NuxtLink>
        </span>
        <span v-else>
          Status: {{ parsedBindings.status }}
        </span>
      </span>
      <span v-else-if="parsedBindings.status === 'open'">
        {{ formatBalance(parsedBindings.give_quantity, event.asset) }}
        <NuxtLink
          :to="`/asset/${parsedBindings.give_asset}`"
          class="leading-6 font-medium text-white"
        >
          {{ formatAssetName(parsedBindings.give_asset, event.asset) }}
        </NuxtLink>
        for
        {{ formatBalance(parsedBindings.get_quantity, event.asset_two) }}
        <NuxtLink
          :to="`/asset/${parsedBindings.get_asset}`"
          class="leading-6 font-medium text-white"
        >
          {{ formatAssetName(parsedBindings.get_asset, event.asset_two) }}
        </NuxtLink>
      </span>
      <span v-else-if="parsedBindings.status === 'expired'">
        Order for
        {{ formatBalance(parsedBindings.give_quantity, parsedBindings.give_asset) }}
        {{ parsedBindings.give_asset }}
        to get
        {{ formatBalance(parsedBindings.get_quantity, parsedBindings.get_asset) }}
        {{ parsedBindings.get_asset }}
        expired.
      </span>
    </span>
    <span v-else-if="event.category === 'replace'">{{ parsedBindings.address }}</span>
    <span v-else-if="event.category === 'rps'">RPS game by {{ parsedBindings.source }} with {{ parsedBindings.possible_moves }} possible moves</span>
    <span v-else-if="event.category === 'rps_expirations'">RPS game expired for {{ parsedBindings.source }}</span>
    <span v-else-if="event.category === 'rps_match_expirations'">RPS match expired between {{ parsedBindings.tx0_address }} and {{ parsedBindings.tx1_address }}</span>
    <span v-else-if="event.category === 'rps_matches'">RPS match between addresses</span>
    <span v-else-if="event.category === 'rpsresolves'">RPS resolved with move {{ parsedBindings.move }}</span>
    <span v-else-if="event.category === 'sweeps'">
      Sweep
      <NuxtLink
        :to="`/address/${parsedBindings.source}`"
        class="leading-6 font-medium text-white"
      >
        {{ parsedBindings.source }}
      </NuxtLink>
      to
      <NuxtLink
        :to="`/address/${parsedBindings.destination}`"
        class="leading-6 font-medium text-white"
      >
        {{ parsedBindings.destination }}
      </NuxtLink>
    </span>
    <span v-else-if="event.category === 'credits'">{{ event.address }}</span>
    <span v-else-if="event.category === 'debits'">{{ event.address }}</span>
    <span v-else-if="event.category === 'issuances'">
      <span v-if="parsedBindings.transfer">
        Transfer
        <NuxtLink
          :to="`/asset/${parsedBindings.asset}`"
          class="leading-6 font-medium text-white"
        >
          {{ formatAssetName(parsedBindings.asset, event.asset) }}
        </NuxtLink>
        to
        <NuxtLink
          :to="`/address/${parsedBindings.issuer}`"
          class="leading-6 font-medium text-white"
        >
          {{ parsedBindings.issuer }}
        </NuxtLink>
      </span>
      <span v-else-if="parsedBindings.locked">
        Lock asset
        <NuxtLink
          :to="`/asset/${parsedBindings.asset}`"
          class="leading-6 font-medium text-white"
        >
          {{ formatAssetName(parsedBindings.asset, event.asset) }}
        </NuxtLink>
      </span>
      <span v-else-if="parsedBindings.reset">
        Reset asset
        <NuxtLink
          :to="`/asset/${parsedBindings.asset}`"
          class="leading-6 font-medium text-white"
        >
          {{ formatAssetName(parsedBindings.asset, event.asset) }}
        </NuxtLink>
      </span>
      <span v-else-if="parsedBindings.quantity === 0">
        Update info
        <NuxtLink
          :to="`/asset/${parsedBindings.asset}`"
          class="leading-6 font-medium text-white"
        >
          {{ formatAssetName(parsedBindings.asset, event.asset) }}
        </NuxtLink>
      </span>
      <span v-else>
        Issue
        {{ formatBalance(parsedBindings.quantity, event.asset) }}
        <NuxtLink
          :to="`/asset/${parsedBindings.asset}`"
          class="leading-6 font-medium text-white"
        >
          {{ formatAssetName(parsedBindings.asset, event.asset) }}
        </NuxtLink>
      </span>
    </span>
    <span v-else-if="event.category === 'sends'">
      {{ formatBalance(parsedBindings.quantity, event.asset) }}
      <NuxtLink
        :to="`/asset/${parsedBindings.asset}`"
        class="leading-6 font-medium text-white"
      >
        {{ formatAssetName(parsedBindings.asset, event.asset) }}
      </NuxtLink>
      to
      <NuxtLink
        :to="`/address/${parsedBindings.destination}`"
        class="leading-6 font-medium text-white"
      >
        {{ parsedBindings.destination }}
      </NuxtLink>
    </span>
    <span v-else-if="event.category === 'dispensers'">
      <span v-if="event.command === 'update' && parsedBindings.give_remaining">
        Remaining: {{ formatBalance(parsedBindings.give_remaining, event.asset) }}
        <NuxtLink
          :to="`/asset/${parsedBindings.asset}`"
          class="leading-6 font-medium text-white"
        >
          {{ formatAssetName(parsedBindings.asset, event.asset) }}
        </NuxtLink>
      </span>
      <span v-else-if="event.command === 'update' && parsedBindings.status">
        Status: {{ formatDispenserStatus(parsedBindings.status) }}
        <NuxtLink
          :to="`/asset/${parsedBindings.asset}`"
          class="leading-6 font-medium text-white"
        >
          {{ formatAssetName(parsedBindings.asset, event.asset) }}
        </NuxtLink>
      </span>
      <span v-else>
        Dispensing:
        {{ formatBalance(parsedBindings.give_remaining, event.asset) }}
        <NuxtLink
          :to="`/asset/${parsedBindings.asset}`"
          class="leading-6 font-medium text-white"
        >
          {{ formatAssetName(parsedBindings.asset, event.asset) }}
        </NuxtLink>
        ({{ formatBalance(parsedBindings.give_quantity, event.asset) }}
        <span class="leading-6 font-medium text-white">{{ formatAssetName(parsedBindings.asset, event.asset) }}</span>
        per
        {{ formatBalance(parsedBindings.satoshirate, { divisible: true }) }}
        <span class="leading-6 font-medium text-white">BTC</span>)
      </span>
    </span>
    <span v-else-if="event.category === 'dispenses'">
      {{ formatBalance(parsedBindings.dispense_quantity, event.asset) }}
      <NuxtLink
        :to="`/asset/${parsedBindings.asset}`"
        class="leading-6 font-medium text-white"
      >
        {{ formatAssetName(parsedBindings.asset, event.asset) }}
      </NuxtLink>
      from
      <NuxtLink
        :to="`/address/${parsedBindings.source}`"
        class="leading-6 font-medium text-white"
      >
        {{ parsedBindings.source }}
      </NuxtLink>
    </span>
    <span v-else-if="event.category === 'dividends'">
      {{ formatBalance(parsedBindings.quantity_per_unit, event.asset_two) }}
      <NuxtLink
        :to="`/asset/${parsedBindings.dividend_asset}`"
        class="leading-6 font-medium text-white"
      >
        {{ formatAssetName(parsedBindings.dividend_asset, event.asset_two) }}
      </NuxtLink>
      per unit of
      <NuxtLink
        :to="`/asset/${parsedBindings.asset}`"
        class="leading-6 font-medium text-white"
      >
        {{ formatAssetName(parsedBindings.asset, event.asset) }}
      </NuxtLink>
    </span>
    <span v-else-if="event.category === 'destructions'">
      {{ formatBalance(parsedBindings.quantity, event.asset) }}
      <NuxtLink
        :to="`/asset/${parsedBindings.asset}`"
        class="leading-6 font-medium text-white"
      >
        {{ formatAssetName(parsedBindings.asset, event.asset) }}
      </NuxtLink>
    </span>
    <span v-else-if="event.category === 'dispenser_refills'">Dispenser refilled by {{ parsedBindings.source }}</span>
    <span v-else-if="event.category === 'burns'">
      Burned {{ formatBalance(parsedBindings.burned, { divisible: true }) }}
      <NuxtLink
        :to="`/asset/BTC`"
        class="leading-6 font-medium text-white"
      >
        BTC
      </NuxtLink>
      for
      {{ formatBalance(parsedBindings.earned, { divisible: true }) }}
      <NuxtLink
        :to="`/asset/XCP`"
        class="leading-6 font-medium text-white"
      >
        XCP
      </NuxtLink>
    </span>
    <span v-else>Unknown category: {{ event.category }}</span>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const parsedBindings = computed(() => {
      if (typeof props.event.bindings === 'object') {
        return props.event.bindings
      }

      try {
        return JSON.parse(props.event.bindings)
      }
      catch (e) {
        console.error('Failed to parse bindings:', e)
        return props.event.bindings
      }
    })

    return {
      parsedBindings,
    }
  },
}
</script>
