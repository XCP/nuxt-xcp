<template>
  <div>
    <div v-if="isNsfw" @mouseover="hover = true" @mouseleave="hover = false" class="group">
      <!-- NSFW Image with Overlay -->
      <NuxtImg :src="computedImageUrl" :alt="computedAltText" class="w-full h-full object-contain" loading="lazy" :class="[props.apiData ? 'rounded-3xl' : 'rounded-2xl']" />
      <div class="absolute inset-0 bg-black bg-opacity-100 flex justify-center items-center text-white text-xl font-semibold rounded-xl cursor-pointer transition-opacity duration-2000ms ease-in-out" :class="{'opacity-0': hover}">
        NSFW Image <br /> Hover to See
      </div>
    </div>
    <!-- Regular Image -->
    <NuxtImg v-else :src="computedImageUrl" :alt="computedAltText" class="w-full h-full object-contain" :class="{'image-rendering-pixelated': shouldPixelate, 'rounded-3xl': props.apiData, 'rounded-2xl': !props.apiData}" loading="lazy" />
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';

const props = defineProps({
  asset: String,
  assetName: String,
  apiData: Object,
  balance: Object,
  formatAssetName: Function
});

const hover = ref(false);

const resolvedAssetName = computed(() => {
  if (props.assetName) return props.assetName;
  if (props.asset && !props.asset.includes('.')) return props.asset;
  if (props.apiData && props.apiData.asset_name) return props.apiData.asset_name;
  if (props.balance && props.balance.asset_name) return props.balance.asset_name;
  return '';
});

const isNsfw = computed(() => isNSFW(resolvedAssetName.value));

const computedImageUrl = computed(() => {
  return `https://api.xcp.io/img/full/${resolvedAssetName.value}`;
});

const computedAltText = computed(() => {
  if (props.formatAssetName && (props.apiData || props.balance)) {
    return props.formatAssetName(resolvedAssetName.value, props.apiData || props.balance);
  }
  return resolvedAssetName.value;
});

// Image size check moved to a watchEffect for reactivity
const shouldPixelateBasedOnSize = ref(false);

const checkImageSize = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = url;
  });
};

// Combined logic for determining pixelation
const shouldPixelate = computed(() => {
  // Quick check based on asset name
  if (resolvedAssetName.value.startsWith('A')) return true;
  // Defer to size check otherwise
  return shouldPixelateBasedOnSize.value;
});

watchEffect(async () => {
  if (!resolvedAssetName.value.startsWith('A')) {
    try {
      const { width, height } = await checkImageSize(computedImageUrl.value);
      shouldPixelateBasedOnSize.value = width <= 96 || height <= 96;
    } catch (error) {
      console.error("Failed to load image for size check", error);
      shouldPixelateBasedOnSize.value = false;
    }
  } else {
    shouldPixelateBasedOnSize.value = false;
  }
});
</script>

<style>
/* Tailwind CSS does not directly support image-rendering, so use regular CSS if needed */
.image-rendering-pixelated {
  image-rendering: pixelated;
}
</style>
