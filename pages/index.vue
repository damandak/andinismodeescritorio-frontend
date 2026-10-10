<template>
  <div class="content-wrapper">
    <MapGoogleMap :filters="filters" @counts="onCounts" />
    <MapFilterWrapper v-model="filters" :active="activeFilter" :counts="counts" />
    <button type="button" class="mapbutton" :aria-expanded="activeFilter === 'active'" @click="toggleWrapper">
      <p>FILTROS</p>
      <span v-if="filterCount" class="badge" :aria-label="`${filterCount} filtros activos`">{{
        filterCount
      }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
usePageSeo({
  title: "Andinismo de Escritorio",
  description:
    "Mapa de los cerros de los Andes Centrales con sus primeros ascensos, rutas y andinistas. Filtra por altura, país, región y si están ascendidos.",
});

const route = useRoute();
const router = useRouter();

// Filters live in the URL (?pais=Chile&min=5000&ascendido=no), so a filtered
// map can be shared or bookmarked.
const filters = ref<MapFilters>(filtersFromQuery(route.query));
watch(
  filters,
  (f) => router.replace({ query: filtersToQuery(f) }),
  { deep: true }
);
const filterCount = computed(() => activeFilterCount(filters.value));

const counts = ref({ visible: 0, total: 0 });
function onCounts(visible: number, total: number) {
  counts.value = { visible, total };
}

const activeFilter = ref("");
function toggleWrapper() {
  activeFilter.value = activeFilter.value === "" ? "active" : "";
}
</script>

<style scoped lang="scss">
.mapbutton {
  font: inherit;
  box-sizing: content-box; // same size as when it was a <div>
  padding: 0 15px;
  height: 34px !important;
  width: 78px;
  font-size: 13px !important;
  cursor: pointer;

  background: $color-light;
  background: linear-gradient(to right, $color-main-first, $color-main-second)
    border-box;
  position: fixed;
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  line-height: initial;
  border: 3px solid $color-light;
  p {
    bottom: 10px;
    left: 26px;
    position: absolute;
    color: white;
    text-decoration: none;
    font-weight: 900;
    text-transform: uppercase;
    transition: color 0.7s ease-in-out;
    margin: 0;
    font-family: var(--font-serif);
  }
  &:hover {
    background: linear-gradient(to right, $color-light, $color-light) border-box;
    p {
      color: $color-main-first;
    }
  }
  .badge {
    position: absolute;
    top: -12px;
    right: -12px;
    min-width: 22px;
    height: 22px;
    border-radius: 11px;
    background: $color-dark-extreme;
    color: $color-light;
    border: 2px solid $color-light;
    font-size: 12px;
    font-weight: 700;
    line-height: 18px;
    text-align: center;
    box-sizing: border-box;
  }
}
</style>
