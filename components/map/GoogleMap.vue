<template>
  <div class="main-map">
    <div ref="mapDiv" class="main-map"></div>
    <MainstructureLoader v-if="loading" />
  </div>
</template>
<script setup lang="ts">
/* eslint-disable no-undef */
import { Loader } from "@googlemaps/js-api-loader";
import { ref, onMounted, toRaw } from "vue";

const config = useRuntimeConfig();

const props = defineProps<{
  currentParams: String;
}>();

const loader = getGoogleMapsLoader(config.public.googleMapsApiKey);

const mapDiv = ref(null);

var mountains: {
  id: number;
  prefix: string;
  name: string;
  altitude: string;
  regions: string;
  countries: string;
  mountaingroups: string;
  ascended: boolean;
  marker: google.maps.Marker;
  visible: boolean;
  infowindow: google.maps.InfoWindow;
}[] = [];

const mainmap = ref(null);
const image = {
  url: "/img/marker3.png",
};

const loading = ref(true);

onMounted(async () => {
  await loader.load();
  mainmap.value = new google.maps.Map(mapDiv.value, {
    center: { lat: -34, lng: -70.47 },
    zoom: 8,
    mapTypeId: "satellite",
    rotateControl: false,
    streetViewControl: false,
  });

  const apiURL =
    config.public.apiBase + "mountains/?no_pagination" + props.currentParams;
  const data = await $fetch(apiURL);

  for (const mtn of data) {
    const infowindow = new google.maps.InfoWindow({
      content:
        '<a href="/cerros/' +
        mtn.id +
        '" class="mtn-popup-link">' +
        '<p class="prefix">' +
        mtn.prefix +
        "</p>" +
        '<p class="name">' +
        mtn.name +
        "</p></a>" +
        '<p class="mtn-popup-altitude">' +
        mtn.altitude +
        " mts</p>",
      ariaLabel: mtn.prefix + " " + mtn.name,
    });
    const marker = new google.maps.Marker({
      position: {
        lat: parseFloat(mtn.latitude),
        lng: parseFloat(mtn.longitude),
      },
      map: mainmap.value,
      title: mtn.title,
      icon: image,
    });
    marker.addListener("click", () => {
      infowindow.open(mainmap.value, marker);
    });
    const mountain = {
      id: mtn.id,
      prefix: mtn.prefix,
      name: mtn.name,
      altitude: mtn.altitude,
      regions: mtn.regions,
      countries: mtn.countries,
      mountaingroups: mtn.mountaingroups,
      ascended: mtn.ascended,
      marker: marker,
      visible: true,
      infowindow: infowindow,
    };
    mountains.push(mountain);
  }
  mainmap.value.addListener("zoom_changed", onZoomChanged);
  loading.value = false;
  console.log(loading);
});

function hideMarker(mountain: object) {
  if (mountain.marker.getMap() !== null) {
    mountain.visible = false;
    mountain.marker.setMap(null);
  }
}
function unhideMarker(mountain: object) {
  if (mountain.marker.getMap() === null) {
    mountain.visible = true;
    toRaw(mountain.marker).setMap(mainmap.value);
  }
}

function onZoomChanged() {
  for (const mtn of mountains) {
    if (mtn.visible) {
      unhideMarker(mtn);
    } else {
      hideMarker(mtn);
    }
  }
}

function filterMarkers(content: object) {
  for (const mtn of mountains) {
    var hide_prefix = true;
    var hide_region = false;
    var hide_country = true;
    var hide_mountaingroup = false;
    var hide_min_altitude = true;
    var hide_max_altitude = true;
    var hide_ascended = true;
    if (content.value.prefixes.length > 0) {
      for (const prefix of content.value.prefixes) {
        if (mtn.prefix === prefix.name) {
          hide_prefix = false;
        }
      }
    } else {
      hide_prefix = false;
    }
    if (content.value.countries.length > 0) {
      if (mtn.countries.length > 0) {
        for (const country of content.value.countries) {
          for (let i = 0; i < mtn.countries.length; i++) {
            if (mtn.countries[i] === country.name) {
              hide_country = false;
            }
          }
        }
      } else {
        hide_country = true;
      }
    } else {
      hide_country = false;
    }
    if (content.value.regions.length > 0) {
      if (mtn.regions.length > 0) {
        for (const region of content.value.regions) {
          for (let i = 0; i < mtn.regions.length; i++) {
            if (mtn.regions[i] === region.name) {
              hide_region = false;
            }
          }
        }
      } else {
        hide_region = true;
      }
    } else {
      hide_region = false;
    }
    if (content.value.min_altitude !== "") {
      if (mtn.altitude >= content.value.min_altitude) {
        hide_min_altitude = false;
      }
    } else {
      hide_min_altitude = false;
    }

    if (content.value.max_altitude !== "") {
      if (mtn.altitude <= content.value.max_altitude) {
        hide_max_altitude = false;
      }
    } else {
      hide_max_altitude = false;
    }
    if (content.value.ascended.length < 2) {
      if (mtn.ascended === content.value.ascended[0]) {
        hide_ascended = false;
      }
    } else {
      hide_ascended = false;
    }

    if (
      hide_prefix ||
      hide_min_altitude ||
      hide_max_altitude ||
      hide_region ||
      hide_country ||
      hide_mountaingroup ||
      hide_ascended
    ) {
      hideMarker(mtn);
    } else {
      unhideMarker(mtn);
    }
  }
}

defineExpose({
  filterMarkers,
});
</script>
<style lang="scss">
.main-map {
  height: calc(100vh - 108px);
  width: calc(100% - 48px);
  margin: 9px auto auto auto;
  border-radius: 10px 10px 0 0;
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
