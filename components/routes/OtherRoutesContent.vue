<template>
  <div class="routes-content">
    <div class="routes-list">
      <NuxtLink
        :to="`/rutas/${mtnroute.id}`"
        v-for="mtnroute in mtnRoutes"
        :key="mtnroute.id"
      >
        {{ mtnroute.name }}
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  mtnID: String;
  routeID: String;
}>();
const config = useRuntimeConfig();
const route = useRoute();

const apiURLRoutes =
  config.public.apiBase + "mountain/" + props.mtnID + "/routes/";
const data = await $fetch(apiURLRoutes);
// save mtnRoutes the results, except where the id is the same as the routeID
const mtnRoutes = data.results.filter(
  (mtnroute: any) => mtnroute.id != props.routeID
);
</script>
<style scoped lang="scss">
.routes-content {
  text-align: center;
  h2 {
    color: $color-dark;
  }
  .routes-list {
    a {
      height: auto;
      min-height: 50px;
      background-color: $color-main-second;
      width: 40%;
      min-width: 250px;
      margin: 5px auto;
      color: white !important;
      display: block;
      -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
      -moz-box-sizing: border-box; /* Firefox, other Gecko */
      box-sizing: border-box; /* Opera/IE 8+ */
      padding: 14px;
      transition: all 0.3s ease;
      &:hover {
        background-color: $color-light;
        color: $color-main-second !important;
      }
    }
  }
}
</style>
