<template>
  <div class="extended-nav-wrapper" :class="active">
    <client-only>
      <font-awesome-icon
        icon="fa-solid fa-rectangle-xmark"
        class="extended-nav__close"
        @click="$emit('closeExtendedNav')"
      />
    </client-only>
    <div class="extended-nav-link">
      <NuxtLink to="/" @click="$emit('closeExtendedNav')"> inicio </NuxtLink>
    </div>
    <div
      class="extended-nav-link"
      style="text-align: right; width: 95%; margin-left: 30px"
    >
      <NuxtLink to="/" @click="$emit('closeExtendedNav')">
        quiénes somos
      </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/cerros" @click="$emit('closeExtendedNav')">
        cerros
      </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/" @click="$emit('closeExtendedNav')"> sectores </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/andinistas" @click="$emit('closeExtendedNav')">
        andinistas
      </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/rutas" @click="$emit('closeExtendedNav')">
        rutas
      </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/ascensos" @click="$emit('closeExtendedNav')">
        ascensos
      </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/blog" @click="$emit('closeExtendedNav')"> blog </NuxtLink>
    </div>
    <div class="extended-nav-link">
      <NuxtLink to="/admin" @click="$emit('closeExtendedNav')">
        admin
      </NuxtLink>
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
  inset: 0 -100% 0 auto;
  width: min(100%, 520px);
  height: 100vh;
  height: 100dvh;
  box-sizing: border-box;
  overflow-y: auto;
  overscroll-behavior: contain;

  background: linear-gradient(to right, $color-main-first, $color-main-second);
  z-index: 100;
  transition: right 0.7s ease-in-out;
  opacity: 0.95;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  gap: clamp(0.75rem, 2.2vh, 2rem);
  padding: clamp(1rem, 3vh, 2rem) 40px;
  border-left: 10px #222222 solid;

  .extended-nav__close {
    color: $color-light;
    font-size: clamp(2.5rem, 8vh, 4rem);
    margin: 0;
    cursor: pointer;
    transition: all 0.7s ease-in-out;

    &:hover {
      color: $color-main-first;
    }
  }

  .extended-nav-link {
    color: $color-light;
    font-family: var(--font-serif);
    font-size: clamp(2rem, 6vh, 3rem);
    line-height: 1;
    font-weight: 900;
    text-transform: lowercase;
    margin: 0;
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

@media screen and (max-height: 720px) {
  .extended-nav-wrapper {
    justify-content: flex-start;
  }
}

@media screen and (max-width: 768px) {
  .extended-nav-wrapper {
    width: 100%;
    border-left: 0;
    padding-inline: 28px;
  }
}
</style>
