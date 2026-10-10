<template>
  <div class="content-wrapper andinist-wrapper">
    <MainstructureTitleSection :name="name + ' ' + surname" :mts="false" />
    <div class="main-image-section" v-if="img_url">
      <img :src="img_url" alt="" />
    </div>
    <div class="body-section">
      <BodyTabWrapper
        :tabs="tabs"
        :selectedTab="selectedTab"
        label="Secciones del andinista"
        @switchTab="switchTab"
      />
      <div class="body-content" v-bind="panelAttrs">
        <h2 class="content-title">{{ tabs.find((t) => t.id === selectedTab)?.title }}</h2>
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
        <AndinistAscentsContent v-if="selectedTab === 1" :id="id" />
        <AndinistPhotosContent v-if="selectedTab === 2" />
        <AndinistReferencesContent v-if="selectedTab === 3" :andinist="id" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
const config = useRuntimeConfig();
const route = useRoute();
const tabs: PageTab[] = [
  { id: 0, slug: "general", title: "General", iconname: "ico-general" },
  { id: 1, slug: "ascensos", title: "Ascensos", iconname: "ico-ascent" },
  // Hidden until there is content for it (downloads / photo gallery):
  // { id: 2, slug: "fotos", title: "Fotos", iconname: "ico-photo" },
  { id: 3, slug: "referencias", title: "Referencias", iconname: "ico-sources" },
];
const andinist = await useApiDetail<any>(
  `andinist-${route.params.id}`,
  `andinist/${route.params.id}/`
);

const id = route.params.id;
const name = andinist.name;
const surname = andinist.surname;
const gender = andinist.gender;
const nationalities = andinist.nationalities_tostr;
const clubs = andinist.clubs_tostr;
const ascent_count = andinist.ascent_count;
const first_ascent_count = andinist.first_ascent_count;
const new_routes_count = andinist.new_routes_count;
const img_url = andinist.img_url;

// --- SEO ---
{
  const fullName = [name, surname].filter(Boolean).join(" ") || "Andinista";
  const parts = [`${ascent_count} ${ascent_count === 1 ? "ascenso registrado" : "ascensos registrados"}`];
  if (first_ascent_count) parts.push(`${first_ascent_count} ${first_ascent_count === 1 ? "primera ascensión" : "primeras ascensiones"}`);
  if (new_routes_count) parts.push(`${new_routes_count} ${new_routes_count === 1 ? "ruta nueva" : "rutas nuevas"}`);
  usePageSeo({
    title: fullName,
    description: `${fullName}${nationalities ? ` (${nationalities})` : ""}: ${joinNames(parts, 3)} en los Andes.${
      clubs ? ` Clubes: ${clubs}.` : ""
    }`,
    type: "profile",
  });
}

// Open tab in the URL (?tab=rutas), so it can be shared.
const { selectedTab, switchTab, panelAttrs } = usePageTabs(tabs);
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
        font-family: var(--font-sans);
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
