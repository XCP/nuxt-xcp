<template>
  <div>
    <TransitionRoot
      as="template"
      :show="sidebarOpen"
    >
      <Dialog
        as="div"
        class="relative z-50"
        @close="sidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    class="-m-2.5 p-2.5"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon
                      class="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </TransitionChild>
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                <div class="flex h-16 shrink-0 items-center">
                  <img
                    class="h-7 w-auto"
                    src="/img/xcpio.png"
                    alt="XCP"
                  >
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul
                    role="list"
                    class="flex flex-1 flex-col gap-y-7"
                  >
                    <li>
                      <ul
                        role="list"
                        class="-mx-2 space-y-1"
                      >
                        <li
                          v-for="item in navigation"
                          :key="item.name"
                        >
                          <nuxt-link
                            :to="item.href"
                            @click="sidebarOpen = false"
                            :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-base leading-6 font-semibold']"
                          >
                            <component
                              :is="item.icon"
                              class="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </nuxt-link>
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
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
        <button
          type="button"
          class="-m-2.5 p-2.5 text-white"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon
            class="h-5 w-5"
            aria-hidden="true"
          />
        </button>

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div
            class="hidden sm:flex h-16 shrink-0 items-center"
            :class="{ 'flex-1': !clientHydrated }"
          >
            <nuxt-link to="/">
              <img
                class="h-5 w-auto"
                src="/img/xcpio.png"
                alt="XCP"
                height="33"
                width="22"
              >
            </nuxt-link>
            <nuxt-link
              to="/"
              class="bg-gray-900 text-white rounded-md px-3 py-2 text-lg font-medium"
            >
              Counterparty XCP
            </nuxt-link>
          </div>
          <ClientOnly>
            <Combobox
              v-model="selectedSuggestion"
              as="div"
              class="flex flex-1"
            >
              <div class="relative w-full">
                <ComboboxInput
                  v-model="searchQuery"
                  class="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-base"
                  placeholder="Search..."
                  @input="event => fetchSuggestions(event.target.value)"
                />
                <ComboboxButton class="absolute inset-y-0 left-0 flex items-center pr-2">
                  <MagnifyingGlassIcon
                    class="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </ComboboxButton>
                <ComboboxOptions
                  v-if="suggestions.length > 0"
                  class="absolute z-10 mt-1 max-h-56 xl:max-h-72 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  <ComboboxOption
                    v-for="suggestion in suggestions"
                    :key="suggestion.id"
                    v-slot="{ active }"
                    :value="suggestion"
                    as="template"
                  >
                    <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-400']">
                      <a
                        :href="`/${suggestion.type.toLowerCase()}/${suggestion.slug}`"
                        class="flex items-center"
                      >
                        <img
                          :src="suggestion.imageUrl"
                          alt=""
                          class="h-6 w-6 flex-shrink-0 rounded-full"
                        >
                        <span class="ml-3 block truncate">{{ suggestion.name }}</span>
                        <span class="ml-auto text-sm text-gray-400">{{ suggestion.type }}</span>
                      </a>
                    </li>
                  </ComboboxOption>
                </ComboboxOptions>
              </div>
            </Combobox>
          </ClientOnly>
          <div class="hidden lg:flex md:items-center md:space-x-3">
            <a class="bg-gray-900 text-white rounded-md px-2 py-2 text-base flex items-center">
              <b class="mr-2">{{ btcPrice.symbol }}</b> {{ btcPrice.price }}
              <span
                class="text-sm ml-2 flex items-center"
                :class="{ 'text-green-400': btcChange > 0, 'text-red-400': btcChange < 0 }"
                title="24 Hour Change"
              >
                <span
                  v-if="btcChange > 0"
                  class="text-xs mr-1"
                >▲</span>
                <span
                  v-if="btcChange < 0"
                  class="text-xs mr-1"
                >▼</span>
                {{ btcChange }}%
              </span>
            </a>
            <a class="bg-gray-900 text-white rounded-md px-2 py-2 text-base flex items-center">
              <b class="mr-2">{{ xcpPrice.symbol }}</b> {{ xcpPrice.price }}
              <span
                class="text-sm ml-2 flex items-center"
                :class="{ 'text-green-400': xcpChange > 0, 'text-red-400': xcpChange < 0 }"
                title="24 Hour Change"
              >
                <span
                  v-if="xcpChange > 0"
                  class="text-xs mr-1"
                >▲</span>
                <span
                  v-if="xcpChange < 0"
                  class="text-xs mr-1"
                >▼</span>
                {{ xcpChange }}%
              </span>
            </a>
            <NuxtLink
              to="/mempool"
              class="bg-gray-900 text-white rounded-md px-2 py-2 text-sm flex lg:hidden xl:flex items-center"
            >
              <span><CubeIcon
                class="h-5 w-5 text-white mr-1"
                aria-hidden="true"
              /></span>
              <span>{{ fastestFee }} sats/vB</span>
            </NuxtLink>
          </div>
          <div class="flex shrink-0 items-center">
            <button
              type="button"
              class="relative inline-flex items-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              @click="connectWalletDialogOpen = true; trackEvent('Connect Wallet')"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>

      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>

      <OverallFooter />
    </div>

    <SpeedInsights />

    <TransitionRoot
      as="template"
      :show="connectWalletDialogOpen"
    >
      <Dialog
        as="div"
        class="relative z-50"
        @close="connectWalletDialogOpen = false"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                    <img
                      class="h-6 w-auto"
                      src="/img/xcpio.png"
                      alt="XCP"
                    >
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      class="text-base font-semibold leading-6 text-gray-900"
                    >
                      Wallet Functionality Not Ready Yet
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-400">
                        Are you a wallet developer? Get in touch!
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    @click="connectWalletDialogOpen = false"
                  >
                    Close Window
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  CircleStackIcon,
  PhotoIcon,
  CubeIcon,
  CubeTransparentIcon,
  LinkIcon,
  BriefcaseIcon,
  BanknotesIcon,
  CursorArrowRippleIcon,
  ShareIcon,
  FireIcon,
  SpeakerWaveIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  PaperAirplaneIcon,
} from '@heroicons/vue/24/outline'
import { SparklesIcon, Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'

const { trackEvent } = useFathom()

const navigation = [
  { name: 'Mempool', href: '/mempool', icon: CubeTransparentIcon, current: false },
  { name: 'Blocks', href: '/blocks', icon: CubeIcon, current: false },
  { name: 'Transactions', href: '/transactions', icon: LinkIcon, current: false },
  { name: 'Assets', href: '/assets', icon: BriefcaseIcon, current: false },
  { name: 'Bets', href: '/bets', icon: BanknotesIcon, current: false },
  { name: 'Broadcasts', href: '/broadcasts', icon: SpeakerWaveIcon, current: false },
  { name: 'Burns', href: '/burns', icon: FireIcon, current: false },
  { name: 'Dispensers', href: '/dispensers', icon: BuildingStorefrontIcon, current: false },
  { name: 'Dispenses', href: '/dispenses', icon: CircleStackIcon, current: false },
  { name: 'Dividends', href: '/dividends', icon: ShareIcon, current: false },
  { name: 'Issuances', href: '/issuances', icon: PhotoIcon, current: false },
  { name: 'Orders', href: '/orders', icon:   CursorArrowRippleIcon, current: false },
  { name: 'Sends', href: '/sends', icon: PaperAirplaneIcon, current: false },
]
const connectWalletDialogOpen = ref(false)

const sidebarOpen = ref(false)
const searchQuery = ref('')
const selectedSuggestion = ref(null)
const suggestions = ref([])

const btcPrice = ref({ symbol: 'BTC', price: 'N/A' })
const xcpPrice = ref({ symbol: 'XCP', price: 'N/A' })
const btcChange = ref(null)
const xcpChange = ref(null)
const fastestFee = ref('')

// Function to fetch the BTC and XCP prices from CoinGecko
async function fetchPrices() {
  try {
    const response = await fetch(`/api/prices`);
    const data = await response.json();

    if (data.success) {
      const btcData = data.data.bitcoin;
      const xcpData = data.data.counterparty;

      const btcPriceValue = btcData.usd.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      btcPrice.value = { symbol: 'BTC', price: `$${btcPriceValue}` };
      btcChange.value = btcData.usd_24h_change.toFixed(2);

      const xcpPriceValue = xcpData.usd.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      xcpPrice.value = { symbol: 'XCP', price: `$${xcpPriceValue}` };
      xcpChange.value = xcpData.usd_24h_change.toFixed(2);
    } else {
      throw new Error(data.error || 'Failed to fetch prices');
    }
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    btcPrice.value = { symbol: 'BTC', price: 'N/A' };
    xcpPrice.value = { symbol: 'XCP', price: 'N/A' };
    btcChange.value = null;
    xcpChange.value = null;
  }
}

// Function to fetch the fastest fee from mempool.space API
async function fetchFastestFee() {
  try {
    const data = await getCachedData(
      'fastest_fee',
      async () => {
        const response = await fetch('https://mempool.space/api/v1/fees/recommended')
        return response.json()
      },
      60,
    )
    fastestFee.value = data.fastestFee
  }
  catch (error) {
    console.error('Failed to fetch fastest fee:', error)
    fastestFee.value = 'N/A'
  }
}

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

    suggestions.value = processSuggestions(data)
  }
  catch (error) {
    console.error('Fetch error:', error)
    suggestions.value = []
  }
}

// Processing function to map API response to the expected format
function processSuggestions(data) {
  const mappedSuggestions = []

  if (data.assets && data.assets.length > 0) {
    const assetSuggestions = data.assets.map(item => ({
      id: item.id,
      name: item.asset_longname || item.asset_name,
      slug: item.asset_longname || item.asset_name,
      type: 'Asset',
      imageUrl: `https://api.xcp.io/img/icon/${item.asset_name}`,
    }))
    mappedSuggestions.push(...assetSuggestions)
  }

  if (data.addresses && data.addresses.length > 0) {
    const addressSuggestions = data.addresses.map(item => ({
      id: item.id,
      name: item.address,
      slug: item.address,
      type: 'Address',
      imageUrl: 'https://api.xcp.io/img/icon/default.png',
    }))
    mappedSuggestions.push(...addressSuggestions)
  }

  if (data.txs && data.txs.length > 0) {
    const txSuggestions = data.txs.map(item => ({
      id: item.id,
      name: item.tx_hash,
      slug: item.tx_hash,
      type: 'TX',
      imageUrl: 'https://api.xcp.io/img/icon/default.png',
    }))
    mappedSuggestions.push(...txSuggestions)
  }

  return mappedSuggestions
}

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

const debouncedFetchSuggestions = debounce(fetchSuggestions, 300)

watch(searchQuery, (newValue) => {
  if (newValue.trim().length > 3) {
    debouncedFetchSuggestions(newValue.trim())
  }
  else {
    suggestions.value = []
  }
})

const route = useRoute()

watchEffect(() => {
  navigation.forEach((item) => {
    item.current = false
  })
  const activeItem = navigation.find(item => route.path.includes(item.path))
  if (activeItem) {
    activeItem.current = true
  }
})

const clientHydrated = ref(false)

onMounted(() => {
  clientHydrated.value = true

  fetchPrices()
  fetchFastestFee()
  setInterval(fetchPrices, 60000)
  setInterval(fetchFastestFee, 60000)
})
</script>
