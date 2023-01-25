<template>
  <div class="references-component">
    <h3 v-if="references.length > 0">Referencias</h3>
    <table v-if="references.length > 0" class="adetable adetable-ascents">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Edición</th>
          <th>Año</th>
          <th>Título</th>
          <th>Autor</th>
          <th>Página</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reference in references" key="reference.id">
          <td>{{ reference.publication_name }}</td>
          <td>{{ reference.publication_edition }}</td>
          <td>{{ reference.publication_year }}</td>
          <td>
            <a :href="reference.url" target="_blank">
              {{ reference.title }}
            </a>
          </td>
          <td>{{ reference.author }}</td>
          <td>{{ reference.page }}</td>
        </tr>
      </tbody>
    </table>
    <h3 v-else>No hay Referencias</h3>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  references: Array<{
    id: number;
    publication_name: string;
    publication_edition: string;
    publication_year: string;
    title: string;
  }>;
}>();
</script>
<style scoped lang="scss">
h3 {
  margin: 20px auto;
  width: 100%;
  text-align: center;
}
.adetable-ascents {
  margin-top: 10px !important;
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

