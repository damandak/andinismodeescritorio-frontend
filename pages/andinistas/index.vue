<template>
  <div class="content-wrapper index-wrapper">
    <MainstructureTitleSection name="Andinistas" />
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadAndinists()">
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
          v-on:input="reloadAndinists(true)"
          placeholder="Buscar"
        />
      </div>
      <div class="page-number-banner">
        <span>Página</span>
        <select v-model="page_number" @change="reloadAndinists()">
          <option v-for="option in page_list" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <IndexTable
      :columns="columns"
      :data="andinistas"
      :order_field="order_field"
      :order_direction="order_direction"
      :changeOrder="changeOrder"
    />
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadAndinists()">
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
        <select v-model="page_number" @change="reloadAndinists()">
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
    class: "main-column",
    field: "fullname",
    label: "Nombre",
    sortable: true,
    is_boolean: false,
    link: (andinista) => "/andinistas/" + andinista.id,
  },
  {
    class: "small-column",
    field: "nationalities_tostr",
    label: "Nacionalidad",
    sortable: false,
    is_boolean: false,
  },
  {
    class: "small-column",
    field: "clubs_tostr",
    label: "Clubes",
    sortable: false,
    is_boolean: false,
  },
  {
    field: "ascent_count",
    label: "Ascensos",
    sortable: true,
    is_boolean: false,
  },
  {
    field: "new_routes_count",
    label: "Nuevas Rutas",
    sortable: true,
    is_boolean: false,
  },
  {
    field: "first_ascent_count",
    label: "Primeras Absolutas",
    sortable: true,
    is_boolean: false,
  },
];

const config = useRuntimeConfig();

const page_size = ref(10);
const page_size_options = [10, 20, 50, 100];
const andinistas_count = ref(0);
const page_number = ref(1);
const page_list = ref([]);
const andinistas = ref([]);
const search = ref("");

const order_field = ref("");
const order_direction = ref("asc");

const apiURLandinists =
  config.public.apiBase +
  "andinist/table?page_size=" +
  page_size.value +
  "&page=" +
  page_number.value;
const { data } = await useFetch(apiURLandinists);
andinistas_count.value = data.value.count;
andinistas.value = data.value.results;
page_list.value = Array.from(
  Array(Math.ceil(andinistas_count.value / page_size.value)).keys()
).map((x) => x + 1);

async function reloadAndinists(resetPage = false) {
  if (resetPage) {
    page_number.value = 1;
  }
  let apiURLandinists =
    config.public.apiBase +
    "andinist/table?page_size=" +
    page_size.value +
    "&page=" +
    page_number.value +
    "&search=" +
    search.value;

  if (order_field.value && order_direction.value) {
    apiURLandinists +=
      "&ordering=" +
      (order_direction.value === "desc" ? "-" : "") +
      order_field.value;
  }

  const { data } = await useFetch(apiURLandinists);
  andinistas.value = data.value.results;
  andinistas_count.value = data.value.count;
  page_list.value = Array.from(
    Array(Math.ceil(andinistas_count.value / page_size.value)).keys()
  ).map((x) => x + 1);
}

function changeOrder(field: string) {
  console.log(
    "change order field: " +
      field +
      " " +
      order_field.value +
      " " +
      order_direction.value +
      ""
  );
  if (order_field.value === field) {
    console.log("order_field is field");
    order_direction.value = order_direction.value === "asc" ? "desc" : "asc";
    console.log("new order_direction: " + order_direction.value);
  } else {
    console.log("order_field is not field");
    order_field.value = field;
    console.log("new order_field: " + order_field.value);
    order_direction.value = "asc";
    console.log("new order_direction: " + order_direction.value);
  }
  reloadAndinists();
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
      width: 20%;
      a {
        &:hover {
          color: $color-main-second;
        }
      }
    }
    td.main-column {
      font-weight: 900;
    }
    td.small-column {
      font-size: 0.9rem;
    }
  }
}
</style>
