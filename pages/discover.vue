<template>
  <div v-if="loading" class="flex justify-center items-center">
    <span>Loading...</span>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
