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
      <tr v-for="ascent in ascents" :key="ascent.id">
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
            :key="andinist.id"
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
type AndinistBasic = {
  id: number | string;
  fullname: string;
};

type AscentView = {
  id: number | string;
  name: string;
  mountain: number | string;
  mountain_name: string;
  route: number | string;
  route_name: string;
  date: string;
  resulting_date: string;
  andinist_list: AndinistBasic[];
  honours: string;
};

const props = defineProps<{
  id: string | number;
}>();

const config = useRuntimeConfig();

const { data } = await useAsyncData(
  `andinist-ascents-${props.id}`,
  () =>
    $fetch<{ results: AscentView[] }>(
      `${config.public.apiBase}andinist/${props.id}/ascents/`
    )
);

const ascents = computed(() => data.value?.results ?? []);
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
