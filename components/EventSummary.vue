<template>
  <!-- Blocks and TXs Handlers -->
  <span v-if="event.event === 'NEW_BLOCK'">
    Block Hash
    <NuxtLink :to="`/block/${event.params.block_hash}`" class="leading-6 font-medium text-white">
      {{ event.params.block_hash }}
    </NuxtLink>
    (Difficulty: {{ event.params.difficulty }})
  </span>
  <span v-else-if="event.event === 'NEW_TRANSACTION'">
    <NuxtLink :to="`/address/${event.params.tx_hash}`" class="leading-6 font-medium text-white">
      {{ event.params.tx_hash }}
    </NuxtLink>
    from
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'NEW_TRANSACTION_OUTPUT'">
    {{ event.params.btc_amount_normalized }} BTC to
    <NuxtLink :to="`/address/${event.params.destination}`" class="leading-6 font-medium text-white">
      {{ event.params.destination }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'BLOCK_PARSED'">
    Ledger Hash
    <NuxtLink :to="`/block/${event.params.ledger_hash}`" class="leading-6 font-medium text-white">
      {{ event.params.ledger_hash }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'TRANSACTION_PARSED'">
    <NuxtLink :to="`/tx/${event.params.tx_hash}`" class="leading-6 font-medium text-white">
      {{ event.params.tx_hash }}
    </NuxtLink>
    ({{ event.params.supported ? 'Supported' : 'Not Supported' }})
  </span>

  <!-- Asset Movement Handlers -->
  <span v-else-if="event.event === 'DEBIT'">
    -{{ event.params.quantity_normalized }}
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    from
    <NuxtLink :to="`/address/${event.params.address}`" class="leading-6 font-medium text-white">
      {{ event.params.address }}
    </NuxtLink>
    <Action context="debit" :action="event.params.action" class="ml-4" />
  </span>
  <span v-else-if="event.event === 'CREDIT'">
    +{{ event.params.quantity_normalized }}
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink :to="`/address/${event.params.address}`" class="leading-6 font-medium text-white">
      {{ event.params.address }}
    </NuxtLink>
    <Action context="credit" :action="event.params.calling_function" class="ml-4" />
  </span>
  <span v-else-if="event.event === 'ENHANCED_SEND'">
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink :to="`/address/${event.params.destination}`" class="leading-6 font-medium text-white">
      {{ event.params.destination }}
    </NuxtLink>
    {{ event.params.memo ? `(Memo: ${event.params.memo})` : '' }}
  </span>
  <span v-else-if="event.event === 'MPMA_SEND'">
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink :to="`/address/${event.params.destination}`" class="leading-6 font-medium text-white">
      {{ event.params.destination }}
    </NuxtLink>
    {{ event.params.memo ? `(Memo: ${event.params.memo})` : '' }}
  </span>
  <span v-else-if="event.event === 'SEND'">
    {{ event.params.quantity_normalized === 0 ? event.params.quantity_normalized : '' }}
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink :to="`/address/${event.params.destination}`" class="leading-6 font-medium text-white">
      {{ event.params.destination }}
    </NuxtLink>
    {{ event.params.memo ? `(Memo: ${event.params.memo})` : '' }}
  </span>
  <span v-else-if="event.event === 'ASSET_TRANSFER'">
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink :to="`/address/${event.params.issuer}`" class="leading-6 font-medium text-white">
      {{ event.params.issuer }}
    </NuxtLink>
    from
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'SWEEP'">
    From
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
    to
    <NuxtLink :to="`/address/${event.params.destination}`" class="leading-6 font-medium text-white">
      {{ event.params.destination }}
    </NuxtLink>
    (Fee: {{ event.params.fee_paid_normalized }} XCP)
    <Flags :flags="event.params.flags" class="ml-3" />
  </span>
  <span v-else-if="event.event === 'ASSET_DIVIDEND'">
    {{ event.params.quantity_per_unit_normalized }} 
    <NuxtLink :to="`/asset/${formatAssetName(event.params.dividend_asset, event.params.dividend_asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.dividend_asset, event.params.dividend_asset_info) }}
    </NuxtLink>
    per unit of
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    (Fee: {{ event.params.fee_paid_normalized }} XCP)
  </span>

  <!-- Asset Creation and Destruction Handlers -->
  <span v-else-if="event.event === 'RESET_ISSUANCE'">
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    by
    <NuxtLink :to="`/address/${event.params.issuer}`" class="leading-6 font-medium text-white">
      {{ event.params.issuer }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'ASSET_CREATION'">
    Asset created:
    <NuxtLink :to="`/asset/${event.params.asset_name}`" class="leading-6 font-medium text-white">
      {{ event.params.asset_name }}
    </NuxtLink>
    with ID {{ event.params.asset_id }}
  </span>
  <span v-else-if="event.event === 'ASSET_ISSUANCE'">
    Asset issuance:
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    by
    <NuxtLink :to="`/address/${event.params.issuer}`" class="leading-6 font-medium text-white">
      {{ event.params.issuer }}
    </NuxtLink>
    with quantity {{ event.params.quantity_normalized }}
  </span>
  <span v-else-if="event.event === 'ASSET_DESTRUCTION'">
    Asset destroyed:
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    quantity {{ event.params.quantity_normalized }} by
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
  </span>

  <!-- DEX Handlers -->
  <span v-else-if="event.event === 'OPEN_ORDER'">
    Open order to give
    {{ event.params.give_quantity_normalized }}
    <NuxtLink :to="`/asset/${formatAssetName(event.params.give_asset, event.params.give_asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.give_asset, event.params.give_asset_info) }}
    </NuxtLink>
    for
    {{ event.params.get_quantity_normalized }}
    <NuxtLink :to="`/asset/${formatAssetName(event.params.get_asset, event.params.get_asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.get_asset, event.params.get_asset_info) }}
    </NuxtLink>
    by
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'ORDER_MATCH'">
    Order match:
    {{ event.params.forward_quantity_normalized }}
    <NuxtLink :to="`/asset/${formatAssetName(event.params.forward_asset, event.params.forward_asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.forward_asset, event.params.forward_asset_info) }}
    </NuxtLink>
    for
    {{ event.params.backward_quantity_normalized }}
    <NuxtLink :to="`/asset/${formatAssetName(event.params.backward_asset, event.params.backward_asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.backward_asset, event.params.backward_asset_info) }}
    </NuxtLink>
    between
    <NuxtLink :to="`/address/${event.params.tx0_address}`" class="leading-6 font-medium text-white">
      {{ event.params.tx0_address }}
    </NuxtLink>
    and
    <NuxtLink :to="`/address/${event.params.tx1_address}`" class="leading-6 font-medium text-white">
      {{ event.params.tx1_address }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'ORDER_UPDATE'">
    Order update:
    <NuxtLink :to="`/tx/${event.params.tx_hash}`" class="leading-6 font-medium text-white">
      {{ event.params.tx_hash }}
    </NuxtLink>
    status changed to {{ event.params.status }}
  </span>
  <span v-else-if="event.event === 'ORDER_FILLED'">
    Order filled:
    <NuxtLink :to="`/tx/${event.params.tx_hash}`" class="leading-6 font-medium text-white">
      {{ event.params.tx_hash }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'ORDER_MATCH_UPDATE'">
    Order match update:
    <NuxtLink :to="`/tx/${event.params.tx_hash}`" class="leading-6 font-medium text-white">
      {{ event.params.tx_hash }}
    </NuxtLink>
    status changed to {{ event.params.status }}
  </span>
  <span v-else-if="event.event === 'BTC_PAY'">
    BTC payment of {{ event.params.btc_amount_normalized }} BTC sent to
    <NuxtLink :to="`/address/${event.params.destination}`" class="leading-6 font-medium text-white">
      {{ event.params.destination }}
    </NuxtLink>
    for order match
    <NuxtLink :to="`/tx/${event.params.order_match_id}`" class="leading-6 font-medium text-white">
      {{ event.params.order_match_id }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'CANCEL_ORDER'">
    Order cancelled:
    <NuxtLink :to="`/tx/${event.params.offer_hash}`" class="leading-6 font-medium text-white">
      {{ event.params.offer_hash }}
    </NuxtLink>
    by
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'ORDER_EXPIRATION'">
    Order expired:
    <NuxtLink :to="`/tx/${event.params.order_hash}`" class="leading-6 font-medium text-white">
      {{ event.params.order_hash }}
    </NuxtLink>
    by
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'ORDER_MATCH_EXPIRATION'">
    Order match expired between
    <NuxtLink :to="`/address/${event.params.tx0_address}`" class="leading-6 font-medium text-white">
      {{ event.params.tx0_address }}
    </NuxtLink>
    and
    <NuxtLink :to="`/address/${event.params.tx1_address}`" class="leading-6 font-medium text-white">
      {{ event.params.tx1_address }}
    </NuxtLink>
  </span>

  <!-- Dispenser Handlers -->
  <span v-else-if="event.event === 'OPEN_DISPENSER'">
    Open dispenser for
    {{ event.params.give_quantity_normalized }}
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    by
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'DISPENSER_UPDATE'">
    Dispenser update for
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    by
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'REFILL_DISPENSER'">
    Refill dispenser for
    {{ event.params.dispense_quantity_normalized }}
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    by
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'DISPENSE'">
    Dispensed
    {{ event.params.dispense_quantity_normalized }}
    <NuxtLink :to="`/asset/${formatAssetName(event.params.asset, event.params.asset_info)}`" class="leading-6 font-medium text-white">
      {{ formatAssetName(event.params.asset, event.params.asset_info) }}
    </NuxtLink>
    to
    <NuxtLink :to="`/address/${event.params.destination}`" class="leading-6 font-medium text-white">
      {{ event.params.destination }}
    </NuxtLink>
  </span>

  <!-- Broadcast Handler -->
  <span v-else-if="event.event === 'BROADCAST'">
    Broadcast message: "{{ event.params.text }}" from
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
  </span>

  <!-- Bets Handlers -->
  <span v-else-if="event.event === 'OPEN_BET'">
    Open bet by
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
    with wager quantity of {{ event.params.wager_quantity }}
  </span>
  <span v-else-if="event.event === 'BET_UPDATE'">
    Bet update: status changed to {{ event.params.status }}
  </span>
  <span v-else-if="event.event === 'BET_MATCH'">
    Bet match between
    <NuxtLink :to="`/address/${event.params.tx0_address}`" class="leading-6 font-medium text-white">
      {{ event.params.tx0_address }}
    </NuxtLink>
    and
    <NuxtLink :to="`/address/${event.params.tx1_address}`" class="leading-6 font-medium text-white">
      {{ event.params.tx1_address }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'BET_MATCH_UPDATE'">
    Bet match update: status changed to {{ event.params.status }}
  </span>
  <span v-else-if="event.event === 'BET_EXPIRATION'">
    Bet expired: 
    <NuxtLink :to="`/tx/${event.params.bet_hash}`" class="leading-6 font-medium text-white">
      {{ event.params.bet_hash }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'BET_MATCH_EXPIRATION'">
    Bet match expired between
    <NuxtLink :to="`/address/${event.params.tx0_address}`" class="leading-6 font-medium text-white">
      {{ event.params.tx0_address }}
    </NuxtLink>
    and
    <NuxtLink :to="`/address/${event.params.tx1_address}`" class="leading-6 font-medium text-white">
      {{ event.params.tx1_address }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'BET_MATCH_RESOLUTION'">
    Bet match resolution for
    <NuxtLink :to="`/tx/${event.params.bet_match_id}`" class="leading-6 font-medium text-white">
      {{ event.params.bet_match_id }}
    </NuxtLink>
  </span>
  <span v-else-if="event.event === 'CANCEL_BET'">
    Bet cancelled by
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
  </span>

  <!-- Burns Handler -->
  <span v-else-if="event.event === 'BURN'">
    Burn of {{ event.params.burned_normalized }} by
    <NuxtLink :to="`/address/${event.params.source}`" class="leading-6 font-medium text-white">
      {{ event.params.source }}
    </NuxtLink>
    earning {{ event.params.earned_normalized }}
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
};
</script>
