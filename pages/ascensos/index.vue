<template>
  <div class="content-wrapper index-wrapper">
    <MainstructureTitleSection name="Ascensos" />
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadAscents()">
          <option v-for="option in page_size_options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <span>por página</span>
      </div>
      <div class="search-table">
        <input type="text" v-model="search" v-on:input="reloadAscents()" placeholder="Buscar" />
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
    <table class="adetable">
      <thead>
        <tr>
          <th>Montaña</th>
          <th>Ruta</th> <!-- CUANDO SON INCOMPLETAS, HACER ALGO -->
          <th>Descripción</th>
          <th>Andinistas</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ascenso in ascensos" :key="ascenso.id">
          <td>
            <NuxtLink :to="'/cerros/' + ascenso.mountain">
              {{ ascenso.mountain_name }}
            </NuxtLink>
          </td>
          <td>
            <NuxtLink :to="'/rutas/' + ascenso.route">
              {{ ascenso.route_name }}
            </NuxtLink>
            <span v-if="ascenso.completed === false">*</span>
          </td>
          <td class="main-column">
            <NuxtLink :to="'/ascensos/' + ascenso.id">
              {{ ascenso.name }}
            </NuxtLink>
          </td>
          <td class="small-column">
            <NuxtLink v-for="(andinist, index) in ascenso.andinists" :to="'/andinistas/' + andinist[0]">
              <span v-if="index !== 0">{{ ", " }}</span>
              {{ andinist[1] }}
            </NuxtLink>
          </td>
          <td class="small-column">
            {{ ascenso.date_tostr }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="page-filters">
      <div class="page-size-selector">
        <span>Mostrar</span>
        <select v-model="page_size" @change="reloadAscents()">
          <option v-for="option in page_size_options" :key="option" :value="option">
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
const config = useRuntimeConfig();

const page_size = ref(10);
const page_size_options = [10, 20, 50, 100];
const ascensos_count = ref(0);
const page_number = ref(1);
const page_list = ref([]);
const ascensos = ref([]);
const search = ref("");

const apiURLascents = config.public.apiBase + "ascent/table?page_size=" + page_size.value + "&page=" + page_number.value
const { data } = await useFetch(apiURLascents)
ascensos_count.value = data.value.count
ascensos.value = data.value.results
page_list.value = Array.from(Array(Math.ceil(ascensos_count.value / page_size.value)).keys()).map((x) => x + 1);

async function reloadAscents() {  
  const apiURLascents = config.public.apiBase + "ascent/table?page_size=" + page_size.value + "&page=" + page_number.value + "&search=" + search.value
  const { data } = await useFetch(apiURLascents)
  ascensos.value = data.value.results
  page_list.value = Array.from(Array(Math.ceil(ascensos_count.value / page_size.value)).keys()).map((x) => x + 1);
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