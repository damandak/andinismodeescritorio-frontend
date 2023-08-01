<template>
  <table class="adetable adetable-ascents">
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Montaña</th>
        <th>Ruta</th>
        <th>Descripción</th>
        <th>Andinistas</th>
        <th>Honores</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="ascent in ascents" key="ascent.id">
        <td class="date">{{ ascent.date }}</td>
        <td>
          <NuxtLink :to="`/cerros/${ascent.mountain}`">
            {{ ascent.mountain_name }}
          </NuxtLink>
        </td>
        <td class="route">
          <NuxtLink :to="`/rutas/${ascent.route}`">
            {{ ascent.route_name }}
          </NuxtLink>
        </td>
        <td>
          <NuxtLink :to="`/ascensos/${ascent.id}`">{{ ascent.name }}</NuxtLink>
        </td>
        <td>
          <span
            v-for="(andinist, index) in ascent.andinist_list"
            key="andinist.id"
          >
            <NuxtLink :to="`/andinistas/${andinist.id}`">
              <span v-if="index !== 0">{{ ", " }}</span>
              {{ andinist.fullname }}
            </NuxtLink>
          </span>
        </td>
        <td>Primera ascensión</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
const props = defineProps<{
  id: String;
}>();

const config = useRuntimeConfig();

const apiURLascents =
  config.public.apiBase + "andinist/" + props.id + "/ascents/";
const { data } = await useFetch(apiURLascents);
const ascents = data.value.results;

for (const ascent of ascents) {
  ascent.andinist_list = [];
  ascent.resulting_date = "";
  ascent.route_name = "";
  for (const individual_andinist of ascent.andinists) {
    const apiURLandinist =
      config.public.apiBase + "andinist/" + individual_andinist[0] + "/basic/";
    const { data } = await useFetch(apiURLandinist);
    const andinist = data.value;
    ascent.andinist_list = [...ascent.andinist_list, andinist];
  }
  const apiURLroute =
    config.public.apiBase + "route/" + ascent.route + "/name/";
  const { data } = await useFetch(apiURLroute);
  const route = data.value;
  ascent.route_name = route.name;
}
</script>
<style lang="scss" scoped>
.adetable-ascents {
  margin-top: 15px !important;
  width: 80% !important;
  max-width: 1200px !important;
  td {
    text-align: left !important;
    a {
      color: $color-dark !important;
      text-decoration: none !important;
      font-weight: 900;
      &:hover {
        color: $color-main-second !important;
      }
    }
    span {
      a {
        font-weight: 400;
        font-size: 0.8rem;
        line-height: 10px;
      }
    }
  }
  td.date {
    width: 90px;
    font-size: 0.9rem;
  }
  td.route {
    a {
      font-weight: 400;
      font-size: 0.9rem;
      line-height: 10px;
    }
  }
}
@media screen and (max-width: 768px) {
  .adetable-ascents {
    width: 95% !important;
    display: block;
    overflow-x: auto;
    td {
      font-size: 0.8rem !important;
      a {
        font-size: 0.8rem !important;
      }
    }
  }
}
</style>
