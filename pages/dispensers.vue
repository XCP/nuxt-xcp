<template>
  <div>
    <div class="lg:flex lg:items-center lg:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
          Counterparty Dispensers
        </h1>
      </div>
    </div>

    <DispensersTable />
  </div>
</template>

<script setup>
// SEO
useSeoMeta({
  title: `Counterparty Dispensers`,
  ogTitle: `Counterparty Dispensers`,
  description: 'Dispensers created to dispense Counterparty assets.',
  ogDescription: 'Detailed insights into Counterparty.',
  ogImage: 'https://api.xcp.io/img/full/default.png',
  twitterCard: 'summary_large_image',
})
</script>
