<template>
  <table class="adetable adetable-general">
    <tbody>
      <tr>
        <th>Montaña</th>
        <td>
          <NuxtLink :to="`/cerros/${mountainID}`">
            {{ mountainName }}
          </NuxtLink>
        </td>
      </tr>
      <tr>
        <th>Ruta</th>
        <td>
          {{ routeName }} <span v-if="summit === false">*</span>
        </td>
      </tr>
      <tr>
        <th>Primer Ascenso <span v-if="unregisteredNonSportAscent === true">Deportivo**</span></th>
        <td class="smaller" v-if="firstAscent">
          <NuxtLink :to="`/ascensos/${firstAscent}`">
            {{ firstAscentName }}
          </NuxtLink>
          el {{ firstAscentDate }} por 
          <NuxtLink v-for="(andinist, index) in firstAscentTeam" :to="`/andinistas/${andinist[0]}`">
            <span v-if="index !== 0">{{ ", " }}</span>
            {{ andinist[1] }}
          </NuxtLink>
        </td>
      </tr>
    </tbody>
  </table>
  <p class="table-comment" v-if="summit === false">* Ruta no llega a la cumbre</p>
  <p class="table-comment" v-if="unregisteredNonSportAscent === true">** Hay ascensos previos no deportivos (precolombinos, arrieros y/o pirquineros)</p>
</template>
<script setup lang="ts">
const props = defineProps<{
  mountainID: String;
  mountainName: String;
  routeName: String;
  summit: Boolean;
  firstAscent: String;
  firstAscentName: String;
  firstAscentDate: String;
  firstAscentTeam: Array<{
    id: String;
    name: String;
  }>;
  unregisteredNonSportAscent: String;
  unregisteredSportAscent: String;
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
.table-comment {
  font-size: 0.8em;
  color: $color-dark;
  margin: auto;
  width: 100%;
  text-align: center;
}
</style>