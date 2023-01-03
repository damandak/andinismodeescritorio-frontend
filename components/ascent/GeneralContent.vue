<template>
  <table class="adetable adetable-general">
    <tbody>
      <tr>
        <th>Montaña</th>
        <td>
          <NuxtLink :to="`/cerros/${mtnID}`">
            {{ mtnName }}
          </NuxtLink>
        </td>
      </tr>
      <tr>
        <th>Ruta</th>
        <td>
          <NuxtLink :to="`/rutas/${routeID}`">
            {{ routeName }}
          </NuxtLink>
        </td>
      </tr>
      <tr>
        <th>Descripción</th>
        <td>{{ ascentName }}</td>
      </tr>
      <tr>
        <th>Andinistas</th>
        <td class="smaller">
          <NuxtLink v-for="(andinist, index) in andinists" :to="`/andinistas/${andinist[0]}`">
            <span v-if="index !== 0">{{ ", " }}</span>
            {{ andinist[1] }}
          </NuxtLink>
        </td>
      </tr>
      <tr>
        <th>Andinistas de apoyo</th>
        <td class="smaller">
          <NuxtLink v-for="(andinist, index) in supporting_andinists" :to="`/andinistas/${andinist[0]}`">
            <span v-if="index !== 0">{{ ", " }}</span>
            {{ andinist[1] }}
          </NuxtLink>
        </td>
      </tr>
      <tr>
        <th>Fecha</th>
        <td>{{ date_tostr }}</td>
      </tr>
      <tr>
        <th>Honores</th>
        <td>{{ "" }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
const props = defineProps<{
  mtnID: String;
  mtnName: String;
  routeID: String;
  routeName: String;
  ascentName: String;
  andinists: Array<{
    id: String;
    name: String;
  }>;
  supporting_andinists: Array<{
    id: String;
    name: String;
  }>;
  date_tostr: String;
}>();
</script>
<style lang="scss" scoped>
.adetable-general {
  margin-top: 15px !important;
  a {
    &:hover {
      color: $color-main-second;
    }
  }
  td.smaller {
    font-size: 0.9em;
  }
}
</style>