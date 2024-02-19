import { ref, watch, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';

export function useTabs(defaultTab, tabs) {
  const route = useRoute();
  const activeTab = ref(defaultTab);

  const findTabByHash = (hash) => {
    const cleanHash = hash.replace('#', '');
    const matchingTab = tabs.find(tab => tab.hash === cleanHash);
    return matchingTab ? matchingTab.name : defaultTab;
  };

  // Function to update the active tab from the current URL hash
  const updateActiveTabFromHash = () => {
    const currentHash = window.location.hash; // Directly using window.location.hash for initial check
    activeTab.value = findTabByHash(currentHash);
  };

  // Reactively watch route.hash for changes and update the active tab accordingly
  watch(() => route.hash, (newHash) => {
    activeTab.value = findTabByHash(newHash);
  });

  // Handle manual tab changes (e.g., when a tab is clicked)
  const handleTabChange = (tabName) => {
    const tab = tabs.find(tab => tab.name === tabName);
    if (tab) {
      if (typeof window !== 'undefined') {
        window.location.hash = tab.hash || '';
      }
    }
  };

  // Ensure the active tab is correctly set on initial load
  onMounted(async () => {
    await nextTick(); // Wait for the component to fully initialize
    updateActiveTabFromHash(); // Then update the active tab from the URL hash
  });

  return { activeTab, handleTabChange };
}
