// Tabs of the detail pages (cerro, ruta, ascenso, andinista), with the open tab
// in the URL so it can be shared: /cerros/612?tab=rutas. The first tab
// ("General") is the default and leaves the URL clean.

export type PageTab = {
  id: number;
  /** Name in the URL (?tab=rutas). */
  slug: string;
  title: string;
  iconname: string;
};

export function usePageTabs(tabs: PageTab[]) {
  const route = useRoute();
  const router = useRouter();

  const current = computed(() => tabs.find((t) => t.slug === route.query.tab) ?? tabs[0]);
  const selectedTab = computed(() => current.value.id);

  function switchTab(id: number) {
    const tab = tabs.find((t) => t.id === id);
    if (!tab || tab === current.value) return;
    const query = { ...route.query };
    if (tab === tabs[0]) delete query.tab;
    else query.tab = tab.slug;
    // replace, not push: switching tabs doesn't fill the "back" history.
    router.replace({ query });
  }

  /** Attributes for the element that shows the tab's content. */
  const panelAttrs = computed(() => ({
    id: "tab-panel",
    role: "tabpanel",
    "aria-labelledby": `tab-${current.value.slug}`,
  }));

  return { selectedTab, switchTab, panelAttrs };
}
