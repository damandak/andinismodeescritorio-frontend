<template>
  <div class="content-wrapper index-wrapper">
    <MainstructureTitleSection name="Rutas" />
    <BodyDataTable
      name="rutas"
      title="Rutas"
      itemsLabel="rutas"
      endpoint="route/table/"
      :columns="columns"
    />
  </div>
</template>
<script setup lang="ts">
usePageSeo({
  title: "Rutas",
  description:
    "Rutas de ascenso a los cerros de los Andes Centrales, con su dificultad y año del primer ascenso.",
});

// Search, order and page live in the URL (?buscar=&orden=&pagina=), see
// components/body/DataTable.vue. `key` is the column's name in the URL.
const columns: TableColumn[] = [
  {
    field: "mountain_name",
    key: "cerro",
    label: "Montaña",
    sortable: true,
    link: (ruta) => "/cerros/" + ruta.mountain,
  },
  {
    class: "main-column",
    field: "name",
    key: "ruta",
    label: "Ruta",
    sortable: true,
    link: (ruta) => "/rutas/" + ruta.id,
  },
  {
    field: "difficulty",
    key: "dificultad",
    label: "Dificultad",
    sortable: true,
  },
  {
    field: "first_ascent_year",
    key: "primer-ascenso",
    label: "Primer Ascenso",
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
