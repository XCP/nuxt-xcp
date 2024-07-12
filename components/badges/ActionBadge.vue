<template>
  <span
    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
    :class="badgeClass"
  >{{ badgeText }}</span>
</template>

<script>
export default {
  props: {
    action: {
      type: String,
      required: true,
    },
    context: {
      type: String,
      required: true,
      validator: value => ['credit', 'debit'].includes(value),
    },
  },
  computed: {
    badgeText() {
      switch (this.action) {
        // DebitAction cases
        case 'bet':
          return 'Bet'
        case 'destroy':
          return 'Destroy'
        case 'dividend':
          return 'Dividend'
        case 'dividend fee':
          return 'Dividend Fee'
        case 'issuance fee':
          return 'Issuance Fee'
        case 'mpma send':
          return 'MPMA Send'
        case 'open RPS':
          return 'Open RPS'
        case 'open dispenser':
          return 'Open Dispenser'
        case 'open dispenser empty addr':
          return 'Open Dispenser Empty Addr'
        case 'open order':
          return 'Open Order'
        case 'refill dispenser':
          return 'Refill Dispenser'
        case 'reopen RPS after matching expiration':
          return 'Reopen RPS After Matching Expiration'
        case 'reset destroy':
          return 'Reset Destroy'
        case 'send':
          return 'Send'
        case 'sweep':
          return 'Sweep'
        case 'sweep fee':
          return 'Sweep Fee'

        // CreditAction cases
        case 'Closed: Max dispenses reached':
          return 'Closed: Max Dispenses Reached'
        case 'bet settled: for equal':
          return 'Bet Settled: For Equal'
        case 'bet settled: for notequal':
          return 'Bet Settled: For Not Equal'
        case 'bet settled: liquidated for bear':
          return 'Bet Settled: Liquidated For Bear'
        case 'btcpay':
          return 'BTC Pay'
        case 'burn':
          return 'Burn'
        case 'cancel order':
          return 'Cancel Order'
        case 'close dispenser':
          return 'Close Dispenser'
        case 'dispense':
          return 'Dispense'
        case 'dispenser close':
          return 'Dispenser Close'
        case 'feed fee':
          return 'Feed Fee'
        case 'filled':
          return 'Filled'
        case 'issuance':
          return 'Issuance'
        case 'order cancelled':
          return 'Order Cancelled'
        case 'order expired':
          return 'Order Expired'
        case 'order match':
          return 'Order Match'
        case 'recredit backward quantity':
          return 'Recredit Backward Quantity'
        case 'recredit forward quantity':
          return 'Recredit Forward Quantity'
        case 'recredit wager':
          return 'Recredit Wager'
        case 'recredit wager remaining':
          return 'Recredit Wager Remaining'
        case 'reset issuance':
          return 'Reset Issuance'
        case 'wins':
          return 'Wins'

        // Default case
        default:
          return this.action
      }
    },
    badgeClass() {
      if (this.context === 'credit') {
        return 'bg-green-400/10 text-green-400 ring-green-400/20'
      }
      else if (this.context === 'debit') {
        return 'bg-red-400/10 text-red-400 ring-red-400/20'
      }
      return 'bg-gray-400/10 text-gray-400 ring-gray-400/20'
    },
  },
}
</script>
