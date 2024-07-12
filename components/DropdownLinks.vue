<template>
  <ClientOnly>
    <Menu as="div" class="relative ml-3">
      <MenuButton class="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-white/20">
        <ArrowTopRightOnSquareIcon class="-ml-1 mr-1.5 h-4 w-4" aria-hidden="true" />
        Explorers
        <ChevronDownIcon class="-mr-1 ml-1.5 h-5 w-5" aria-hidden="true" />
      </MenuButton>
      <transition enter-active-class="transition ease-out duration-200" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
        <MenuItems class="absolute right-0 z-10 -ml-1 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <!-- eslint-disable-next-line vue/no-unused-vars -->
          <MenuItem v-for="(item, index) in props.items" :key="index" v-slot="{ active }">
            <a :href="item.href" target="_blank" class="flex items-center px-4 py-2 text-base text-gray-700 hover:bg-gray-100"> <!-- Here is the change -->
              <img :src="item.imgSrc" :alt="item.title + ' logo'" class="mr-2 h-4 w-4"> {{ item.title }}
            </a>
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>
  </ClientOnly>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ArrowTopRightOnSquareIcon, ChevronDownIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>
