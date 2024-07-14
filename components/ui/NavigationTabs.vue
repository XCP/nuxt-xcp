<template>
  <!-- Mobile view: Dropdown -->
  <div class="sm:hidden">
    <label
      for="tabs"
      class="sr-only"
    >Select a tab</label>
    <select
      id="tabs"
      class="block w-full text-white bg-gray-800 rounded text-base focus:outline-none md:w-auto"
      @change="emitTabChange($event.target.value)"
    >
      <option
        v-for="tab in tabs"
        :key="tab.hash"
        :value="tab.name"
        :selected="tab.name === activeTab"
      >
        {{ tab.name }}
      </option>
    </select>
  </div>

  <!-- Desktop view: Tab links -->
  <div class="hidden sm:block mb-6">
    <nav
      class="flex"
      aria-label="Tabs"
    >
      <ul class="flex w-full border-b border-white/5">
        <li
          v-for="tab in visibleTabs"
          :key="tab.hash"
          class="last:mr-0"
        >
          <button
            :class="[
              'px-4 py-2 mr-[1px] text-base font-medium rounded-none',
              tab.name === activeTab ? 'bg-white/10 text-white' : 'bg-gray-700/10 text-gray-300 hover:bg-white/20 hover:text-white',
            ]"
            class="first:rounded-tl-md last:rounded-tr-md"
            @click="emitTabChange(tab.name)"
          >
            {{ tab.name }}
          </button>
        </li>
        <li
          v-if="hiddenTabs.length > 0"
          class="relative"
        >
          <Menu
            as="div"
            class="relative"
          >
            <MenuButton
              :class="[
                'inline-flex items-center rounded-md px-3 py-2 text-base font-semibold shadow-sm',
                isHiddenTabActive ? 'bg-white/10 text-white' : 'bg-gray-700/10 text-gray-300 hover:bg-white/20 hover:text-white',
              ]"
            >
              More
              <ChevronDownIcon
                class="-mr-1 ml-1.5 h-5 w-5"
                aria-hidden="true"
              />
            </MenuButton>
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem
                  v-for="tab in hiddenTabs"
                  :key="tab.hash"
                >
                  <button
                    class="flex items-center px-4 py-2 text-base text-gray-700 hover:bg-gray-100 w-full"
                    @click="emitTabChange(tab.name)"
                  >
                    {{ tab.name }}
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const { trackEvent } = useFathom()

const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  activeTab: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['tab-change'])

const activeTab = ref(props.activeTab)
const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
const visibleTabs = ref([])
const hiddenTabs = ref([])

const calculateTabs = () => {
  const tabWidth = 120
  const maxVisibleTabs = Math.floor(screenWidth.value / tabWidth)
  visibleTabs.value = props.tabs.slice(0, maxVisibleTabs)
  hiddenTabs.value = props.tabs.slice(maxVisibleTabs)
}

const emitTabChange = (selectedTab) => {
  trackEvent(selectedTab)
  emit('tab-change', selectedTab)
  activeTab.value = selectedTab
}

const isHiddenTabActive = computed(() => {
  return hiddenTabs.value.some(tab => tab.name === activeTab.value)
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      screenWidth.value = window.innerWidth
      calculateTabs()
    })
    screenWidth.value = window.innerWidth
    calculateTabs()
  }
})

watch(() => props.tabs, calculateTabs)
watch(() => props.activeTab, (newValue) => {
  activeTab.value = newValue
})
</script>
