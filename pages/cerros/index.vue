<template>
  <div class="content-wrapper index-wrapper">
    <MainstructureTitleSection name="Cerros" />
    <BodyDataTable
      name="cerros"
      title="Cerros"
      itemsLabel="cerros"
      endpoint="mountains/"
      :extraQuery="{ table: '' }"
      :columns="columns"
    />
  </div>
</template>
<script setup lang="ts">
usePageSeo({
  title: "Cerros",
  description:
    "Listado de cerros de los Andes Centrales con su altura y si tienen ascensos registrados.",
});

// Search, order and page live in the URL (?buscar=&orden=&pagina=), see
// components/body/DataTable.vue. `key` is the column's name in the URL.
const columns: TableColumn[] = [
  {
    class: "main-column",
    field: "name",
    key: "nombre",
    label: "Cumbre",
    sortable: true,
    link: (cerro) => "/cerros/" + cerro.id,
    formatter: (cerro) => cerro.prefix + " " + cerro.name,
  },
  {
    field: "altitude",
    key: "altura",
    label: "Altura",
    sortable: true,
    formatter: (cerro) => formatAltitude(cerro.altitude) || "—",
  },
  {
    field: "ascended",
    key: "ascendido",
    label: "Ascendido",
    sortable: true,
    is_boolean: true,
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
