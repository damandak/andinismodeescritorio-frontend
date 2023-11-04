<template>
  <div class="nav-right">
    <div class="nav-right__item">
      <client-only>
        <font-awesome-icon
          icon="fa-solid fa-magnifying-glass"
          @click="$emit('openSearch')"
        />
      </client-only>
    </div>
    <MainstructureMainButton
      :buttonclass="'nav-right__item navbutton'"
      :to="'/'"
      :text="'PORTADA'"
      v-if="route.name == 'blog'"
    />
    <MainstructureMainButton
      :buttonclass="'nav-right__item navbutton'"
      :to="'/blog'"
      :text="'BLOG'"
      v-else
    />
    <div class="nav-right__item">
      <client-only>
        <font-awesome-icon icon="bars" @click="$emit('openExtendedNav')" />
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  openExtendedNav: () => void;
  openSearch: () => void;
}>();

const route = useRoute();
</script>

<style lang="scss">
.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 17px;
  height: 100%;
  margin: 0 20px 0 0;
  .nav-right__item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;
    transition: all 0.7s ease-in-out;
    color: $color-main-second;
    font-size: 1.05rem;
    &:hover {
      color: $color-main-first;
    }
  }
}
</style>
