<template>
  <div class="content-wrapper index-wrapper">
    <MainstructureTitleSection name="Rutas" />
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadRoutes()">
          <option v-for="option in page_size_options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <span>por página</span>
      </div>
      <div class="search-table">
        <input type="text" v-model="search" v-on:input="reloadRoutes()" placeholder="Buscar" />
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
    <table class="adetable">
      <thead>
        <tr>
          <th>Montaña</th>
          <th>Ruta</th>
          <th>Dificultad</th>
          <th>Primer Ascenso</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ruta in rutas" :key="ruta.id">
          <td>
            <NuxtLink :to="'/cerros/' + ruta.mountain">
              {{ ruta.mountain_name }}
            </NuxtLink>
          </td>
          <td class="main-column">
            <NuxtLink :to="'/rutas/' + ruta.id">
              {{ ruta.name }}
            </NuxtLink>
          </td>

          <td>
            {{ ruta.difficulty }}
          </td>
          <td>
            {{ ruta.first_ascent_info }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadRoutes()">
          <option v-for="option in page_size_options" :key="option" :value="option">
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
const config = useRuntimeConfig();

const page_size = ref(10);
const page_size_options = [10, 20, 50, 100];
const rutas_count = ref(0);
const page_number = ref(1);
const page_list = ref([]);
const rutas = ref([]);
const search = ref("");

const apiURLroutes = config.public.apiBase + "route/table?page_size=" + page_size.value + "&page=" + page_number.value
const { data } = await useFetch(apiURLroutes)
rutas_count.value = data.value.count
rutas.value = data.value.results
page_list.value = Array.from(Array(Math.ceil(rutas_count.value / page_size.value)).keys()).map((x) => x + 1);

async function reloadRoutes() {  
  const apiURLnewroutes = config.public.apiBase + "route/table?page_size=" + page_size.value + "&page=" + page_number.value + "&search=" + search.value
  const { data } = await useFetch(apiURLnewroutes)
  rutas.value = data.value.results
  page_list.value = Array.from(Array(Math.ceil(rutas_count.value / page_size.value)).keys()).map((x) => x + 1);
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
    width: 80% !important;
    max-width: 1000px;
    th {
      text-align: left;
    }
    td {
      text-align:left;
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