<template>
  <nav class="navbar" aria-label="Principal">
    <NuxtLink to="/">
      <div class="navbar_logo">
        <img src="/img/nav_logo.png" alt="Andinismo de Escritorio: inicio" />
      </div>
    </NuxtLink>
    <NavbarRight
      :menuOpen="activeExtended === 'active'"
      :searchOpen="activeSearch === 'active'"
      @openExtendedNav="openExtendedNav"
      @openSearch="openSearch"
    />
    <NavbarExtended
      :active="activeExtended"
      @closeExtendedNav="closeExtendedNav"
    />
    <SearchWrapper :active="activeSearch" @closeSearch="closeSearch" />
  </nav>
</template>
<script setup lang="ts">
import { ref } from "vue";

const activeExtended = ref("inactive");
const activeSearch = ref("inactive");

// Where the focus was before opening the menu or the search, to give it back
// on close (keyboard users stay where they were).
let returnFocus: HTMLElement | null = null;
function rememberFocus() {
  returnFocus = document.activeElement as HTMLElement | null;
}
function restoreFocus() {
  // Only if the focus is still inside the closed panel (not after a link
  // click that already moved to another page).
  const active = document.activeElement;
  if (active && active !== document.body && !active.closest("#site-menu, #site-search")) {
    returnFocus = null;
    return;
  }
  returnFocus?.focus?.({ preventScroll: true });
  returnFocus = null;
}

function openExtendedNav() {
  rememberFocus();
  activeExtended.value = "active";
}
function closeExtendedNav() {
  activeExtended.value = "inactive";
  restoreFocus();
}

function openSearch() {
  rememberFocus();
  activeSearch.value = "active";
}
function closeSearch() {
  activeSearch.value = "inactive";
  restoreFocus();
}

// Esc closes whichever is open.
function onKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  if (activeSearch.value === "active") closeSearch();
  else if (activeExtended.value === "active") closeExtendedNav();
}
onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));
</script>
<style scoped lang="scss">
nav.navbar {
  background-color: $color-light;
  background:
    linear-gradient($color-light, $color-light) padding-box,
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
