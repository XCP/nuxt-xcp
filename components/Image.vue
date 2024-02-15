<template>
  <div class="">
    <div v-if="isNsfw" @mouseover="hover = true" @mouseleave="hover = false" class="group">
      <!-- NSFW Image with Overlay -->
      <NuxtImg :src="computedImageUrl" :alt="computedAltText" class="w-full h-full object-contain" loading="lazy" :class="[props.apiData ? 'rounded-3xl' : 'rounded-2xl']" />
      <div class="absolute inset-0 bg-black bg-opacity-100 flex justify-center items-center text-white text-xl font-semibold rounded-xl cursor-pointer transition-opacity duration-[2000ms] ease-in-out" :class="{'opacity-0': hover}">
        NSFW Image <br /> Hover to See
      </div>
    </div>
    <!-- Regular Image -->
    <NuxtImg v-else :src="computedImageUrl" :alt="computedAltText" class="w-full h-full object-contain" :class="{'image-rendering-pixelated': shouldPixelate, 'rounded-3xl': props.apiData, 'rounded-2xl' : !props.apiData}" loading="lazy" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  asset: String,
  assetName: String, // Directly for the asset name
  apiData: Object,
  balance: Object,
  formatAssetName: Function // Optional prop for formatting
});

const hover = ref(false);

// Compute the asset name based on the provided props
const resolvedAssetName = computed(() => {
  if (props.assetName) return props.assetName;
  if (props.asset && !props.asset.includes('.')) return props.asset;
  if (props.apiData && props.apiData.asset_name) return props.apiData.asset_name;
  if (props.balance && props.balance.asset_name) return props.balance.asset_name;
  return ''; // Default case
});

const isNsfw = computed(() => isNSFW(resolvedAssetName.value));

// Compute the image URL
const computedImageUrl = computed(() => {
  return `https://api.xcp.io/img/full/${resolvedAssetName.value}`;
});

// Compute the alt text
const computedAltText = computed(() => {
  if (props.formatAssetName && (props.apiData || props.balance)) {
    return props.formatAssetName(resolvedAssetName.value, props.apiData || props.balance);
  }
  return resolvedAssetName.value;
});

// Optional: Compute if the asset should be pixelated
const shouldPixelate = computed(() => {
  return resolvedAssetName.value.startsWith('A');
});
</script>

<style>
/* Tailwind CSS does not directly support image-rendering, so use regular CSS if needed */
.image-rendering-pixelated {
  image-rendering: pixelated;
}
</style>
