<template>
  <main class="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
    <div class="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
      <p class="text-base font-semibold leading-8 text-primary">Under Construction</p>
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">New XCP Explorer</h1>
      <p class="mt-4 text-base leading-7 text-gray-300 sm:mt-6 sm:text-lg sm:leading-8">Pardon the mess, development is still underway.</p>
    </div>
    <div class="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
      <h2 class="sr-only">Popular pages</h2>
      <ul role="list" class="-mt-6 divide-y divide-gray-900/5 border-b border-gray-900/5">
        <li v-for="(link, linkIdx) in links" :key="linkIdx" class="relative flex gap-x-6 py-6">
          <div class="flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-gray-900/10">
            <component :is="link.icon" class="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div class="flex-auto">
            <h3 class="text-sm font-semibold leading-6 text-primary">
              <a :href="link.href">
                <span class="absolute inset-0" aria-hidden="true" />
                {{ link.name }}
              </a>
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-300">{{ link.description }}</p>
          </div>
          <div class="flex-none self-center">
            <ChevronRightIcon class="h-5 w-5 text-gray-300" aria-hidden="true" />
          </div>
        </li>
      </ul>
      <div class="mt-10 flex justify-center">
        <a href="/collection" class="text-sm font-semibold leading-6 text-white flex items-center">
          Click Here to Discover  
          <SparklesIcon class="ml-1 h-5 w-5 flex-shrink-0 text-yellow-400" aria-hidden="true" />
        </a>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { BookmarkSquareIcon, BookOpenIcon, QueueListIcon, RssIcon, SparklesIcon } from '@heroicons/vue/24/solid'

const links = [
  {
    name: 'More NFT Collections',
    href: '/collections',
    description: 'There\'s at least 500 collections of more than 65k NFTs.',
    icon: BookOpenIcon,
  },
  {
    name: 'Counterparty Insights',
    href: '/charts',
    description: 'Usage & trend data of protocol messages and projects.',
    icon: QueueListIcon
  },
  {
    name: 'Tools for Dispensers',
    href: '/asset/XCP#dispensers',
    description: 'Easily find the current floor price for XCP or collections.',
    icon: BookmarkSquareIcon,
  },
  { name: 'Gallery View of Wallet', href: '/address/19QWXpMXeLkoEKEJv2xo9rn8wkPCyxACSX#balances', description: 'See your assets as images instead of icons, if you\'d like.', icon: RssIcon },
]
</script>