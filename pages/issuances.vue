<template>
  <div>
    <div class="lg:flex lg:items-center lg:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
          Counterparty Issuances
        </h1>
      </div>
    </div>

    <IssuancesTable />
  </div>
</template>

<script setup>
// SEO
useSeoMeta({
  title: `Counterparty Issuances`,
  ogTitle: `Counterparty Issuances`,
  description: 'Issuance messages on the Counterparty network.',
  ogDescription: 'Detailed insights into Counterparty.',
  ogImage: 'https://app.xcp.io/img/full/default.png',
  twitterCard: 'summary_large_image',
})
</script>
