<template>
  <div>
    <div class="lg:flex lg:items-center lg:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
          Blocks
        </h1>
      </div>
    </div>

    <BlocksTable />
  </div>
</template>

<script setup>
// SEO
useSeoMeta({
  title: `Blocks`,
  ogTitle: `Blocks`,
  description: 'All Bitcoin blocks since Counterparty launched.',
  ogDescription: 'Detailed insights into Counterparty.',
  ogImage: 'https://api.xcp.io/img/full/default.png',
  twitterCard: 'summary_large_image',
})
</script>
