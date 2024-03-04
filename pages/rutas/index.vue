<template>
  <div class="content-wrapper index-wrapper">
    <MainstructureTitleSection name="Rutas" />
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadRoutes()">
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
          v-on:input="reloadRoutes(true)"
          placeholder="Buscar"
        />
      </div>
      <div class="page-number-banner">
        <span>Página</span>
        <select v-model="page_number" @change="reloadRoutes()">
          <option v-for="option in page_list" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <IndexTable
      :columns="columns"
      :data="rutas"
      :order_field="order_field"
      :order_direction="order_direction"
      :changeOrder="changeOrder"
    />
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadRoutes()">
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
        <select v-model="page_number" @change="reloadRoutes()">
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
    class: "main-column",
    field: "name",
    label: "Ruta",
    sortable: true,
    is_boolean: false,
    link: (ascenso) => "/rutas/" + ascenso.id,
  },
  {
    class: "",
    field: "difficulty",
    label: "Dificultad",
    sortable: true,
    is_boolean: false,
  },
  {
    class: "",
    field: "first_ascent_year",
    label: "Primer Ascenso",
    sortable: true,
    is_boolean: false,
  },
];
const config = useRuntimeConfig();

const page_size = ref(10);
const page_size_options = [10, 20, 50, 100];
const rutas_count = ref(0);
const page_number = ref(1);
const page_list = ref([]);
const rutas = ref([]);
const search = ref("");

const order_field = ref("");
const order_direction = ref("asc");

const apiURLroutes =
  config.public.apiBase +
  "route/table?page_size=" +
  page_size.value +
  "&page=" +
  page_number.value;
const data = await $fetch(apiURLroutes);
rutas_count.value = data.count;
rutas.value = data.results;
page_list.value = Array.from(
  Array(Math.ceil(rutas_count.value / page_size.value)).keys()
).map((x) => x + 1);

async function reloadRoutes(resetPage = false) {
  if (resetPage) {
    page_number.value = 1;
  }
  let apiURLnewroutes =
    config.public.apiBase +
    "route/table?page_size=" +
    page_size.value +
    "&page=" +
    page_number.value +
    "&search=" +
    search.value;

  if (order_field.value && order_direction.value) {
    apiURLnewroutes +=
      "&ordering=" +
      (order_direction.value === "desc" ? "-" : "") +
      order_field.value;
  }

  const newroutes = await $fetch(apiURLnewroutes);
  rutas.value = newroutes.results;
  rutas_count.value = newroutes.count;
  page_list.value = Array.from(
    Array(Math.ceil(rutas_count.value / page_size.value)).keys()
  ).map((x) => x + 1);
}

function changeOrder(field: string) {
  if (order_field.value === field) {
    order_direction.value = order_direction.value === "asc" ? "desc" : "asc";
  } else {
    order_field.value = field;
    order_direction.value = "asc";
  }
  reloadRoutes();
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
  .adetable {
    margin: 20px auto;
    width: 90% !important;
    max-width: 1000px;
    display: block;
    overflow-x: auto;
    th {
      text-align: left;
    }
    td {
      text-align: left;
      width: 25%;
      a {
        &:hover {
          color: $color-main-second;
        }
      }
    }
    td.main-column {
      font-weight: 900;
    }
  }
}
</style>
