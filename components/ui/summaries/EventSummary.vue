<template>
  <!-- Blocks and TXs Handlers -->
  <span v-if="event.event === 'NEW_BLOCK'">
    Block Hash
    <NuxtLink
      :to="`/block/${event.params.block_index}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.block_hash }}
    </NuxtLink>
    (Difficulty: {{ event.params.difficulty }})
  </span>
  <span v-else-if="event.event === 'NEW_TRANSACTION'">
    <NuxtLink
      :to="`/address/${event.params.tx_hash}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx_hash }}
    </NuxtLink>
    from
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'NEW_TRANSACTION_OUTPUT'">
    {{ event.params.btc_amount_normalized }} BTC to
    <NuxtLink
      :to="`/address/${event.params.destination}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.destination }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'BLOCK_PARSED'">
    Ledger Hash
    <NuxtLink
      :to="`/block/${event.params.block_index}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.ledger_hash }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'TRANSACTION_PARSED'">
    <NuxtLink
      :to="`/tx/${event.params.tx_hash}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx_hash }}
    </NuxtLink>
  </span>

  <!-- Address Option Updates -->
  <span v-else-if="event.event === 'NEW_ADDRESS_OPTIONS'">
    <NuxtLink
      :to="`/address/${event.params.address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.address }}
    </NuxtLink>
    (Options: {{ event.params.options }})
  </span>
  <span v-else-if="event.event === 'ADDRESS_OPTIONS_UPDATE'">
    <NuxtLink
      :to="`/address/${event.params.address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.address }}
    </NuxtLink>
    (Options: {{ event.params.options }})
  </span>

  <!-- Asset Movement Handlers -->
  <span v-else-if="event.event === 'DEBIT'">
    -{{ event.params.quantity_normalized }}
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    from
    <NuxtLink
      :to="`/address/${event.params.address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.address }}
    </NuxtLink>
    <ActionBadge
      context="debit"
      :action="event.params.action"
      class="ml-4"
    />
  </span>
  <span v-else-if="event.event === 'CREDIT'">
    +{{ event.params.quantity_normalized }}
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink
      :to="`/address/${event.params.address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.address }}
    </NuxtLink>
    <ActionBadge
      context="credit"
      :action="event.params.calling_function"
      class="ml-4"
    />
  </span>
  <span v-else-if="event.event === 'ENHANCED_SEND'">
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink
      :to="`/address/${event.params.destination}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.destination }}
    </NuxtLink>
    {{ event.params.memo ? `(Memo: ${event.params.memo})` : '' }}
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'MPMA_SEND'">
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink
      :to="`/address/${event.params.destination}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.destination }}
    </NuxtLink>
    {{ event.params.memo ? `(Memo: ${event.params.memo})` : '' }}
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'SEND'">
    {{ event.params.quantity_normalized === 0 ? event.params.quantity_normalized : '' }}
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink
      :to="`/address/${event.params.destination}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.destination }}
    </NuxtLink>
    {{ event.params.memo ? `(Memo: ${event.params.memo})` : '' }}
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'ASSET_TRANSFER'">
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink
      :to="`/address/${event.params.issuer}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.issuer }}
    </NuxtLink>
    from
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'SWEEP'">
    From
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
    to
    <NuxtLink
      :to="`/address/${event.params.destination}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.destination }}
    </NuxtLink>
    (Fee: {{ event.params.fee_paid_normalized }} XCP)
    <SweepFlagsBadge
      :flags="event.params.flags"
      class="ml-3"
    />
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'ASSET_DIVIDEND'">
    {{ event.params.quantity_per_unit_normalized }}
    <NuxtLink
      :to="`/asset/${event.params.dividend_asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.dividend_asset, event.params.dividend_asset_info) }}
    </NuxtLink>
    per unit of
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    (Fee: {{ event.params.fee_paid_normalized }} XCP)
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>

  <!-- Asset Creation and Destruction Handlers -->
  <span v-else-if="event.event === 'RESET_ISSUANCE'">
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    by
    <NuxtLink
      :to="`/address/${event.params.issuer}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.issuer }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'ASSET_CREATION'">
    <NuxtLink
      :to="`/asset/${event.params.asset_name}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.asset_name }}
    </NuxtLink>
    (ID: {{ event.params.asset_id }})
  </span>
  <span v-else-if="event.event === 'ASSET_ISSUANCE'">
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params) }}
    </NuxtLink>
    by
    <NuxtLink
      :to="`/address/${event.params.issuer}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.issuer }}
    </NuxtLink>
    (Quantity: {{ event.params.quantity_normalized }})
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'ASSET_DESTRUCTION'">
    {{ event.params.quantity_normalized }}
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    by
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>

  <!-- DEX Handlers -->
  <span v-else-if="event.event === 'OPEN_ORDER'">
    {{ event.params.give_quantity_normalized }}
    <NuxtLink
      :to="`/asset/${event.params.give_asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.give_asset, event.params.give_asset_info) }}
    </NuxtLink>
    for
    {{ event.params.get_quantity_normalized }}
    <NuxtLink
      :to="`/asset/${event.params.get_asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.get_asset, event.params.get_asset_info) }}
    </NuxtLink>
    by
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'ORDER_MATCH'">
    {{ event.params.forward_quantity_normalized }}
    <NuxtLink
      :to="`/asset/${event.params.forward_asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.forward_asset, event.params.forward_asset_info) }}
    </NuxtLink>
    for
    {{ event.params.backward_quantity_normalized }}
    <NuxtLink
      :to="`/asset/${event.params.backward_asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.backward_asset, event.params.backward_asset_info) }}
    </NuxtLink>
    between
    <NuxtLink
      :to="`/address/${event.params.tx0_address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx0_address }}
    </NuxtLink>
    and
    <NuxtLink
      :to="`/address/${event.params.tx1_address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx1_address }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'ORDER_UPDATE'">
    <NuxtLink
      :to="`/tx/${event.params.tx_hash}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx_hash }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'ORDER_FILLED'">
    <NuxtLink
      :to="`/tx/${event.params.tx_hash}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx_hash }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'ORDER_MATCH_UPDATE'">
    <NuxtLink
      :to="`/tx/${event.tx_hash}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.tx_hash }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'BTC_PAY'">
    {{ event.params.btc_amount_normalized }} BTC sent to
    <NuxtLink
      :to="`/address/${event.params.destination}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.destination }}
    </NuxtLink>
    for
    <NuxtLink
      :to="`/tx/${event.params.order_match_id}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.order_match_id }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'CANCEL_ORDER'">
    <NuxtLink
      :to="`/tx/${event.params.offer_hash}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.offer_hash }}
    </NuxtLink>
    by
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'ORDER_EXPIRATION'">
    <NuxtLink
      :to="`/tx/${event.params.order_hash}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.order_hash }}
    </NuxtLink>
    by
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'ORDER_MATCH_EXPIRATION'">
    <NuxtLink
      :to="`/address/${event.params.tx0_address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx0_address }}
    </NuxtLink>
    and
    <NuxtLink
      :to="`/address/${event.params.tx1_address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx1_address }}
    </NuxtLink>
  </span>

  <!-- Dispenser Handlers -->
  <span v-else-if="event.event === 'OPEN_DISPENSER'">
    {{ event.params.give_quantity_normalized }}
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    by
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'DISPENSER_UPDATE'">
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    by
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'REFILL_DISPENSER'">
    {{ event.params.dispense_quantity_normalized }}
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    by
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'DISPENSE'">
    {{ event.params.dispense_quantity_normalized }}
    <NuxtLink
      :to="`/asset/${event.params.asset}`"
      class="leading-6 font-medium text-white"
    >
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink
      :to="`/address/${event.params.destination}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.destination }}
    </NuxtLink>
  </span>

  <!-- Broadcast Handler -->
  <span v-else-if="event.event === 'BROADCAST'">
    "{{ event.params.text }}" from
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>

  <!-- Bets Handlers -->
  <span v-else-if="event.event === 'OPEN_BET'">
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
    with wager quantity of {{ formatBalance(event.params.wager_quantity, { divisible: true }) }}
    <NuxtLink
      :to="`/asset/XCP`"
      class="leading-6 font-medium text-white"
    >
      XCP
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'BET_UPDATE'">
    <NuxtLink
      :to="`/tx/${event.params.tx_hash}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx_hash }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'BET_MATCH'">
    <NuxtLink
      :to="`/address/${event.params.tx0_address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx0_address }}
    </NuxtLink>
    and
    <NuxtLink
      :to="`/address/${event.params.tx1_address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx1_address }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'BET_MATCH_UPDATE'">
    <NuxtLink
      :to="`/tx/${event.params.id}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.id }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'BET_EXPIRATION'">
    <NuxtLink
      :to="`/tx/${event.params.bet_hash}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.bet_hash }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'BET_MATCH_EXPIRATION'">
    <NuxtLink
      :to="`/address/${event.params.tx0_address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx0_address }}
    </NuxtLink>
    and
    <NuxtLink
      :to="`/address/${event.params.tx1_address}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.tx1_address }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'BET_MATCH_RESOLUTION'">
    <NuxtLink
      :to="`/tx/${event.params.bet_match_id}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.bet_match_id }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else-if="event.event === 'CANCEL_BET'">
    <NuxtLink
      :to="`/tx/${event.params.offer_hash}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.offer_hash }}
    </NuxtLink>
    by
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>

  <!-- Burns Handler -->
  <span v-else-if="event.event === 'BURN'">
    {{ event.params.burned_normalized }}
    <NuxtLink
      :to="`/asset/BTC`"
      class="leading-6 font-medium text-white"
    >
      BTC
    </NuxtLink>
    by
    <NuxtLink
      :to="`/address/${event.params.source}`"
      class="leading-6 font-medium text-white"
    >
      {{ event.params.source }}
    </NuxtLink>
    to earn {{ event.params.earned_normalized }}
    <NuxtLink
      :to="`/asset/XCP`"
      class="leading-6 font-medium text-white"
    >
      XCP
    </NuxtLink>
    <StatusBadge
      :status="event.params.status"
      class="ml-2"
    />
  </span>
  <span v-else>
    Unknown event: {{ event.event }}
  </span>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
}
</script>
