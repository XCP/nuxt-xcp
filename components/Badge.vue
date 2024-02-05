<template>
  <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset" :class="badgeClass">{{ badgeText }}</span>
</template>

<script>
export default {
  props: {
    category: {
      type: String,
      required: true
    },
  },
  computed: {
    badgeText() {
      switch (this.category) {
        case 'sends':
          return 'Send';
        case 'orders':
          return 'Order';
        case 'bet_expirations':
          return 'Bet Expiration';
        case 'bet_match_expirations':
          return 'Bet Match Expiration';
        case 'bet_match_resolutions':
          return 'Bet Match Resolution';
        case 'bet_matches':
          return 'Bet Match';
        case 'bets':
          return 'Bet';
        case 'broadcasts':
          return 'Broadcast';
        case 'btcpays':
          return 'BTCPay';
        case 'burns':
          return 'Burn';
        case 'cancels':
          return 'Cancel';
        case 'order_expirations':
          return 'Order Expiration';
        case 'order_match_expirations':
          return 'Order Match Expiration';
        case 'order_matches':
          return 'Order Match';
        case 'replace':
          return 'Replace';
        case 'rps':
          return 'RPS';
        case 'rps_expirations':
          return 'RPS Expiration';
        case 'rps_match_expirations':
          return 'RPS Match Expiration';
        case 'rps_matches':
          return 'RPS Match';
        case 'rpsresolves':
          return 'RPS Resolve';
        case 'sweeps':
          return 'Sweep';
        case 'credits':
          return 'Credit';
        case 'debits':
          return 'Debit';
        case 'issuances':
          return 'Issuance';
        case 'dispensers':
          return 'Dispenser';
        case 'dispenses':
          return 'Dispense';
        case 'dividends':
          return 'Dividend';
        case 'destructions':
          return 'Destruction';
        case 'dispenser_refills':
          return 'Dispenser Refill';
        default:
          return 'Unknown';
      }
    },
    badgeClass() {
      switch (this.category) {
        case 'sends':
          return 'bg-orange-400/10 text-orange-400 ring-orange-400/20';
        case 'orders':
          return 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20';
        case 'bet_expirations':
          return 'bg-red-400/10 text-red-400 ring-red-400/20';
        case 'bet_match_expirations':
          return 'bg-red-400/10 text-red-400 ring-red-400/20';
        case 'bet_match_resolutions':
          return 'bg-green-400/10 text-green-400 ring-green-400/20';
        case 'bet_matches':
          return 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/20';
        case 'bets':
          return 'bg-purple-400/10 text-purple-400 ring-purple-400/20';
        case 'broadcasts':
          return 'bg-pink-400/10 text-pink-400 ring-pink-400/20';
        case 'btcpays':
          return 'bg-orange-400/10 text-orange-400 ring-orange-400/20';
        case 'burns':
          return 'bg-orange-400/10 text-orange-400 ring-orange-400/20';
        case 'cancels':
          return 'bg-gray-400/10 text-gray-400 ring-gray-400/20';
        case 'order_expirations':
          return 'bg-red-400/10 text-red-400 ring-red-400/20';
        case 'order_match_expirations':
          return 'bg-red-400/10 text-red-400 ring-red-400/20';
        case 'order_matches':
          return 'bg-green-400/10 text-green-400 ring-green-400/20';
        case 'replace':
          return 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/20';
        case 'rps':
          return 'bg-blue-400/10 text-blue-400 ring-blue-400/20';
        case 'rps_expirations':
          return 'bg-red-400/10 text-red-400 ring-red-400/20';
        case 'rps_match_expirations':
          return 'bg-red-400/10 text-red-400 ring-red-400/20';
        case 'rps_matches':
          return 'bg-green-400/10 text-green-400 ring-green-400/20';
        case 'rpsresolves':
          return 'bg-blue-400/10 text-blue-400 ring-blue-400/20';
        case 'sweeps':
          return 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/20';
        case 'credits':
          return 'bg-green-400/10 text-green-400 ring-green-400/20';
        case 'debits':
          return 'bg-red-400/10 text-red-400 ring-red-400/20';
        case 'issuances':
          return 'bg-pink-400/10 text-pink-400 ring-pink-400/20';
        case 'dispensers':
          return 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/20';
        case 'dispenses':
          return 'bg-orange-400/10 text-orange-400 ring-orange-400/20';
        case 'dividends':
          return 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/20';
        case 'destructions':
          return 'bg-red-400/10 text-red-400 ring-red-400/20';
        case 'dispenser_refills':
          return 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20';
        default:
          return 'bg-gray-400/10 text-gray-400 ring-gray-400/20';
      }
    },
  }
};
</script>
