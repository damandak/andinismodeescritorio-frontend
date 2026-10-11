<template>
  <div class="checklist">
    <input
      v-if="options.length > 10"
      v-model="filter"
      type="search"
      placeholder="Filtrar"
      :aria-label="`${label}: filtrar`"
    />
    <div class="box" role="group" :aria-label="label">
      <label v-for="o in shown" :key="o.value" class="check">
        <input type="checkbox" :checked="modelValue.includes(o.value)" @change="toggle(o.value)" />
        {{ o.label }}
      </label>
      <p v-if="!shown.length" class="hint">Sin coincidencias.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Several choices from a list (countries, regions, sectors...); the chosen
// ones first, with a filter when the list is long.
type Option = { value: number; label: string };
const props = defineProps<{ modelValue: number[]; options: Option[]; label: string }>();
const emit = defineEmits<{ "update:modelValue": [number[]] }>();
const filter = ref("");

const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
// Chosen ones first, decided when the page opens (so items don't jump while clicking).
const initial = new Set(props.modelValue);
const ordered = computed(() => [
  ...props.options.filter((o) => initial.has(o.value)),
  ...props.options.filter((o) => !initial.has(o.value)),
]);
const shown = computed(() => {
  const f = plain(filter.value.trim());
  return f ? ordered.value.filter((o) => plain(o.label).includes(f)) : ordered.value;
});
function toggle(value: number) {
  const set = new Set(props.modelValue);
  set.has(value) ? set.delete(value) : set.add(value);
  emit("update:modelValue", [...set]);
}
</script>

<style scoped lang="scss">
.checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 220px;
  overflow-y: auto;
  padding: 10px 14px;
  border: 2px solid $color-light-dark;
  border-radius: 10px;
  background: white;
}
</style>
