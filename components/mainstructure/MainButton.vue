<template>
  <div class="main-button" :class="buttonclass">
    <NuxtLink :to="to">{{ text }}</NuxtLink>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  buttonclass: string;
  to: string;
  text: string;
}>();
</script>
<style scoped lang="scss">
.main-button {
  //background-color: white;
  padding: 0 15px;
  height: 34px !important;
  width: 78px;
  font-size: 13px !important;
  transition: background-color 0.7s ease-in-out !important;
  cursor: pointer;
  a {
    text-decoration: none;
    font-weight: 900;
    text-transform: uppercase;
    transition: color 0.7s ease-in-out;
  }
}
.navbutton {
  a {
    color: $color-main-first;
  }
  &:hover {
    background-color: $color-main-first;
    a {
      color: white;
    }
  }
}
</style>