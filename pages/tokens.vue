<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="min-w-0 flex-1">
      <h1 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Cryptocurrencies
      </h1>
    </div>
  </div>

  <TokensTable collection="cryptocurrency" />

</template>

<script setup>
  useSeoMeta({
    title: 'Counterparty Tokens',
    ogTitle: 'Counterparty Tokens',
  })
</script>
