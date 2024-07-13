import { ref, onMounted, nextTick } from 'vue'

export function useTabs(defaultTab, tabs) {
  const activeTab = ref(defaultTab)

  // Handle manual tab changes (e.g., when a tab is clicked)
  const handleTabChange = (tabName) => {
    const tab = tabs.find(tab => tab.name === tabName)
    if (tab) {
      activeTab.value = tab.name
    }
  }

  // Ensure the active tab is correctly set on initial load
  onMounted(async () => {
    await nextTick()
    activeTab.value = defaultTab
  })

  return { activeTab, handleTabChange }
}
