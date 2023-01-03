<template>
  <h3 v-if="mtnAHB || mtnWikiExplora">Referencias externas</h3>
  <div v-if="mtnAHB || mtnWikiExplora" class="main-references">
    <span v-if="mtnAHB">
      <a :href="mtnAHB">
        Andeshandbook
      </a>
    </span>
    <span v-if="mtnWikiExplora">
      <a :href="mtnWikiExplora">
        WikiExplora
      </a>
    </span>
  </div>
  <BodyReferences :references="references" />
  <h3 v-if="nomenclatura">Datos Nomenclatura</h3>
  <table v-if="nomenclatura" class="adetable adetable-ascents">
    <tr>
      <th>ID Nomenclatura</th>
      <td>
        {{ nomenclatura.id_nomenclatura }}
      </td>
    </tr>
    <tr>
      <th>Nombre</th>
      <td>
        {{ nomenclatura.name }}
      </td>
    </tr>
    <tr>
      <th>Hoja IGM</th>
      <td>
        {{ nomenclatura.igm_rectangle_name }}
      </td>
    </tr>
    <tr>
      <th>Altura IGM</th>
      <td>
        {{ nomenclatura.altitude_igm }}
      </td>
    </tr>
    <tr>
      <th>Latitud</th>
      <td>
        {{ nomenclatura.latitude }}
      </td>
    </tr>
    <tr>
      <th>Longitud</th>
      <td>
        {{ nomenclatura.longitude }}
      </td>
    </tr>
    <tr>
      <th>Observaciones</th>
      <td>
        {{ nomenclatura.observations }}
      </td>
    </tr>
    <tr>
      <th>Comentario</th>
      <td>
        {{ nomenclatura.comment }}
      </td>
    </tr>
    <tr>
      <th>Código de revisión</th>
      <td>
        {{ nomenclatura.cod_revision }}
      </td>
    </tr>
  </table>
</template>
<script setup lang="ts">
const props = defineProps<{
  mtnID: String;
  mtnAHB: String;
  mtnWikiExplora: String;
  mtnNomenclatura: String;
}>();

const config = useRuntimeConfig();

const apiURLreferences = config.public.apiBase + "mountain/" + props.mtnID + "/references/"
const { data } = await useFetch(apiURLreferences)
const references = data.value.results

const apiURLnomenclatura = config.public.apiBase + "mountain/" + props.mtnID + "/nomenclatura/"
const { data: dataNomenclatura } = await useFetch(apiURLnomenclatura)
const nomenclatura = dataNomenclatura.value

</script>
<style scoped lang="scss">
.main-references {
  width: 80%;
  margin: 10px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  p {
    margin: 10px 0 5px 0;
  }
  a {
    background-color: $color-main-second;
    color: white;
    margin: 2px;
    padding: 4px 10px;
    line-height: 30px;
    display: inline-block;
    border: 2px solid $color-main-second;
    font-weight: 500;
    &:hover {
      color: $color-main-second;
      background-color: $color-light;
      border: 2px solid $color-light-dark;
    }
  }
}
.adetable-ascents {
  margin-top: 10px !important;
}
h3 {
  margin: 20px auto;
  text-align: center;
}
</style>
