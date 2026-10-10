<template>
  <div class="filter-section" v-if="options.length > 0">
    <button
      type="button"
      class="filter"
      :class="{ active: selected.length > 0 }"
      :aria-expanded="open"
      @click="$emit('toggleOpen', id)"
    >
      <p>
        {{ name }}
      </p>
      <div class="arrow-down"></div>
    </button>
    <div v-if="open" class="select-group">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="select-item"
        :class="{ active: selected.includes(option.value) }"
        :aria-pressed="selected.includes(option.value)"
        @click="toggle(option.value)"
      >
        <p>{{ option.label }}</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// One filter button of the map. It holds no state of its own: the selection
// comes from the map filters (and the URL) through `selected`.
const props = defineProps<{
  id: string;
  name: string;
  options: { value: string; label: string }[];
  selected: string[];
  multiple: boolean;
  open: boolean;
}>();
const emit = defineEmits<{
  toggleOpen: [id: string];
  update: [id: string, values: string[]];
}>();

function toggle(value: string) {
  let next: string[];
  if (props.selected.includes(value)) {
    next = props.selected.filter((v) => v !== value);
  } else {
    next = props.multiple ? [...props.selected, value] : [value];
  }
  emit("update", props.id, next);
}
</script>
<style scoped lang="scss">
/* Reset the browser's button look without outranking the rules below. */
:where(button.filter, button.select-item) {
  font: inherit;
  padding: 0;
  margin: 0;
}
.filter {
  height: 50px;
  background: #1bc2ccb3;
  width: 200px;
  // six buttons always fit in the panel (they overflowed it at ~1280 px)
  max-width: calc((100vw - 200px) / 6);
  border-radius: 15px;
  text-align: center;
  border: solid 3px $color-light;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  &:hover {
    background: $color-dark;
    border: solid 3px $color-light;
    p {
      color: $color-light;
    }
    .arrow-down {
      border-top: 10px solid $color-light;
    }
  }
  p {
    text-transform: uppercase;
    margin: 13px;
    font-weight: 900;
    width: 60%;
    color: $color-light;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;

    border-top: 10px solid $color-light;
  }
  &.active {
    background: $color-dark;
    border: solid 3px $color-light;
    p {
      color: $color-light;
    }
    .arrow-down {
      border-top: 10px solid $color-light;
    }
  }
}
.select-group {
  position: absolute;
  top: 105px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .select-item {
    width: 100%;
    height: 50px;
    background: transparent;
    border: 2px solid transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    p {
      text-transform: uppercase;
      margin: 13px;
      font-weight: 900;
      color: $color-light;
      box-sizing: border-box;
      border: 2px solid transparent;
    }
    &:hover {
      background: $color-main-second;
      border: solid 2px $color-light;
      box-sizing: border-box;
    }
    &.active {
      background: $color-main-second;
      border: solid 2px $color-light;
      box-sizing: border-box;
    }
  }
}
@media screen and (max-width: 1220px) {
  .filter {
    font-size: 0.8rem;
    line-height: 1rem;
    width: 130px;
  }
  .select-group {
    .select-item {
      font-size: 0.8rem;
    }
  }
}
@media screen and (max-width: 850px) {
  .filter {
    max-width: none;
    height: 40px;
  }
  /* On phones the options open right under their button, in the flow. */
  .filter-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .select-group {
    position: static;
    transform: none;
    width: 90%;
    margin-top: 6px;
    flex-wrap: wrap;
    gap: 4px;
    .select-item {
      flex: 1 1 40%;
      height: 40px;
    }
  }
}
</style>
