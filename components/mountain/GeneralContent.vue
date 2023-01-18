<template>
  <table class="adetable adetable-general">
    <tbody>
      <tr>
        <th>Nombre</th>
        <td>{{ mtnPrefix + " " + mtnName }}</td>
      </tr>
      <tr>
        <th>Altitud</th>
        <td>{{ mtnAltitude }}</td>
      </tr>
      <tr>
        <th>Latitud</th>
        <td>{{ mtnLatitude }}</td>
      </tr>
      <tr>
        <th>Longitud</th>
        <td>{{ mtnLongitude }}</td>
      </tr>
      <tr>
        <th>Primer Ascenso <span v-if="unregisteredNonSportAscent === true">Deportivo*</span></th>
        <td class="smaller" v-if="firstAbsolute">
          <NuxtLink :to="`/ascensos/${firstAbsolute}`">
            {{ firstAbsoluteName }}
          </NuxtLink>
          el {{ firstAbsoluteDate }} por 
          <NuxtLink v-for="(andinist, index) in firstAbsoluteTeam" :to="`/andinistas/${andinist[0]}`">
            <span v-if="index !== 0">{{ ", " }}</span>
            {{ andinist[1] }}
          </NuxtLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
const props = defineProps<{
  mtnID: String;
  mtnName: String;
  mtnPrefix: String;
  mtnAltitude: Number;
  mtnLatitude: Number;
  mtnLongitude: Number;
  firstAbsolute: String;
  firstAbsoluteName: String;
  firstAbsoluteDate: String;
  firstAbsoluteTeam: Array<{
    id: String;
    name: String;
  }>;
  unregisteredNonSportAscent: Boolean;
}>();
</script>
<style lang="scss" scoped>
.adetable-general {
  margin-top: 15px !important;
  td.smaller {
    font-size: 0.9em;
  }
}
@media screen and (max-width: 768px) {
  .adetable-general {
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