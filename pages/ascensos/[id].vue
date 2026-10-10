<template>
  <div class="content-wrapper ascent-wrapper">
    <MainstructureTitleSection
      :prefix="ascent_mountain_name"
      :name="ascent_name"
      :subtitle="ascent_route_name"
      :mts="false"
    />
    <div v-if="img_url" class="main-image-section">
      <img :src="img_url" alt="" />
    </div>
    <div class="body-section">
      <BodyTabWrapper
        :tabs="tabs"
        :selectedTab="selectedTab"
        label="Secciones del ascenso"
        @switchTab="switchTab"
      />
      <div class="body-content" v-bind="panelAttrs">
        <h2 class="content-title">{{ tabs.find((t) => t.id === selectedTab)?.title }}</h2>
        <AscentGeneralContent
          v-if="selectedTab === 0"
          :mtnID="ascent_mountain_id"
          :mtnName="ascent_mountain_name"
          :routeID="ascent_route_id"
          :routeName="ascent_route_name"
          :ascentName="ascent_name"
          :andinists="ascent_andinists"
          :supporting_andinists="ascent_support_andinists"
          :date="ascent_date"
          :isFirstAscent="ascent_is_first_ascent"
          :newRoute="ascent_new_route"
        />
        <AscentPhotosContent v-if="selectedTab === 1" :ascentID="ascent_id" />
        <AscentReferencesContent
          v-if="selectedTab === 2"
          :ascentID="ascent_id"
        />
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
  // Hidden until there is content for it (downloads / photo gallery):
  // { id: 1, slug: "fotos", title: "Fotos", iconname: "ico-photo" },
  { id: 2, slug: "referencias", title: "Referencias", iconname: "ico-sources" },
];
const ascent = await useApiDetail<any>(
  `ascent-${route.params.id}`,
  `ascent/${route.params.id}/`
);

const ascent_id = ascent.id;
const ascent_name = ascent.name;
const ascent_route_id = ascent.route;
const ascent_route_name = ascent.route_name;
const ascent_mountain_id = ascent.mountain;
const ascent_mountain_name = ascent.mountain_name;
const ascent_andinists = ascent.andinists;
const ascent_support_andinists = ascent.support_andinists;
const ascent_completed = ascent.completed;
// The API sends the date already formatted for its precision (e.g. "1896-xx-xx").
const ascent_date = ascent.date_tostr;
const ascent_is_first_ascent = ascent.is_first_ascent;
const ascent_new_route = ascent.new_route;

// --- SEO ---
{
  const team = joinNames((ascent.andinists || []).map((a: any) => a[1]));
  const when = formatPartialDate(ascent.date_tostr);
  const honours = ascent.is_first_ascent
    ? "Primera ascensión"
    : ascent.new_route
      ? "Nueva ruta"
      : "Ascenso";
  usePageSeo({
    title: `${ascent.name} · ${ascent.mountain_name}`,
    description: `${honours} ${toMountain(ascent.mountain_name)} por ${routeWithArticle(ascent.route_name)}${
      when ? `, ${when}` : ""
    }${team ? `. Cordada: ${team}` : ""}.`,
    type: "article",
  });
}

// Open tab in the URL (?tab=rutas), so it can be shared.
const { selectedTab, switchTab, panelAttrs } = usePageTabs(tabs);
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
