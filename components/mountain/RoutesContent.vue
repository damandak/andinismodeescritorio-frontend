<template>
  <div class="routes-content">
    <div class="routes-list">
      <NuxtLink :to="`/rutas/${ mtnroute.id }`" v-for="mtnroute in mtnRoutes" :key="mtnroute.id" >
        {{ mtnroute.name }}
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  mtnID: String;
  mtnFullName: string;
}>();
import { ref } from 'vue';
const config = useRuntimeConfig();
const route = useRoute()

const apiURLRoutes = config.public.apiBase + "mountain/" + props.mtnID + "/routes/" 
const { data } = await useFetch(apiURLRoutes)
const mtnRoutes = data.value.results
</script>
<style scoped lang="scss">
.routes-content {
  text-align: center;
  .routes-list {
    a {
      height: 50px;
      background-color: $color-main-second;
      width: 40%;
      min-width: 250px;
      margin: 5px auto;
      color: white !important;
      display: block;
      -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
      -moz-box-sizing: border-box;    /* Firefox, other Gecko */
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