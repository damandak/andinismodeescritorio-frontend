<template>
  <div ref="mapDiv" class="main-map"></div>
</template>
<script setup lang="ts">
/* eslint-disable no-undef */
import { Loader } from "@googlemaps/js-api-loader";
import { ref, onMounted } from "vue";

const config = useRuntimeConfig();

const loader = new Loader({
  apiKey: config.public.googleMapsApiKey,
  version: "weekly",
  libraries: ["places"],
});

const mapDiv = ref(null);
onMounted(async () => {
  await loader.load();
  const map = new google.maps.Map(
    mapDiv.value,
    {
      center: { lat: -34, lng: -70.47 },
      zoom: 8,
      mapTypeId: "satellite",
      rotateControl: false,
      streetViewControl: false,
    },
  );

  const apiURL = config.public.apiBase + "map/";
  const { data } = await useFetch(apiURL)
  const image = {
    url: "/img/marker3.png",
  };
  for (const mtn of data.value) {
    const infowindow = new google.maps.InfoWindow({
      content: '<a href="/cerros/' + mtn.id + '" class="mtn-popup-link">' +
        '<p class="prefix">' + mtn.prefix + '</p>' +
        '<p class="name">' + mtn.name + '</p></a>' +
        '<p class="mtn-popup-altitude">' + mtn.altitude + ' mts</p>',
      ariaLabel: mtn.prefix + ' ' + mtn.name,
    });
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
});
</script>
<style lang="scss">
.main-map {
  height: calc(100vh - 88px);
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
</style>
