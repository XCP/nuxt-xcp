import { ref, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export function useTabs(defaultTab, tabs) {
  const router = useRouter();
  const route = useRoute();
  const activeTab = ref(defaultTab);

  const findTabByHash = (hash) => {
    return tabs.find(tab => `#${tab.hash}` === hash) || tabs.find(tab => tab.name === defaultTab);
  };

  // React to changes in the hash fragment
  watchEffect(() => {
    const currentHash = route.hash;
    const matchingTab = findTabByHash(currentHash);
    activeTab.value = matchingTab.name;
  });

  const handleTabChange = (tabName) => {
    const tab = tabs.find(tab => tab.name === tabName);
    if (tab && typeof window !== 'undefined') {
      window.location.hash = tab.hash || '';
    }
  };

  return { activeTab, handleTabChange };
}
