<template>
  <TableTemplate
    :api-client-function="apiClientFunction"
    result-key="expirations"
  >
    <template #table-headers>
      <tr>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Type
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold"
        >
          Object ID
        </th>
        <th
          scope="col"
          class="py-2 pr-2 font-semibold w-20"
        >
          Time
        </th>
        <th
          scope="col"
          class="py-2 pl-0 w-20"
        >
          <span class="sr-only">View</span>
        </th>
      </tr>
    </template>
    <template #table-rows="{ data }">
      <tr
        v-for="(expiration, index) in data"
        :key="index"
      >
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          <CategoryBadge :category="expiration.type" />
        </td>
        <td class="whitespace-nowrap py-3 pr-3 min-w-64">
          <NuxtLink
            :to="`/tx/${expiration.object_id}`"
            class="font-medium leading-6 text-base text-white"
          >
            {{ expiration.object_id }}
          </NuxtLink>
        </td>
        <td class="whitespace-nowrap py-3 pr-3 text-base leading-6 text-gray-300">
          {{ formatTimeAgo(expiration.block_time) }}
        </td>
        <td class="whitespace-nowrap py-3 pl-0 text-base font-medium text-right h-16">
          <NuxtLink
            :to="`/tx/${expiration.object_id}`"
            class="text-primary"
          >
            View
          </NuxtLink>
        </td>
      </tr>
    </template>
  </TableTemplate>
</template>

<script setup>
import { useNuxtApp } from '#app'

const props = defineProps({
  blockIndex: {
    type: String,
    default: '',
  },
})

const { $apiClient } = useNuxtApp()

const apiClientFunction = (params = {}) => {
  params.verbose = true

  if (props.blockIndex) {
    return $apiClient.getBlockExpirations(props.blockIndex, params)
  }
  else {
    throw new Error('Block index prop is required for API call')
  }
}
</script>
