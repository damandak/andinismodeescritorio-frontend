<template>
  <div class="location-content">
    <div class="nearby-mountains">
      <p>Cumbres cercanas:</p>
      <span v-for="mtn in nearbyMountains" :key="mtn.id">
        <NuxtLink :to="'/cerros/' + mtn.id">
          <span class="prefix">{{ mtn.prefix + " " }}</span>
          <span class="name">{{ mtn.name }}</span>
        </NuxtLink>
      </span>
    </div>
    <div ref="mapDiv" class="mtn-map"></div>
    <MainstructureLoader v-if="loading" />
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  mtnID: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  mtnName: { type: String, default: "" },
});
const config = useRuntimeConfig();
const router = useRouter();

const nearbyMountains: MapMountain[] = await $fetch<MapMountain[]>(
  config.public.apiBase + "mountains/?nearby=" + props.mtnID + "&no_pagination"
).catch(() => []);

const loading = ref(true);
const mapDiv = ref<HTMLElement | null>(null);
onMounted(async () => {
  try {
    const mm = await createMountainMap(mapDiv.value!, {
      apiKey: config.public.googleMapsApiKey,
      mapId: config.public.googleMapsMapId,
      center: { lat: parseFloat(props.latitude), lng: parseFloat(props.longitude) },
      zoom: 13,
      gestureHandling: "cooperative",
      onNavigate: (path) => router.push(path),
    });
    // Only this mountain (turquoise, larger) and its neighbours, instead of
    // downloading every mountain of the site.
    for (const m of nearbyMountains.filter(hasCoordinates)) {
      setMarkerMap(mm.makeMarker(m, m.ascended ? "ascended" : "unclimbed"), mm.map);
    }
    const [prefix, ...rest] = props.mtnName.split(" ");
    const current: MapMountain = {
      id: Number(props.mtnID),
      prefix: prefix ?? "",
      name: rest.join(" "),
      latitude: props.latitude,
      longitude: props.longitude,
      altitude: null,
      ascended: true,
    };
    const currentMarker = mm.makeMarker(current, "current");
    setMarkerMap(currentMarker, mm.map);
  } catch (error) {
    console.error("No se pudo cargar el mapa", error);
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped lang="scss">
.mtn-map {
  height: 75vh;
  width: calc(100% - 48px);
  margin: 9px auto auto auto;
}
.nearby-mountains {
  width: 80%;
  margin: 0 auto;
  p {
    margin: 10px 0 5px 0;
  }
  a {
    background-color: $color-main-second;
    color: white;
    margin: 2px;
    padding: 4px 10px;
    line-height: 30px;
    display: inline-block;
    border: 2px solid $color-main-second;
    font-weight: 500;
    &:hover {
      color: $color-main-second;
      background-color: $color-light;
      border: 2px solid $color-light-dark;
    }
  }
}
</style>
