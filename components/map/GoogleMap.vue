<template>
  <div class="main-map">
    <div ref="mapDiv" class="main-map"></div>
    <MainstructureLoader v-if="loading" />
  </div>
</template>
<script setup lang="ts">
import { MarkerClusterer, SuperClusterAlgorithm } from "@googlemaps/markerclusterer";

const props = defineProps<{ filters: MapFilters }>();
const emit = defineEmits<{ counts: [visible: number, total: number] }>();

const config = useRuntimeConfig();
const router = useRouter();
const mapDiv = ref<HTMLElement | null>(null);
const loading = ref(true);

// Not reactive on purpose: Google Maps objects must not be wrapped by Vue.
let entries: { mountain: MapMountain; marker: any }[] = [];
let clusterer: MarkerClusterer | null = null;

function applyFilters() {
  if (!clusterer) return;
  const visible = entries.filter((e) => matchesFilters(e.mountain, props.filters));
  clusterer.clearMarkers(true);
  clusterer.addMarkers(visible.map((e) => e.marker));
  emit("counts", visible.length, entries.length);
}

onMounted(async () => {
  try {
    const [mm, data] = await Promise.all([
      createMountainMap(mapDiv.value!, {
        apiKey: config.public.googleMapsApiKey,
        mapId: config.public.googleMapsMapId,
        center: { lat: -34, lng: -70.47 },
        zoom: 8,
        onNavigate: (path) => router.push(path),
      }),
      $fetch<MapMountain[]>(config.public.apiBase + "mountains/?no_pagination"),
    ]);

    entries = data.filter(hasCoordinates).map((mountain) => ({
      mountain,
      marker: mm.makeMarker(mountain, mountain.ascended ? "ascended" : "unclimbed"),
    }));

    clusterer = new MarkerClusterer({
      map: mm.map,
      markers: [],
      renderer: mm.clusterRenderer,
      // Group only pins that would overlap, and never once zoomed in.
      algorithm: new SuperClusterAlgorithm({ radius: 40, maxZoom: 11 }),
    });
    applyFilters();
  } catch (error) {
    console.error("No se pudo cargar el mapa", error);
  } finally {
    loading.value = false;
  }
});

watch(() => props.filters, applyFilters, { deep: true });
</script>
<style lang="scss">
.main-map {
  height: calc(100vh - 108px);
  width: calc(100% - 48px);
  margin: 9px auto auto auto;
  border-radius: 10px 10px 0 0;
}
</style>
