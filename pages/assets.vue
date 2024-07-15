<template>
  <div>
    <div class="lg:flex lg:items-center lg:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
          Counterparty Assets
        </h1>
      </div>
    </div>

    <AssetsTable />
  </div>
</template>

<script setup>
// SEO
useSeoMeta({
  title: `Counterparty Assets`,
  ogTitle: `Counterparty Assets`,
  description: 'Latest assets issued with Counterparty.',
  ogDescription: 'Detailed insights into Counterparty.',
  ogImage: 'https://api.xcp.io/img/full/default.png',
  twitterCard: 'summary_large_image',
})
</script>
