import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export function useTabs(defaultTab, tabs) {
  const router = useRouter();
  const route = useRoute();
  const activeTab = ref(defaultTab);

  // Helper function to set active tab from hash
  const setActiveTabFromHash = (hash) => {
    const cleanHash = hash.startsWith('#') ? hash.substring(1) : hash;
    const matchingTab = tabs.find(tab => tab.hash === cleanHash);
    if (matchingTab) {
      activeTab.value = matchingTab.name;
    } else {
      activeTab.value = defaultTab;
    }
  };

  // Initialize active tab from current URL hash
  onMounted(() => {
    setActiveTabFromHash(window.location.hash);
  });

  // React to hash changes
  watchEffect(() => {
    setActiveTabFromHash(route.hash);
  });

  const handleTabChange = (tabName) => {
    const tab = tabs.find(tab => tab.name === tabName);
    if (tab && typeof window !== 'undefined') {
      // This updates the URL hash and triggers the watchEffect
      router.push({ hash: tab.hash }).catch(err => {});
    }
  };

  return { activeTab, handleTabChange };
}
