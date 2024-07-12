<template>
  <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset" :class="badgeClass">{{ badgeText }}</span>
</template>

<script>
export default {
  props: {
    flags: {
      type: Number,
      required: true
    },
  },
  computed: {
    badgeText() {
      const FLAG_BALANCES = 1;
      const FLAG_OWNERSHIP = 2;
      const FLAG_BINARY_MEMO = 4;

      let texts = [];

      if (this.flags & FLAG_BALANCES) {
        texts.push('Balances');
      }
      if (this.flags & FLAG_OWNERSHIP) {
        texts.push('Ownership');
      }
      if (this.flags & FLAG_BINARY_MEMO) {
        texts.push('Binary Memo');
      }

      return texts.length > 0 ? texts.join(', ') : 'None';
    },
    badgeClass() {
      return 'bg-blue-400/10 text-blue-400 ring-blue-400/20';
    },
  }
};
</script>
