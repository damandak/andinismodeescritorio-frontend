<template>
   <div class="content-wrapper andinist-wrapper">
    <MainstructureTitleSection :name="name + ' ' + surname" :mts="false" />
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
        <AndinistGeneralContent
          v-if="selectedTab === 0"
          :name="name"
          :surname="surname"
          :gender="gender"
          :nationalities="nationalities"
          :clubs="clubs"
          :ascent_count="ascent_count"
          :first_ascent_count="first_ascent_count"
          :new_routes_count="new_routes_count"
        />
        <AndinistAscentsContent
          v-if="selectedTab === 1"
          :id="id"
        />
        <AndinistPhotosContent
          v-if="selectedTab === 2"
        />
        <AndinistReferencesContent
          v-if="selectedTab === 3"
          :andinist="id"
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
  { id: 0, title: "General" },
  { id: 1, title: "Ascensos" },
  { id: 2, title: "Fotos" },
  { id: 3, title: "Referencias" },
]
const apiURLAndinist = config.public.apiBase + "andinist/" + route.params.id + "/" 
const { data } = await useFetch(apiURLAndinist)
const andinist = data.value

const id = route.params.id
const name = andinist.name
const surname = andinist.surname
const gender = andinist.gender
const nationalities = andinist.nationalities_tostr
const clubs = andinist.clubs_tostr
const ascent_count = andinist.ascent_count
const first_ascent_count = andinist.first_ascent_count
const new_routes_count = andinist.new_routes_count

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
.andinist-wrapper {
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