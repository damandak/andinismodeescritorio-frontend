<template>
  <div class="location-content">
    <div ref="mapDiv" class="mtn-map"></div>
    <div class="nearby-mountains">
      <p>Cumbres cercanas: </p>
      <span v-for="mtn in nearbyMountains" :key="mtn.id">
        <NuxtLink :to="'/cerros/' + mtn.id">
          <span class="prefix">{{ mtn.prefix + " "}}</span>
          <span class="name">{{ mtn.name }}</span>
        </NuxtLink>
      </span>
    </div>
    <MainstructureLoader v-if="loading" />
  </div>
</template>
<script setup lang="ts">
import { Loader } from "@googlemaps/js-api-loader";
import { ref, onMounted } from "vue";

const props = defineProps({
  mtnID: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
});
const config = useRuntimeConfig();

const apiURLnearby = config.public.apiBase + "mountain/" + props.mtnID + "/nearby_mountains/"
const { data } = await useFetch(apiURLnearby)
const nearbyMountains = data.value.results

const loader = new Loader({
  apiKey: config.public.googleMapsApiKey,
  version: "weekly",
});
const loading = ref(true)
const mapDiv = ref(null);
onMounted(async () => {
  await loader.load();
  const map = new google.maps.Map(
    mapDiv.value,
    {
      center: { lat: parseFloat(props.latitude), lng: parseFloat(props.longitude) },
      zoom: 12,
      mapTypeId: "satellite",
      gestureHandling: 'cooperative',
      rotateControl: false,
      streetViewControl: false,
    },
  );

  const apiURL = config.public.apiBase + "map/";
  const { data } = await useFetch(apiURL)
  const image = {
    url: "/img/marker3.png",
  };
  const image_alt = {
    url: "/img/marker-alt-3.png",
  }
  for (const mtn of data.value) {
    const infowindow = new google.maps.InfoWindow({
      content: '<a href="/cerros/' + mtn.id + '" class="mtn-popup-link">' +
        '<p class="prefix">' + mtn.prefix + '</p>' +
        '<p class="name">' + mtn.name + '</p></a>' +
        '<p class="mtn-popup-altitude">' + mtn.altitude + ' mts</p>',
      ariaLabel: mtn.prefix + ' ' + mtn.name,
    });
    if (mtn.id === parseFloat(props.mtnID)) {
      const marker = new google.maps.Marker({
        position: { lat: parseFloat(mtn.latitude), lng: parseFloat(mtn.longitude) },
        map: map,
        title: mtn.title,
        icon: image_alt,
      });
      marker.addListener("click", () => {
        infowindow.open(map, marker);
      });
    } else {
      const marker = new google.maps.Marker({
        position: { lat: parseFloat(mtn.latitude), lng: parseFloat(mtn.longitude) },
        map: map,
        title: mtn.title,
        icon: image,
      });
      marker.addListener("click", () => {
        infowindow.open(map, marker);
      });
    }
  }
  loading.value = false
});
</script>
<style scoped lang="scss">
.mtn-map {
  height: 75vh;
  width: calc(100% - 48px);
  margin: 9px auto auto auto;
}
.mtn-popup-link {
  cursor: pointer;
  .prefix {
    margin: 0;
    font-size: 0.8rem;
    color: #666;
    transition: all 0.2s ease-in-out;
  }
  .name {
    font-size: 1.2rem;
    color: #333;
    margin: 0;
    font-weight: bold;
    transition: all 0.2s ease-in-out;
  }
  &:hover {
    p {
      color: $color-main-first;
    }
  }
}
.mtn-popup-altitude {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
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