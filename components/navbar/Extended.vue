<template>
  <div class="extended-nav-wrapper" :class="active">
    <client-only >
      <font-awesome-icon icon="fa-solid fa-rectangle-xmark" class="extended-nav__close" @click="$emit('closeExtendedNav')" />
    </client-only>
    <div class="extended-nav-link">
      <NuxtLink to="/" @click="$emit('closeExtendedNav')"> inicio </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/" @click="$emit('closeExtendedNav')"> quiénes somos </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/cerros" @click="$emit('closeExtendedNav')"> cerros </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/" @click="$emit('closeExtendedNav')"> sectores </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/andinistas" @click="$emit('closeExtendedNav')"> andinistas </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/rutas" @click="$emit('closeExtendedNav')"> rutas </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/ascensos" @click="$emit('closeExtendedNav')"> ascensos </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/blog" @click="$emit('closeExtendedNav')"> blog </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  active: string;
}>(); 

const emit = defineEmits<{
  closeExtendedNav: () => void;
}>();
</script>

<style lang="scss">
.extended-nav-wrapper {
  position: fixed;
  top: 0;
  right: -100%;
  height: 100%;
  background: linear-gradient(to right, $color-main-first, $color-main-second);
  z-index: 100;
  transition: all 0.7s ease-in-out;
  opacity: 0.95;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 3.5vh;
  .extended-nav__close {
    color: $color-light;
    font-size: 4rem;
    margin: 0px 40px;
    cursor: pointer;
    transition: all 0.7s ease-in-out;
    &:hover {
      color: $color-main-first;
    }
  }
  .extended-nav-link {
    color: $color-light;
    font-family: 'Arvo', serif;
    font-size: 3rem;
    font-weight: 900;
    text-transform: lowercase;
    margin: 10px 40px;
    cursor: pointer;
    transition: all 0.7s ease-in-out;
    a {
      color: $color-light;
      text-decoration: none;
      transition: all 0.7s ease-in-out;
      &:hover {
        color: $color-main-first;
      }
    }
    &:hover {
      color: $color-main-first;
    }
  }
}
.extended-nav-wrapper.active {
  right: 0;
}
@media screen and (max-width: 768px) {
  .extended-nav-wrapper {
    width: 100%;
    gap: 2vh;
    .extended-nav__close {
      font-size: 3rem;
    }
    .extended-nav-link {
      font-size: 2.3rem;
    }
  }
}
</style>
