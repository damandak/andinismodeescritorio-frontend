<template>
  <nav class="navbar">
    <NuxtLink to="/">
      <div class="navbar_logo">
        <img src="/img/nav_logo.png" alt="logo" />
      </div>
    </NuxtLink>
    <NavbarRight @openExtendedNav="openExtendedNav" @openSearch="openSearch" />
    <NavbarExtended :active="activeExtended" @closeExtendedNav="closeExtendedNav" />
    <SearchWrapper :active="activeSearch" @closeSearch="closeSearch" />
  </nav>
</template>
<script setup lang="ts">
import { ref } from "vue";

const activeExtended = ref("inactive");
const activeSearch = ref("inactive");
function openExtendedNav() {
  activeExtended.value = "active";
}
function closeExtendedNav() {
  activeExtended.value = "inactive";
}

function openSearch() {
  activeSearch.value = "active";
}
function closeSearch() {
  activeSearch.value = "inactive";
}
</script>
<style scoped lang="scss">
nav.navbar {
  background-color: $color-light;
  background: linear-gradient($color-light, $color-light) padding-box,
              linear-gradient(to right, $color-main-first, $color-main-second) border-box;
  border-bottom: 2px solid transparent;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  position: fixed;
  top: 0;
  width: 100%;
  height: 45px;
  z-index: 100;
  .navbar_logo {
    display: flex;
    align-items: center;
    padding: 10px 10px 10px 20px;
    cursor: pointer;
    img {
      height: 25px;
    }
  }
}
</style>