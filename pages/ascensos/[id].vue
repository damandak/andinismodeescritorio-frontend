<template>
  <div class="content-wrapper ascent-wrapper">
    <MainstructureTitleSection :prefix="ascent_mountain_name" :name="ascent_name" :subtitle="ascent_route_name" :mts="false" />
    <div class="main-image-section">
      <img src="https://media.istockphoto.com/id/1288385045/photo/snowcapped-k2-peak.jpg?s=612x612&w=0&k=20&c=sfA4jU8kXKZZqQiy0pHlQ4CeDR0DxCxXhtuTDEW81oo=" alt="">
    </div>
    <div class="body-section">
      <BodyTabWrapper
        :tabs="tabs"
        :selectedTab="selectedTab"
        @switchTab="switchTab"
      />
      <div class="body-content">
        <h2 class="content-title">{{ tabs[selectedTab].title }}</h2>
        <AscentGeneralContent
          v-if="selectedTab === 0"
          :mtnID = "ascent_mountain_id"
          :mtnName = "ascent_mountain_name"
          :routeID = "ascent_route_id"
          :routeName = "ascent_route_name"
          :ascentName = "ascent_name"
          :andinists = "ascent_andinists"
          :supporting_andinists = "ascent_support_andinists"
          :date_tostr = "ascent_date_tostr"
        />
        <AscentPhotosContent
          v-if="selectedTab === 1"
          :ascentID = "ascent_id"
        />
        <AscentReferencesContent
          v-if="selectedTab === 2"
          :ascentID = "ascent_id"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
const config = useRuntimeConfig();
const route = useRoute()
const tabs = [
  { id: 0, title: "General", iconname: "ico-general" },
  { id: 1, title: "Fotos", iconname: "ico-photo" },
  { id: 2, title: "Referencias", iconname: "ico-sources" },
]
const apiURLAscent = config.public.apiBase + "ascent/" + route.params.id + "/" 
const { data } = await useFetch(apiURLAscent)
const ascent = data.value

const ascent_id = ascent.id
const ascent_name = ascent.name
const ascent_route_id = ascent.route
const ascent_route_name = ascent.route_name
const ascent_mountain_id = ascent.mountain
const ascent_mountain_name = ascent.mountain_name
const ascent_andinists = ascent.andinists
const ascent_support_andinists = ascent.support_andinists
const ascent_completed = ascent.completed
const ascent_date_tostr = ascent.date_tostr
const ascent_is_first_ascent = ascent.is_first_ascent
const ascent_new_route = ascent.new_route


var selectedTab = ref(0)
function switchTab(tabNumber: number) {
  if (selectedTab.value === tabNumber) {
    return
  }
  // erase selected class from all tabs
  var tabs = document.getElementsByClassName("tab")
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("selected")
  }
  tabs[tabNumber].classList.add("selected")
  selectedTab.value = tabNumber
}
</script>
<style scoped lang="scss">
.ascent-wrapper {
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
        font-family: 'Lato', sans-serif;
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