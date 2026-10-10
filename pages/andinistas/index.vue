<template>
  <div class="content-wrapper index-wrapper">
    <MainstructureTitleSection name="Andinistas" />
    <BodyDataTable
      name="andinistas"
      title="Andinistas"
      itemsLabel="andinistas"
      endpoint="andinist/table/"
      :columns="columns"
    />
  </div>
</template>
<script setup lang="ts">
usePageSeo({
  title: "Andinistas",
  description:
    "Andinistas con ascensos registrados en los Andes Centrales: nacionalidad, clubes, ascensos, primeras ascensiones y rutas nuevas.",
});

// Search, order and page live in the URL (?buscar=&orden=&pagina=), see
// components/body/DataTable.vue. `key` is the column's name in the URL.
const columns: TableColumn[] = [
  {
    class: "main-column",
    field: "fullname",
    key: "nombre",
    label: "Nombre",
    sortable: true,
    link: (andinista) => "/andinistas/" + andinista.id,
  },
  {
    class: "small-column",
    field: "nationalities_tostr",
    label: "Nacionalidad",
  },
  {
    class: "small-column",
    field: "clubs_tostr",
    label: "Clubes",
  },
  {
    field: "ascent_count",
    key: "ascensos",
    label: "Ascensos",
    sortable: true,
  },
  {
    field: "new_routes_count",
    key: "rutas-nuevas",
    label: "Nuevas Rutas",
    sortable: true,
  },
  {
    field: "first_ascent_count",
    key: "primeras",
    label: "Primeras Absolutas",
    sortable: true,
  },
];
</script>
<style scoped lang="scss">
.index-wrapper {
  display: flex;
  flex-direction: column !important;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding-bottom: 50px;
  .title-section {
    height: 50px;
  }
}
</style>
