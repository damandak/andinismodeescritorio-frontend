<template>
    <table class="adetable adetable-ascents">
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Ruta</th>
        <th>Descripción</th>
        <th>Andinistas</th>
        <th>Honores</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="ascent in ascents" key="ascent.id">
        <td class="date">{{ ascent.resulting_date }}</td>
        <td class="route">
          <NuxtLink :to="`/rutas/${ ascent.route }`">
            {{ ascent.route_name }}
          </NuxtLink>
        </td>
        <td><NuxtLink :to="`/ascensos/${ ascent.id }`">{{ ascent.name }}</NuxtLink></td>
        <td>
          <span v-for="(andinist, index) in ascent.andinist_list" key="andinist.id">
            <NuxtLink :to="`/andinistas/${ andinist.id }`">
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
  mtnID: String;
}>();

const config = useRuntimeConfig();

const apiURLascents = config.public.apiBase + "mountain/" + props.mtnID + "/ascents/"
const { data } = await useFetch(apiURLascents)
const ascents = data.value.results

for (const ascent of ascents) {
  ascent.andinist_list = []
  ascent.resulting_date = ""
  ascent.route_name = ""
  for (const andinist_id of ascent.andinists) {
    const apiURLandinist = config.public.apiBase + "andinist/" + andinist_id + "/basic/"
    const { data } = await useFetch(apiURLandinist)
    const andinist = data.value
    ascent.andinist_list = [...ascent.andinist_list, andinist]
  }
  if (ascent.date_format === 0) {
    // only year
    ascent.resulting_date = ascent.date.substring(0, 4) + "-xx-xx"
  } else if (ascent.date_format === 1) {
    // year and month
    ascent.resulting_date = ascent.date.substring(0, 7) + "-xx"
  } else if (ascent.date_format === 2) {
    ascent.resulting_date = ascent.date
  }
  const apiURLroute = config.public.apiBase + "route/" + ascent.route + "/name/"
  const { data } = await useFetch(apiURLroute)
  const route = data.value
  ascent.route_name = route.name
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
    font-size: 0.9rem
  }
  td.route {
    a {
      font-weight: 400;
      font-size: 0.9rem;
      line-height: 10px;
    }
  }
}
</style>