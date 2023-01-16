<template>
  <div class="content-wrapper">
    <MapGoogleMap :currentParams="filterText" ref="child" />
    <MapFilterWrapper :active="activeFilter" @changeFilters="changeFilters" />
    <div class="mapbutton" @click="toggleWrapper">
      <p>FILTROS</p>
    </div>

  </div>
</template>

<script setup lang="ts">
const child = ref(null);
const currentFilter: Ref<[{id: number, text: string}]> = ref([])
const filterText = ref("");

const activeFilter = ref("");
function toggleWrapper() {
  activeFilter.value = activeFilter.value === "" ? "active" : "";
}
const changeFilters = (id: number, params: object) => {
  if (child) {
    child.value.filterMarkers(params);
  }
}
</script>

<style scoped lang="scss">
.mapbutton {
  padding: 0 15px;
  height: 34px !important;
  width: 78px;
  font-size: 13px !important;
  cursor: pointer;

  background: $color-light;
  background: linear-gradient(to right, $color-main-first, $color-main-second) border-box;
  position: fixed;
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  line-height: initial;
  border: 3px solid $color-light;
  p {
    bottom: 10px;
    left: 26px;
    position: absolute;
    color: white;
    text-decoration: none;
    font-weight: 900;
    text-transform: uppercase;
    transition: color 0.7s ease-in-out;
    margin: 0;
    font-family: 'Arvo', serif;
  }
  &:hover {
    background: linear-gradient(to right, $color-light, $color-light) border-box;
    p {
      color: $color-main-first;
    }
  }
}
</style>