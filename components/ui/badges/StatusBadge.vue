<template>
  <span
    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
    :class="badgeClass"
  >{{ badgeText }}</span>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    badgeText() {
      if (this.status.startsWith('invalid:')) {
        return formatTitleCase(this.status)
      }
      switch (this.status) {
        case 'open':
          return 'Open'
        case 'expired':
          return 'Expired'
        case 'filled':
          return 'Filled'
        case 'cancelled':
          return 'Cancelled'
        case 'pending':
          return 'Pending'
        case 'completed':
          return 'Completed'
        case 'dropped':
          return 'Dropped'
        case 'settled: for equal':
          return 'Settled: For Equal'
        case 'settled: for notequal':
          return 'Settled: For Not Equal'
        case 'settled: liquidated for bear':
          return 'Settled: Liquidated For Bear'
        case 'valid':
          return 'Valid'
        case 'invalid':
          return 'Invalid'
        // Add other cases here as needed
        default:
          return this.status
      }
    },
    badgeClass() {
      if (this.status.startsWith('invalid:')) {
        return 'bg-red-400/10 text-red-400 ring-red-400/20'
      }
      switch (this.status) {
        case 'open':
          return 'bg-green-400/10 text-green-400 ring-green-400/20'
        case 'expired':
          return 'bg-red-400/10 text-red-400 ring-red-400/20'
        case 'filled':
          return 'bg-blue-400/10 text-blue-400 ring-blue-400/20'
        case 'cancelled':
          return 'bg-gray-400/10 text-gray-400 ring-gray-400/20'
        case 'pending':
          return 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20'
        case 'completed':
          return 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/20'
        case 'dropped':
          return 'bg-pink-400/10 text-pink-400 ring-pink-400/20'
        case 'settled: for equal':
          return 'bg-green-400/10 text-green-400 ring-green-400/20'
        case 'settled: for notequal':
          return 'bg-red-400/10 text-red-400 ring-red-400/20'
        case 'settled: liquidated for bear':
          return 'bg-orange-400/10 text-orange-400 ring-orange-400/20'
        case 'valid':
          return 'bg-green-400/10 text-green-400 ring-green-400/20'
        case 'invalid':
          return 'bg-red-400/10 text-red-400 ring-red-400/20'
        // Add other cases here as needed
        default:
          return 'bg-gray-400/10 text-gray-400 ring-gray-400/20'
      }
    },
  },
}
</script>
