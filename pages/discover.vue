<template>
  <div v-if="loading" class="flex justify-center items-center my-40 py-40 text-gray-300">
    <ArrowPathIcon class="animate-spin h-8 w-8 text-gray-500" aria-hidden="true" />
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const loading = ref(true)
const router = useRouter()

const fetchTagsAndRedirect = async () => {
  try {
    const response = await fetch('https://api.xcp.io/api/tags?type=collection')
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    
    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length)
      const randomTag = data[randomIndex]
      router.push(`/collection/${randomTag.slug}`)
    } else {
      console.error('No tags found')
      // Handle the case where no tags are found, e.g., redirect to a default page or show an error message
    }
  } catch (error) {
    console.error('Fetch error:', error)
    // Handle fetch error, e.g., redirect to an error page or show an error message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTagsAndRedirect()
})
</script>
