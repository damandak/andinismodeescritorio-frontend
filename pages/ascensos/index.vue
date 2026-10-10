<template>
  <div class="content-wrapper index-wrapper">
    <MainstructureTitleSection name="Ascensos" />
    <BodyDataTable
      name="ascensos"
      title="Ascensos"
      itemsLabel="ascensos"
      endpoint="ascent/table/"
      :columns="columns"
    />
  </div>
</template>
<script setup lang="ts">
usePageSeo({
  title: "Ascensos",
  description:
    "Registro histórico de ascensos en los Andes Centrales: cerro, ruta, cordada y fecha.",
});

// Search, order and page live in the URL (?buscar=&orden=&pagina=), see
// components/body/DataTable.vue. `key` is the column's name in the URL.
const columns: TableColumn[] = [
  {
    field: "mountain_name",
    key: "cerro",
    label: "Montaña",
    sortable: true,
    link: (ascenso) => "/cerros/" + ascenso.mountain,
  },
  {
    field: "route_name",
    key: "ruta",
    label: "Ruta",
    sortable: true,
    link: (ascenso) => "/rutas/" + ascenso.route,
  },
  {
    class: "main-column",
    field: "name",
    key: "descripcion",
    label: "Descripción",
    sortable: true,
    link: (ascenso) => "/ascensos/" + ascenso.id,
  },
  {
    class: "small-column",
    field: "andinists",
    label: "Andinistas",
    links: (row) =>
      row.andinists.map((andinist) => ({
        to: "/andinistas/" + andinist[0],
        text: andinist[1],
      })),
  },
  {
    class: "small-column",
    field: "date",
    key: "fecha",
    label: "Fecha",
    sortable: true,
    // Sorted by the real date, shown with its precision (e.g. "1896")
    formatter: (row) => formatPartialDateShort(row.resulting_date),
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
