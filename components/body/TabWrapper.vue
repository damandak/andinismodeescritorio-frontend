<template>
  <div class="tab-wrapper" role="tablist" :aria-label="label">
    <button
      v-for="(tab, index) in tabs"
      :id="`tab-${tab.slug}`"
      :key="tab.id"
      ref="buttons"
      type="button"
      role="tab"
      class="tab"
      :class="{ selected: tab.id === selectedTab }"
      :aria-selected="tab.id === selectedTab"
      aria-controls="tab-panel"
      :tabindex="tab.id === selectedTab ? 0 : -1"
      :title="tab.title"
      @click="$emit('switchTab', tab.id)"
      @keydown="onKeydown($event, index)"
    >
      <img :src="'/img/' + tab.iconname + '.svg'" alt="" class="icon" />
      <span class="tab-title">{{ tab.title }}</span>
    </button>
  </div>
</template>
<script setup lang="ts">
// Tabs of the detail pages. Which one is open lives in the URL
// (composables/usePageTabs.ts); this only draws them and handles the keyboard.
const emit = defineEmits<{ switchTab: [id: number] }>();
const props = withDefaults(
  defineProps<{ tabs: PageTab[]; selectedTab: number; label?: string }>(),
  { label: "Secciones" }
);

const buttons = ref<HTMLButtonElement[]>([]);

// Keyboard: arrows move between tabs, Home/End go to the first/last one.
function onKeydown(event: KeyboardEvent, index: number) {
  const last = props.tabs.length - 1;
  const target = (
    {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    } as Record<string, number>
  )[event.key];
  if (target === undefined) return;
  event.preventDefault();
  buttons.value[target]?.focus();
  emit("switchTab", props.tabs[target].id);
}
</script>
<style scoped lang="scss">
.tab-wrapper {
  display: flex;
  flex-direction: row;
  height: 50px;

  .tab {
    // A real button, made to look like the old tab.
    font: inherit;
    margin: 0;
    border-radius: 0;
    box-sizing: content-box; // buttons default to border-box
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    border: 1px solid $color-light;
    background-color: $color-main-first;
    flex: 1 1 0px;
    text-align: center;
    padding: 10px 0 0;
    color: $color-light;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      background-color: $color-light;
      color: $color-main-first;
      border: 1px solid $color-light-dark;
    }
    &:focus-visible {
      outline-offset: -4px;
    }
  }
  .tab.selected {
    background-color: $color-light;
    color: $color-main-first;
    border: 1px solid $color-light-dark;
  }
}
.icon {
  display: none;
  height: 30px;
}

@media (max-width: 768px) {
  .tab-wrapper {
    flex-direction: row;
    justify-content: center;
    .tab {
      flex: 0 1 auto !important;
      width: 14%;
      .icon {
        display: block;
        margin: 0 auto;
      }
      // Only the icon on small screens; the name stays for screen readers.
      .tab-title {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
      }
    }
  }
}
</style>
