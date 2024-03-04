<template>
  <BodyReferences :references="references" />
</template>
<script setup lang="ts">
const props = defineProps<{
  ascentID: number;
}>();

const config = useRuntimeConfig();

const apiURLreferences =
  config.public.apiBase + "ascent/" + props.ascentID + "/references/";
const data = await $fetch(apiURLreferences);
const references = data.results;
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
h2 {
  margin: 20px auto;
  text-align: center;
}
</style>
