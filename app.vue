<template>
  <NuxtLayout>
    <NuxtPage />
    <MainstructureSocialBanner />
  </NuxtLayout>
</template>
<script setup lang="ts">
const SITE_NAME = "Andinismo de Escritorio";

useHead({
  htmlAttrs: { lang: "es" },
  // "Cerro El Plomo · Andinismo de Escritorio"; the home page shows the name alone.
  titleTemplate: (title?: string) =>
    title && title !== SITE_NAME ? `${title} · ${SITE_NAME}` : SITE_NAME,
});

// Defaults; each page overrides title and description with usePageSeo().
useSeoMeta({
  description:
    "Registro de cerros, rutas, ascensos y andinistas de los Andes Centrales: primeros ascensos, fuentes históricas y relatos.",
  ogSiteName: SITE_NAME,
  ogLocale: "es_CL",
  ogType: "website",
});
</script>
<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
