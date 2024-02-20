<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="min-w-0 flex-1">
      <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
        Counterparty NFTs
      </h1>
    </div>
  </div>

  <TagsTable type="collection" />

</template>

<script setup>
  useSeoMeta({
    title: 'Counterparty NFTs',
    ogTitle: 'Counterparty NFTs',
    description: 'Tracking a metaverse of thousands of Bitcoin NFTs going back to 2014.',
    ogDescription: 'Tracking a metaverse of thousands of Bitcoin NFTs going back to 2014.',
  })
</script>
