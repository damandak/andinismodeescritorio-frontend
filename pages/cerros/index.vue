<template>
  <div class="content-wrapper index-wrapper">
    <MainstructureTitleSection name="Cerros" />
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadMountains()">
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
          v-on:input="reloadMountains(true)"
          placeholder="Buscar"
        />
      </div>
      <div class="page-number-banner">
        <span>Página</span>
        <select v-model="page_number" @change="reloadMountains()">
          <option v-for="option in page_list" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <IndexTable
      :columns="columns"
      :data="cerros"
      :order_field="order_field"
      :order_direction="order_direction"
      :changeOrder="changeOrder"
    />
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadMountains()">
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
        <select v-model="page_number" @change="reloadMountains()">
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
    field: "name",
    label: "Cumbre",
    sortable: true,
    is_boolean: false,
    link: (cerro) => "/cerros/" + cerro.id,
    formatter: (cerro) => cerro.prefix + " " + cerro.name,
  },
  {
    field: "altitude",
    label: "Altura",
    sortable: true,
    is_boolean: false,
  },
  {
    field: "ascended",
    label: "Ascendido",
    sortable: true,
    is_boolean: true,
  },
];

const config = useRuntimeConfig();

const page_size = ref(10);
const page_size_options = [10, 20, 50, 100];
const cerros_count = ref(0);
const page_number = ref(1);
const page_list = ref([]);
const cerros = ref([]);
const search = ref("");

const order_field = ref("");
const order_direction = ref("asc");

const apiURLmountains =
  config.public.apiBase +
  "mountains/?table&page_size=" +
  page_size.value +
  "&page=" +
  page_number.value;
const { data } = await useFetch(apiURLmountains);
cerros_count.value = data.value.count;
cerros.value = data.value.results;
page_list.value = Array.from(
  Array(Math.ceil(cerros_count.value / page_size.value)).keys()
).map((x) => x + 1);

async function reloadMountains(resetPage = false) {
  if (resetPage) {
    page_number.value = 1;
  }
  let apiURLmountains =
    config.public.apiBase +
    "mountain/table?page_size=" +
    page_size.value +
    "&page=" +
    page_number.value +
    "&search=" +
    search.value;
  if (order_field.value && order_direction.value) {
    apiURLmountains +=
      "&ordering=" +
      (order_direction.value === "desc" ? "-" : "") +
      order_field.value;
  }
  const { data } = await useFetch(apiURLmountains);
  cerros.value = data.value.results;
  cerros_count.value = data.value.count;
  page_list.value = Array.from(
    Array(Math.ceil(cerros_count.value / page_size.value)).keys()
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
  reloadMountains();
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
