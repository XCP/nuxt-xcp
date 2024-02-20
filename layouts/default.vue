<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                <div class="flex h-16 shrink-0 items-center">
                  <img class="h-7 w-auto" src="/img/xcpio.png" alt="XCP" />
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <a :href="item.href" :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-base leading-6 font-semibold']">
                            <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                            {{ item.name }}
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <div>
      <!-- Sticky search header -->
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-white" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-5 w-5" aria-hidden="true" />
        </button>

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="hidden sm:flex h-16 shrink-0 items-center" :class="{'flex-1': !clientHydrated}">
            <a href="/">
              <img class="h-5 w-auto" src="/img/xcpio.png" alt="XCP" height="33" width="22" />
            </a>
            <a href="/" class="bg-gray-900 text-white rounded-md px-3 py-2 text-lg font-medium">Counterparty</a>
          </div>
          <!-- Combobox for Search -->
          <ClientOnly>
            <Combobox as="div" v-model="selectedSuggestion" class="flex flex-1">
              <div class="relative w-full">
                <ComboboxInput
                  class="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-base"
                  placeholder="Search..."
                  v-model="searchQuery"
                  @input="event => fetchSuggestions(event.target.value)"
                />
                <ComboboxButton class="absolute inset-y-0 left-0 flex items-center pr-2">
                  <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" aria-hidden="true" />
                </ComboboxButton>
                <ComboboxOptions v-if="suggestions.length > 0" class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ComboboxOption v-for="suggestion in suggestions" :key="suggestion.id" :value="suggestion" as="template" v-slot="{ active }">
                    <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-400']">
                      <a :href="`/${suggestion.type.toLowerCase()}/${suggestion.slug}`" class="flex items-center">
                        <img :src="suggestion.imageUrl" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                        <span class="ml-3 block truncate">{{ suggestion.name }}</span>
                        <span class="ml-auto text-sm text-gray-500">{{ suggestion.type }}</span>
                      </a>
                    </li>
                  </ComboboxOption>
                </ComboboxOptions>
              </div>
            </Combobox>
          </ClientOnly>
          <div class="hidden md:flex md:items-center md:space-x-4">
            <a href="/collections" class="bg-gray-900 text-white rounded-md px-3 py-2 text-base font-medium">Collections</a>
            <a href="/charts" class="bg-gray-900 text-white rounded-md px-3 py-2 text-base font-medium">Analytics</a>
            <a href="/collection" class="flex items-center bg-gray-900 text-white rounded-md px-3 py-2 text-base font-medium">
              Discover
              <SparklesIcon class="ml-1 h-5 w-5 flex-shrink-0 text-yellow-400" aria-hidden="true" />
            </a>
          </div>
          <div class="flex shrink-0 items-center">
            <button type="button" class="relative inline-flex items-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>

      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>

      <footer class="p-4 sm:p-6 lg:p-8">
        <div class="border-t border-white/10 pt-8">
          <p class="text-sm leading-5 text-gray-400 text-center">Data provided 'as-is' without warranty of accuracy.</p>
        </div>
      </footer>
    </div>
  </div>
  <SpeedInsights />
</template>

<script setup>
import { ref } from 'vue'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { SparklesIcon, Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'

const navigation = [
  { name: 'Crypto', href: '/tokens', path: 'address', icon: ServerIcon, current: false },
  { name: 'NFTs', href: '/collections', icon: SignalIcon, current: false },
  { name: 'Usage', href: '/charts', icon: ChartBarSquareIcon, current: false },
]
const teams = []

const sidebarOpen = ref(false)
const searchQuery = ref('')
const selectedSuggestion = ref(null)
const suggestions = ref([])

// Simulate API call for suggestions
async function fetchSuggestions(query) {
  if (query.trim() === '') {
    suggestions.value = []
    return
  }

  try {
    const data = await $fetch(`/api/v1/search?query=${encodeURIComponent(query)}`, {
      baseURL: 'https://api.xcp.io',
    })

    // Assuming the API returns data in the format { addresses: [], assets: [], tags: [], txs: [] }
    suggestions.value = processSuggestions(data)
  } catch (error) {
    console.error('Fetch error:', error)
    suggestions.value = []
  }
}

// Processing function to map API response to the expected format
function processSuggestions(data) {
  let mappedSuggestions = [];

  // Process 'tags' if they exist in the response
  if (data.tags && data.tags.length > 0) {
    const tagSuggestions = data.tags.map(item => ({
      id: item.id, // Assuming each tag has a unique ID
      name: item.name, // The tag name
      slug: item.slug, // The tag name
      type: 'Collection', // Type to distinguish in the UI
      imageUrl: `https://api.xcp.io/img/logo-icon/${item.slug}`
    }));
    mappedSuggestions.push(...tagSuggestions);
  }

  // Process 'assets' if they exist in the response
  if (data.assets && data.assets.length > 0) {
    const assetSuggestions = data.assets.map(item => ({
      id: item.id, // Assuming each asset has a unique ID
      name: item.asset_longname || item.asset_name, // Some assets might have a long name
      slug: item.asset_longname || item.asset_name, // Some assets might have a long name
      type: 'Asset', // Type to distinguish in the UI
      imageUrl: `https://api.xcp.io/img/icon/${item.asset_name}`
    }));
    mappedSuggestions.push(...assetSuggestions);
  }

  // Process 'addresses' if they exist in the response
  if (data.addresses && data.addresses.length > 0) {
    const addressSuggestions = data.addresses.map(item => ({
      id: item.id, // Assuming each address has a unique ID
      name: item.address, // The address string
      slug: item.address,
      type: 'Address', // Type to distinguish in the UI
      imageUrl: "https://api.xcp.io/img/icon/default.png"
    }));
    mappedSuggestions.push(...addressSuggestions);
  }

  // Process 'txs' (transactions) if they exist in the response
  if (data.txs && data.txs.length > 0) {
    const txSuggestions = data.txs.map(item => ({
      id: item.id, // Assuming each transaction has a unique ID
      name: item.tx_hash, // The transaction hash
      slug: item.tx_hash, // The transaction hash
      type: 'TX', // Type to distinguish in the UI
      imageUrl: "https://api.xcp.io/img/icon/default.png"
    }));
    mappedSuggestions.push(...txSuggestions);
  }

  return mappedSuggestions;
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

watch(searchQuery, (newValue) => {
  if (newValue.trim().length > 3) {
    debouncedFetchSuggestions(newValue.trim());
  } else {
    suggestions.value = [];
  }
});

const route = useRoute()

watchEffect(() => {
  navigation.forEach(item => {
    item.current = false;
  });
  // Check if the current route path contains the substring of any navigation item href
  // If so, set that item's current property to true
  const activeItem = navigation.find(item => route.path.includes(item.path));
  if (activeItem) {
    activeItem.current = true;
  }
});

// State to track client-side hydration
const clientHydrated = ref(false)

// Simulate client-side hydration completion
onMounted(() => {
  // You might want to check or wait for actual client-only components to mount
  clientHydrated.value = true
})
</script>