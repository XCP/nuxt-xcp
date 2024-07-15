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
      type: Number,
      required: true,
    },
  },
  computed: {
    badgeText() {
      const DISPENSER_STATUS_NAME = {
        0: 'Open',
        1: 'Open (Empty Address)',
        10: 'Closed',
        11: 'Closing',
        // 20: 'Open (Oracle Price)',
        // 21: 'Open (Oracle Price, Empty Address)',
      }

      return DISPENSER_STATUS_NAME[this.status] || 'Unknown'
    },
    badgeClass() {
      switch (this.status) {
        case 0:
          return 'bg-green-400/10 text-green-400 ring-green-400/20'
        case 1:
          return 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20'
        case 10:
          return 'bg-red-400/10 text-red-400 ring-red-400/20'
        case 11:
          return 'bg-orange-400/10 text-orange-400 ring-orange-400/20'
        // case 20:
        //   return 'bg-blue-400/10 text-blue-400 ring-blue-400/20'
        // case 21:
        //   return 'bg-purple-400/10 text-purple-400 ring-purple-400/20'
        default:
          return 'bg-gray-400/10 text-gray-400 ring-gray-400/20'
      }
    },
  },
}
</script>
