<template>
  <div class="content-wrapper index-wrapper">
    <MainstructureTitleSection name="Ascensos" />
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadAscents()">
          <option
            v-for="option in page_size_options"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
        <span>por página</span>
      </div>
      <div class="search-table">
        <input
          type="text"
          v-model="search"
          v-on:input="reloadAscents(true)"
          placeholder="Buscar"
        />
      </div>
      <div class="page-number-banner">
        <span>Página</span>
        <select v-model="page_number" @change="reloadAscents()">
          <option v-for="option in page_list" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <IndexTable
      :columns="columns"
      :data="ascensos"
      :order_field="order_field"
      :order_direction="order_direction"
      :changeOrder="changeOrder"
      :reloadMethod="reloadAscents"
    />
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadAscents()">
          <option
            v-for="option in page_size_options"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
        <span>por página</span>
      </div>
      <div class="page-number-banner">
        <span>Página</span>
        <select v-model="page_number" @change="reloadAscents()">
          <option v-for="option in page_list" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const columns = [
  {
    class: "",
    field: "mountain_name",
    label: "Montaña",
    sortable: true,
    is_boolean: false,
    link: (ascenso) => "/cerros/" + ascenso.mountain,
  },
  {
    class: "",
    field: "route_name",
    label: "Ruta",
    sortable: true,
    is_boolean: false,
    link: (ascenso) => "/rutas/" + ascenso.route,
  },
  {
    class: "main-column",
    field: "name",
    label: "Descripción",
    sortable: true,
    is_boolean: false,
    link: (ascenso) => "/ascensos/" + ascenso.id,
  },
  {
    class: "small-column",
    field: "andinists",
    label: "Andinistas",
    sortable: false,
    is_boolean: false,
    formatter: (row) =>
      row.andinists
        .map(
          (andinist, index) =>
            `<a href='/andinistas/${andinist[0]}'>${index !== 0 ? ", " : ""}${
              andinist[1]
            }</a>`
        )
        .join(""),
    formatter_html: true,
  },
  {
    class: "small-column",
    field: "date",
    label: "Fecha",
    sortable: true,
    is_boolean: false,
  },
];

const config = useRuntimeConfig();

const page_size = ref(10);
const page_size_options = [10, 20, 50, 100];
const ascensos_count = ref(0);
const page_number = ref(1);
const page_list = ref([]);
const ascensos = ref([]);
const search = ref("");

const order_field = ref("");
const order_direction = ref("asc");

const apiURLascents =
  config.public.apiBase +
  "ascent/table?page_size=" +
  page_size.value +
  "&page=" +
  page_number.value;
const data = await $fetch(apiURLascents);
ascensos_count.value = data.count;
ascensos.value = data.results;
page_list.value = Array.from(
  Array(Math.ceil(ascensos_count.value / page_size.value)).keys()
).map((x) => x + 1);

async function reloadAscents(resetPage = false) {
  if (resetPage) {
    page_number.value = 1;
  }
  let apiURLascents =
    config.public.apiBase +
    "ascent/table?page_size=" +
    page_size.value +
    "&page=" +
    page_number.value +
    "&search=" +
    search.value;

  if (order_field.value && order_direction.value) {
    apiURLascents +=
      "&ordering=" +
      (order_direction.value === "desc" ? "-" : "") +
      order_field.value;
  }

  const ascents = await $fetch(apiURLascents);
  ascensos.value = ascents.results;
  ascensos_count.value = ascents.count;
  page_list.value = Array.from(
    Array(Math.ceil(ascensos_count.value / page_size.value)).keys()
  ).map((x) => x + 1);
}

function changeOrder(field: string) {
  if (order_field.value === field) {
    order_direction.value = order_direction.value === "asc" ? "desc" : "asc";
  } else {
    order_field.value = field;
    order_direction.value = "asc";
  }
  reloadAscents();
}
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
