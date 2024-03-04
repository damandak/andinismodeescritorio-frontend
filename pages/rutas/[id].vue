<template>
  <div class="content-wrapper route-wrapper">
    <MainstructureTitleSection
      :prefix="route_mountain_name"
      :name="route_name"
      :mts="false"
    />
    <div v-if="img_url" class="main-image-section">
      <img :src="img_url" alt="" />
    </div>
    <div class="body-section">
      <BodyTabWrapper
        :tabs="tabs"
        :selectedTab="selectedTab"
        @switchTab="switchTab"
      />
      <div class="body-content">
        <h2 class="content-title">{{ tabs[selectedTab].title }}</h2>
        <RoutesGeneralContent
          v-if="selectedTab === 0"
          :mountainID="route_mountain_id"
          :mountainName="route_mountain_name"
          :routeName="route_name"
          :summit="route_summit"
          :firstAscent="route_first_ascent"
          :firstAscentName="route_first_ascent_name"
          :firstAscentDate="route_first_ascent_date"
          :firstAscentTeam="route_first_ascent_team"
          :unregisteredNonSportAscent="route_unregistered_non_sport_ascent"
          :unregisteredSportAscent="route_unregistered_sport_ascent"
        />
        <RoutesAscentsContent
          v-if="selectedTab === 1"
          :mtnID="route_mountain_id"
          :routeID="route_id"
        />
        <RoutesDetailContent
          v-if="selectedTab === 2"
          :alpine_grade="route_alpine_grade"
          :aid_climbing_grade="route_aid_climbing_grade"
          :ice_climbing_grade="route_ice_climbing_grade"
          :rock_climbing_grade="route_rock_climbing_grade"
          :description="route_description"
          :kml="route_kml"
          :gpx="route_gpx"
          :notes="route_notes"
        />
        <RoutesOtherRoutesContent
          v-if="selectedTab === 3"
          :routeID="route_id"
          :mtnID="route_mountain_id"
        />
        <RoutesPhotosContent v-if="selectedTab === 4" />
        <RoutesReferencesContent v-if="selectedTab === 5" :routeID="route_id" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import GeneralContent from "~~/components/ascent/GeneralContent.vue";
const config = useRuntimeConfig();
const route = useRoute();
const tabs = [
  { id: 0, title: "General", iconname: "ico-general" },
  { id: 1, title: "Ascensos", iconname: "ico-ascent" },
  { id: 2, title: "Descargables", iconname: "ico-download" },
  { id: 3, title: "Otras Rutas", iconname: "ico-route" },
  { id: 4, title: "Fotos", iconname: "ico-photo" },
  { id: 5, title: "Referencias", iconname: "ico-sources" },
];
const apiURLRoute = config.public.apiBase + "route/" + route.params.id + "/";
const ruta = await $fetch(apiURLRoute);

const route_id = ref(ruta.id);
const route_name = ref(ruta.name);
const route_parent_route = ref(ruta.parent_route);
const route_parent_route_name = ref(ruta.parent_route_name);
const route_mountain_id = ref(ruta.mountain);
const route_mountain_name = ref(ruta.mountain_name);
const route_summit = ref(ruta.summit);
const route_ascended = ref(ruta.ascended);
const route_first_ascent = ref(ruta.first_ascent);
const route_first_ascent_name = ref(ruta.first_ascent_name);
const route_first_ascent_date = ref(ruta.first_ascent_date);
const route_first_ascent_team = ref(ruta.first_ascent_team);
const route_unregistered_non_sport_ascent = ref(
  ruta.unregistered_non_sport_ascent
);
const route_unregistered_sport_ascent = ref(ruta.unregistered_sport_ascent);
const route_alpine_grade = ref(ruta.alpine_grade);
const route_aid_climbing_grade = ref(ruta.aid_climbing_grade);
const route_ice_climbing_grade = ref(ruta.ice_climbing_grade);
const route_rock_climbing_grade = ref(ruta.rock_climbing_grade);
const route_description = ref(ruta.description);
const route_kml = ref(ruta.kml);
const route_gpx = ref(ruta.gpx);
const route_notes = ref(ruta.notes);

var selectedTab = ref(0);
function switchTab(tabNumber: number) {
  if (selectedTab.value === tabNumber) {
    return;
  }
  // erase selected class from all tabs
  var tabs = document.getElementsByClassName("tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("selected");
  }
  tabs[tabNumber].classList.add("selected");
  selectedTab.value = tabNumber;
}
</script>
<style scoped lang="scss">
.route-wrapper {
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
