<template>
  <div class="content-wrapper index-wrapper">
    <MainstructureTitleSection name="Andinistas" />
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadAndinists()">
          <option v-for="option in page_size_options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <span>por página</span>
      </div>
      <div class="search-table">
        <input type="text" v-model="search" v-on:input="reloadAndinists(true)" placeholder="Buscar" />
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
    <table class="adetable">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Nacionalidad</th> <!-- CUANDO SON INCOMPLETAS, HACER ALGO -->
          <th>Clubes</th>
          <th>Ascensos</th>
          <th>Nuevas Rutas</th>
          <th>Primeras Absolutas</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="andinista in andinistas" :key="andinista.id">
          <td class="main-column">
            <NuxtLink :to="'/andinistas/' + andinista.id">
              {{ andinista.fullname }}
            </NuxtLink>
          </td>
          <td>
            {{ andinista.nationalities_tostr }}
          </td>
          <td>
            {{ andinista.clubs_tostr }}
          </td>
          <td>
            {{ andinista.ascent_count }}
          </td>
          <td>
            {{ andinista.new_routes_count }}
          </td>
          <td>
            {{ andinista.first_ascent_count }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadAndinists()">
          <option v-for="option in page_size_options" :key="option" :value="option">
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
const config = useRuntimeConfig();

const page_size = ref(10);
const page_size_options = [10, 20, 50, 100];
const andinistas_count = ref(0);
const page_number = ref(1);
const page_list = ref([]);
const andinistas = ref([]);
const search = ref("");

const apiURLandinists = config.public.apiBase + "andinist/table?page_size=" + page_size.value + "&page=" + page_number.value
const { data } = await useFetch(apiURLandinists)
andinistas_count.value = data.value.count
andinistas.value = data.value.results
page_list.value = Array.from(Array(Math.ceil(andinistas_count.value / page_size.value)).keys()).map((x) => x + 1);

async function reloadAndinists(resetPage = false) {
  if (resetPage) {
    page_number.value = 1;
  }  
  const apiURLandinists = config.public.apiBase + "andinist/table?page_size=" + page_size.value + "&page=" + page_number.value + "&search=" + search.value
  const { data } = await useFetch(apiURLandinists)
  andinistas.value = data.value.results
  andinistas_count.value = data.value.count
  page_list.value = Array.from(Array(Math.ceil(andinistas_count.value / page_size.value)).keys()).map((x) => x + 1);
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
      text-align:left;
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