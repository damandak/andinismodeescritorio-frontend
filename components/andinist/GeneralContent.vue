<template>
  <table class="adetable adetable-general">
    <tbody>
      <tr>
        <th>Nombre</th>
        <td>{{ name }}</td>
      </tr>
      <tr>
        <th>Apellidos</th>
        <td>{{ surname }}</td>
      </tr>
      <tr>
        <th>Género</th>
        <td>{{ gender }}</td>
      </tr>
      <tr>
        <th>Nacionalidades</th>
        <td>{{ nationalities }}</td>
      </tr>
      <tr>
        <th>Clubes / Instituciones</th>
        <td>{{ clubs }}</td>
      </tr>
      <tr>
        <th># Ascensos</th>
        <td>{{ ascent_count }}</td>
      </tr>
      <tr>
        <th># Primeros Ascensos</th>
        <td>{{ first_ascent_count }}</td>
      </tr>
      <tr>
        <th># Nuevas Rutas</th>
        <td>{{ new_routes_count }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
const props = defineProps<{
  name: String;
  surname: String;
  gender: String;
  nationalities: String;
  clubs: String;
  ascent_count: Number;
  first_ascent_count: Number;
  new_routes_count: Number;
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