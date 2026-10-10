<template>
  <div class="content-wrapper mountain-wrapper">
    <MainstructureTitleSection
      :prefix="mtnPrefix"
      :name="mtnName"
      :subtitle="stringAltitude"
    />
    <figure v-if="img_url" class="main-image-section">
      <a :href="img_url" target="_blank" rel="noopener" title="Ver foto original">
        <img
          :src="coverSrc(image)"
          :srcset="coverSrcset(image)"
          :alt="imageAlt"
          :width="image?.width || undefined"
          :height="image?.height || undefined"
          fetchpriority="high"
        />
      </a>
      <figcaption v-if="image?.name || image?.author_name">
        <span v-if="image?.name">{{ image.name }}</span>
        <span v-if="image?.name && image?.author_name"> · </span>
        <span v-if="image?.author_name">
          Foto:
          <NuxtLink v-if="image.author" :to="`/andinistas/${image.author}`">{{
            image.author_name
          }}</NuxtLink>
          <template v-else>{{ image.author_name }}</template>
        </span>
      </figcaption>
    </figure>
    <div class="body-section">
      <BodyTabWrapper
        :tabs="tabs"
        :selectedTab="selectedTab"
        label="Secciones del cerro"
        @switchTab="switchTab"
      />
      <div class="body-content" v-bind="panelAttrs">
        <h2 class="content-title">{{ tabs.find((t) => t.id === selectedTab)?.title }}</h2>
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
          :mtnName="mtnFullName"
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

const tabs: PageTab[] = [
  { id: 0, slug: "general", title: "General", iconname: "ico-general" },
  { id: 1, slug: "ubicacion", title: "Ubicación", iconname: "ico-map" },
  { id: 2, slug: "rutas", title: "Rutas", iconname: "ico-route" },
  { id: 3, slug: "ascensos", title: "Ascensos", iconname: "ico-ascent" },
  // Hidden until there is content for it (downloads / photo gallery):
  // { id: 4, slug: "fotos", title: "Fotos", iconname: "ico-photo" },
  { id: 5, slug: "referencias", title: "Referencias", iconname: "ico-sources" },
];

const mtn = await useApiDetail<any>(
  `mountain-${route.params.id}`,
  `mountain/${route.params.id}/`
);

const mtnID = ref(route.params.id);
const mtnName = ref(mtn.name);
const mtnPrefix = ref(mtn.prefix);
const mtnFullName = ref(mtnPrefix.value + " " + mtnName.value);
const mtnAltitude = ref(mtn.altitude);
// Some mountains have no altitude yet; an empty subtitle hides the line.
const stringAltitude = ref(formatAltitude(mtn.altitude));
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
const image = ref<any>(null);
const author = ref(null);

if (main_image.value != null) {
  // A missing or broken image must not take the whole page down.
  const { data: dataImage } = await useAsyncData(
    `image-${main_image.value}`,
    () => $fetch(config.public.apiBase + "image/" + main_image.value + "/")
  );
  if (dataImage.value) {
    image.value = dataImage.value;
    img_url.value = dataImage.value.image;
    author.value = dataImage.value.author_name;
  }
}

const imageAlt = computed(() =>
  image.value?.name ? `${mtnFullName.value}: ${image.value.name}` : mtnFullName.value
);

// --- SEO: title, description, social preview, structured data ---
const altitudeText = formatAltitude(mtn.altitude);
const firstTeam = joinNames(firstAbsoluteTeam.value.map((a: any) => a[1]));
let firstAscentText = "Sin primer ascenso registrado.";
if (firstAbsolute.value) {
  firstAscentText = `Primer ascenso: ${formatPartialDate(mtn.first_absolute_date)}${
    firstTeam ? ` por ${firstTeam}` : ""
  }.`;
} else if (mtn.unregistered_non_sport_ascent) {
  firstAscentText = "Ascendido antes de los registros deportivos.";
}
usePageSeo({
  title: altitudeText ? `${mtnFullName.value} (${altitudeText})` : mtnFullName.value,
  description: `${mtnFullName.value}${altitudeText ? `, ${altitudeText}` : ""}. ${firstAscentText} Rutas, ascensos y fuentes históricas.`,
  image: (image.value as any)?.tb_item_cover || img_url.value,
});
useHead({
  script: [
    {
      type: "application/ld+json",
      // "<" escaped so a name can never close the <script> tag.
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Mountain",
        name: mtnFullName.value,
        url: String(config.public.siteUrl).replace(/\/$/, "") + route.path,
        ...(img_url.value ? { image: img_url.value } : {}),
        ...(mtn.latitude && mtn.longitude
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: Number(mtn.latitude),
                longitude: Number(mtn.longitude),
                ...(mtn.altitude ? { elevation: `${mtn.altitude} m` } : {}),
              },
            }
          : {}),
      }).replace(/</g, "\\u003c"),
    },
  ],
});

// Open tab in the URL (?tab=rutas), so it can be shared.
const { selectedTab, switchTab, panelAttrs } = usePageTabs(tabs);
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
    margin: 0;
    border-top: 2px solid $color-light-dark;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: $color-light;
    padding: 10px 0;
    a {
      display: block;
      width: 100%;
    }
    img {
      display: block;
      height: 400px;
      object-fit: contain;
      width: 100%;
    }
    figcaption {
      font-size: 0.8rem;
      color: $color-dark;
      opacity: 0.8;
      margin-top: 6px;
      padding: 0 16px;
      text-align: center;
      a {
        display: inline;
        color: inherit;
        &:hover {
          color: $color-main-second;
        }
      }
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
