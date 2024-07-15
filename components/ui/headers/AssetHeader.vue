<template>
  <div>
    <div class="lg:flex lg:items-center lg:justify-between mb-6">
      <div class="flex-1">
        <h1 class="text-2xl font-bold leading-7 text-white sm:text-4xl sm:tracking-tight">
          {{ formatAssetName(assetName, apiData) }}
        </h1>
        <!-- Main container for items, ensuring flex-wrap and responsive gap -->
        <div class="mt-1 flex flex-wrap items-center text-base text-gray-300 gap-x-3 sm:gap-x-6">
          <!-- Asset Details -->
          <div class="flex items-center w-auto mt-2">
            <LockClosedIcon
              v-if="apiData.locked"
              class="mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <LockOpenIcon
              v-else
              class="mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Supply: {{ formattedSupply }}
          </div>
          <div class="flex items-center w-auto mt-2">
            Holder Count: {{ apiData.holder_count }}
          </div>
        </div>
      </div>
      <div class="hidden sm:block mt-5 lg:mt-0 lg:ml-4">
        <DropdownLinks :items="dropdownItems" />
      </div>
    </div>
    <!-- Stats with horizontal scroll -->
    <div class="grid grid-cols-1 bg-gray-700/10">
      <div class="overflow-x-auto max-w-full">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="border-t border-white/5 pt-1 pb-2 px-4 sm:px-6 lg:px-8"
        >
          <p class="mt-2 flex items-baseline gap-x-2 whitespace-nowrap">
            <span class="text-sm font-medium leading-6 text-gray-400 min-w-36">{{ stat.name }}</span>
            <span class="text-sm font-medium leading-6 text-white">
              <template v-if="stat.isLink">
                <NuxtLink :to="stat.link">{{ stat.value }}</NuxtLink>
              </template>
              <template v-else>
                {{ stat.value }}
              </template>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { LockClosedIcon, LockOpenIcon } from '@heroicons/vue/20/solid'
import { useNuxtApp } from '#app'

// Define props
const props = defineProps({
  assetName: {
    type: String,
    default: '',
  },
})

const apiData = ref({})

const { $apiClient } = useNuxtApp()

const fetchData = async () => {
  try {
    const response = await $apiClient.getAsset(props.assetName)
    apiData.value = response.data.result
  }
  catch (error) {
    console.error('Fetch error:', error)
  }
}

onMounted(() => {
  fetchData()
})

watch(() => props.assetName, () => {
  fetchData()
})

const dropdownItems = computed(() => [
  { href: `https://pepe.wtf/asset/${props.assetName}`, imgSrc: '/img/pepewtf.png', title: 'pepe.wtf' },
  { href: `https://scarce.city/marketplace/digital/${props.assetName}`, imgSrc: '/img/scarcecity.png', title: 'scarce.city' },
  { href: `https://www.xchain.io/asset/${props.assetName}`, imgSrc: '/img/xchainio.png', title: 'xchain.io' },
  { href: `https://www.xcp.dev/asset/${props.assetName}`, imgSrc: '/img/xcpdev.png', title: 'xcp.dev' },
  { href: `https://xcp.ninja/asset/${props.assetName}`, imgSrc: '/img/xcpninja.png', title: 'xcp.ninja' },
])

const formattedSupply = computed(() => {
  if (!apiData.value.supply) return 'N/A'
  return apiData.value.divisible
    ? (apiData.value.supply / 100000000).toLocaleString()
    : apiData.value.supply.toLocaleString()
})

const stats = computed(() => [
  { name: 'Asset Name', value: apiData.value.asset || 'N/A' },
  { name: 'Asset Longname', value: apiData.value.asset_longname || 'N/A' },
  { name: 'Owner', value: apiData.value.owner || 'N/A', isLink: !!apiData.value.owner, link: `/address/${apiData.value.owner}` },
  { name: 'Divisible', value: apiData.value.divisible ? 'Yes' : 'No' },
  { name: 'Locked', value: apiData.value.locked ? 'Yes' : 'No' },
  { name: 'Supply', value: formattedSupply.value },
  { name: 'Description', value: apiData.value.description || 'N/A' },
  { name: 'Issuer', value: apiData.value.issuer || 'N/A', isLink: !!apiData.value.issuer, link: `/address/${apiData.value.issuer}` },
  { name: 'Holder Count', value: apiData.value.holder_count || 'N/A' },
])
</script>
