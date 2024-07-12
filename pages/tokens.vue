<template>
  <div>
    <div class="lg:flex lg:items-center lg:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
          Cryptocurrencies
        </h1>
      </div>
    </div>

    <TokensTable collection="cryptocurrency" />
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Counterparty Tokens',
  ogTitle: 'Counterparty Tokens',
})
</script>
