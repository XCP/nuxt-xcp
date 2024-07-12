<template>
  <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset" :class="badgeClass">{{ badgeText }}</span>
</template>

<script>
export default {
  props: {
    type: {
      type: Number,
      required: true
    },
  },
  computed: {
    badgeText() {
      const BET_TYPE_NAME = {
        0: "BullCFD",
        1: "BearCFD",
        2: "Equal",
        3: "NotEqual"
      };

      return BET_TYPE_NAME[this.type] || "Unknown";
    },
    badgeClass() {
      switch (this.type) {
        case 0:
          return 'bg-green-400/10 text-green-400 ring-green-400/20';
        case 1:
          return 'bg-red-400/10 text-red-400 ring-red-400/20';
        case 2:
          return 'bg-blue-400/10 text-blue-400 ring-blue-400/20';
        case 3:
          return 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20';
        default:
          return 'bg-gray-400/10 text-gray-400 ring-gray-400/20';
      }
    },
  }
};
</script>
