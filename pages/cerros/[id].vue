<template>
  <div class="content-wrapper mountain-wrapper">
    <MainstructureTitleSection
      :prefix="mtnPrefix"
      :name="mtnName"
      :subtitle="stringAltitude"
      :mts="true"
    />
    <div v-if="img_url" class="main-image-section">
      <img :src="img_url" alt="" />
    </div>
    <div class="body-section">
      <BodyTabWrapper
        :tabs="tabs"
        @switchTab="switchTab"
        :selected-tab="selectedTab"
      />
      <div class="body-content">
        <h2 class="content-title">{{ tabs[selectedTab].title }}</h2>
        <MountainGeneralContent
          v-if="selectedTab === 0"
          :mtnID="mtnID"
          :mtnPrefix="mtnPrefix"
          :mtnName="mtnName"
          :mtnAltitude="mtnAltitude"
          :mtnLatitude="mtnLatitude"
          :mtnLongitude="mtnLongitude"
          :firstAbsolute="firstAbsolute"
          :firstAbsoluteName="firstAbsoluteName"
          :firstAbsoluteDate="firstAbsoluteDate"
          :firstAbsoluteTeam="firstAbsoluteTeam"
          :unregisteredNonSportAscent="unregisteredNonSportAscent"
        />
        <MountainLocationContent
          v-if="selectedTab === 1"
          :mtnID="mtnID"
          :latitude="mtnLatitude"
          :longitude="mtnLongitude"
        />
        <MountainRoutesContent
          v-if="selectedTab === 2"
          :mtnID="mtnID"
          :mtnFullName="mtnFullName"
        />
        <MountainAscentsContent v-if="selectedTab === 3" :mtnID="mtnID" />
        <MountainPhotosContent v-if="selectedTab === 4" :mtnID="mtnID" />
        <MountainReferencesContent
          v-if="selectedTab === 5"
          :mtnID="mtnID"
          :mtnAHB="mtnRefAhb"
          :mtnWikiExplora="mtnRefWikiexplora"
          :mtnNomenclatura="mtnNomenclaturaMountainID"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
const config = useRuntimeConfig();
const route = useRoute();

const tabs = [
  { id: 0, title: "General", iconname: "ico-general" },
  { id: 1, title: "Ubicación", iconname: "ico-map" },
  { id: 2, title: "Rutas", iconname: "ico-route" },
  { id: 3, title: "Ascensos", iconname: "ico-ascent" },
  { id: 4, title: "Fotos", iconname: "ico-photo" },
  { id: 5, title: "Referencias", iconname: "ico-sources" },
];

const apiURLMountain =
  config.public.apiBase + "mountain/" + route.params.id + "/";
const mtn = await $fetch(apiURLMountain);

const mtnID = ref(route.params.id);
const mtnName = ref(mtn.name);
const mtnPrefix = ref(mtn.prefix);
const mtnFullName = ref(mtnPrefix.value + " " + mtnName.value);
const mtnAltitude = ref(mtn.altitude);
const stringAltitude = ref(mtn.altitude.toString());
const mtnAltitudeIgm = ref(mtn.altitude_igm);
const mtnAltitudeArg = ref(mtn.altitude_arg);
const mtnAltitudeGps = ref(mtn.altitude_gps);
const mtnMainAltitudeSource = ref(mtn.main_altitude_source);
const mtnLatitude = ref(mtn.latitude);
const mtnLongitude = ref(mtn.longitude);
const mtnParentMountainID = ref(mtn.parent_mountain);
const mtnNomenclaturaMountainID = ref(mtn.nomenclatura_mountain);
const mtnRefAhb = ref(mtn.ref_ahb);
const mtnRefWikiexplora = ref(mtn.ref_wikiexplora);
const mtnCountriesIDs = ref(mtn.countries);
const mtnRegionsIDs = ref(mtn.regions);
const mtnMountainGroupIDs = ref(mtn.mountain_group);
const firstAbsolute = ref(mtn.first_absolute);
const firstAbsoluteName = ref(mtn.first_absolute_name);
const firstAbsoluteDate = ref(mtn.first_absolute_date);
const firstAbsoluteTeam = ref(
  Array.isArray(mtn.first_absolute_team) ? mtn.first_absolute_team : []
);
const unregisteredNonSportAscent = ref(mtn.unregistered_non_sport_ascent);

const main_image = ref(mtn.main_image);
const img_url = ref(null);
const image = ref(null);
const author = ref(null);

if (main_image.value != null) {
  const apiURLImage = config.public.apiBase + "image/" + main_image.value + "/";
  const dataImage = await $fetch(apiURLImage);
  image.value = dataImage;
  img_url.value = image.value.image;
  author.value = image.author;
}

var selectedTab = ref(0);

function switchTab(tabNumber: number) {
  selectedTab.value = tabNumber;
}
</script>
<style scoped lang="scss">
.mountain-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  .main-image-section {
    width: 100%;
    height: 400px;
    border-top: 2px solid $color-light-dark;
    //border-bottom: 1px solid $color-dark-soft;
    display: flex;
    justify-content: space-around;
    background-color: $color-light;
    padding: 10px 0;
    img {
      height: 400px;
      object-fit: contain;
      width: 100%;
    }
    .no-image {
      height: 200px;
      width: 100%;
      text-align: center;
      font-size: 20px;
      opacity: 0.4;
      padding: 80px 0;
      box-sizing: border-box;
    }
  }
  .body-section {
    width: 100%;
    .body-content {
      margin-bottom: 35px;
      padding-bottom: 20px;
      min-height: 500px;
      h2.content-title {
        font-size: 1.5rem;
        font-family: "Lato", sans-serif;
        font-weight: 600;
        margin: 15px auto;
        padding: 0 0 0 10px;
        width: 80%;
        text-align: center;
      }
    }
  }
}
</style>
