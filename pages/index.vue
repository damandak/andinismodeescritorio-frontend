<template>
  <div class="content-wrapper">
    <MapGoogleMap />
    <div class="mapbutton" @click="">
      <p>FILTROS</p>
    </div>

  </div>
</template>

<script setup>

definePageMeta({
  title: 'Home',
  description: 'This is the home page',
  layout: 'default',
})


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