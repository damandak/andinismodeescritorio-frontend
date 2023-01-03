<template>
  <div class="tab-wrapper">
    <div
      v-for="tab in tabs"
      key="tab.id"
      class="tab"
      :class="{ selected: tab.id === selectedTab }"
      @click="$emit('switchTab', tab.id)"
    >
        {{ tab.title }}
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['switchTab'])
const props = defineProps<{
  tabs: Array<{id: number, title: string}>;
  selectedTab: number;
}>()
</script>
<style scoped lang="scss">
.tab-wrapper {
  display: flex;
  flex-direction: row;
  height: 50px;

  .tab {
    border: 1px solid $color-light;
    background-color: $color-main-first;
    flex: 1 1 0px;
    text-align: center;
    padding-top: 10px;
    color: $color-light;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      background-color: $color-light;
      color: $color-main-first;
      border: 1px solid $color-light-dark;
    }
  }
  .tab.selected {
    background-color: $color-light;
    color: $color-main-first;
    border: 1px solid $color-light-dark;
  }
}
</style>