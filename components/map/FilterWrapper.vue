<template>
  <div class="filter-wrapper" :class="active">
    <MapFilter
      v-for="filter in filterDefs"
      :key="filter.id"
      :id="filter.id"
      :name="filter.name"
      :options="filter.options"
      :selected="selectedFor(filter.id)"
      :multiple="filter.multiple"
      :open="openFilter === filter.id"
      @toggle-open="toggleOpen"
      @update="update"
    />
    <div class="filter-summary" aria-live="polite">
      <span v-if="counts.total">
        {{ counts.visible.toLocaleString("es-CL") }} de
        {{ counts.total.toLocaleString("es-CL") }} cerros
      </span>
      <button
        v-if="activeFilterCount(modelValue) > 0"
        type="button"
        class="clear-filters"
        @click="clearAll"
      >
        Limpiar filtros
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  active: string;
  modelValue: MapFilters;
  counts: { visible: number; total: number };
}>();
const emit = defineEmits<{ "update:modelValue": [filters: MapFilters] }>();

const config = useRuntimeConfig();

// Options from the API, loaded in the browser (the panel starts closed).
const { data: apiOptions } = useAsyncData(
  "map-filter-options",
  async () => {
    const get = (path: string) =>
      $fetch<any>(config.public.apiBase + path)
        .then((d) => (Array.isArray(d) ? d : d?.results ?? []))
        .catch(() => []);
    const [prefixes, countries, regions] = await Promise.all([
      get("prefixes/"),
      get("countries/?only_andes"),
      get("regions/"),
    ]);
    return { prefixes, countries, regions };
  },
  { server: false, lazy: true }
);

const altitudes = (values: number[]) =>
  values.map((v) => ({ value: String(v), label: v.toLocaleString("es-CL") }));
const named = (rows: any[] | undefined, key = "name") =>
  (rows ?? []).map((r) => ({ value: r[key], label: r[key] }));

const filterDefs = computed(() => [
  { id: "prefixes", name: "prefijo", multiple: true, options: named(apiOptions.value?.prefixes, "prefix") },
  { id: "countries", name: "país", multiple: true, options: named(apiOptions.value?.countries) },
  { id: "regions", name: "región", multiple: true, options: named(apiOptions.value?.regions) },
  { id: "minAltitude", name: "altura mínima", multiple: false, options: altitudes([1000, 2000, 3000, 4000, 5000, 6000]) },
  { id: "maxAltitude", name: "altura máxima", multiple: false, options: altitudes([1000, 2000, 3000, 4000, 5000, 6000, 7000]) },
  {
    id: "ascended",
    name: "ascendida",
    multiple: false,
    options: [
      { value: "si", label: "Sí" },
      { value: "no", label: "No" },
    ],
  },
]);

function selectedFor(id: string): string[] {
  const f = props.modelValue;
  if (id === "prefixes" || id === "countries" || id === "regions") return f[id];
  if (id === "minAltitude" || id === "maxAltitude") return f[id] === null ? [] : [String(f[id])];
  if (id === "ascended") return f.ascended === null ? [] : [f.ascended ? "si" : "no"];
  return [];
}

function update(id: string, values: string[]) {
  const next: MapFilters = { ...props.modelValue };
  if (id === "prefixes" || id === "countries" || id === "regions") next[id] = values;
  if (id === "minAltitude" || id === "maxAltitude") next[id] = values.length ? Number(values[0]) : null;
  if (id === "ascended") next.ascended = values.length ? values[0] === "si" : null;
  emit("update:modelValue", next);
}

const openFilter = ref<string | null>(null);
function toggleOpen(id: string) {
  openFilter.value = openFilter.value === id ? null : id;
}

function clearAll() {
  openFilter.value = null;
  emit("update:modelValue", emptyFilters());
}
</script>
<style scoped lang="scss">
.filter-wrapper {
  position: fixed;
  top: 45px;
  height: 140px;
  width: calc(100vw - 48px);
  left: 24px;
  margin: 9px auto auto auto;
  opacity: 0;
  transition: all 1s ease-in-out;
  background: $color-dark-extreme;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding-top: 30px;
  gap: 20px;
  transform: translateY(-100%);
  border-radius: 10px 10px 0 0;
  border-bottom: solid 5px $color-light;
  &.active {
    opacity: 1;
    transform: translateY(0);
  }
}
.filter-summary {
  position: absolute;
  right: 20px;
  top: 6px;
  display: flex;
  gap: 12px;
  align-items: center;
  color: $color-light;
  font-size: 0.85rem;
  .clear-filters {
    font: inherit;
    font-weight: 700;
    color: $color-light;
    background: transparent;
    border: 1px solid $color-light;
    border-radius: 12px;
    padding: 2px 10px;
    cursor: pointer;
    &:hover {
      background: $color-main-second;
    }
  }
}
@media screen and (max-width: 850px) {
  .filter-summary {
    position: static;
    margin-top: 8px;
  }
  .filter-wrapper {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    padding-top: 10px;
    border-radius: 0;
    border-bottom: none;
    &.active {
      transform: translateY(0);
    }
  }
}
</style>
