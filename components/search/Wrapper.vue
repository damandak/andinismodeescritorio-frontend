<template>
  <div class="search-wrapper" :class="active">
    <client-only>
      <font-awesome-icon icon="fa-solid fa-rectangle-xmark" class="search__close" @click="$emit('closeSearch')" />
    </client-only>
    <div class="search-bar">
      <input type="text" class="search-input" placeholder="Buscar" />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  active: String;
}>();
const emit = defineEmits<{
  closeSearch: () => void;
}>();
</script>
<style scoped lang="scss">
.search-wrapper {
  position: fixed;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, $color-main-first, $color-main-second);
  z-index: 100;
  transition: all 0.7s ease-in-out;
  opacity: 0.95;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  .search__close {
    color: white;
    font-size: 4rem;
    position: absolute;
    top: 10px;
    right: 15px;
    cursor: pointer;
    transition: all 0.7s ease-in-out;
    &:hover {
      color: $color-main-first;
    }
  }
  .search-bar {
    width: 100%;
    height: 50px;
    text-align: center;
    .search-input {
      outline: none;
      color: $color-dark;
      background-color: $color-light;
      border: none;
      padding: 10px 30px;
      font-family: 'Arvo';
      text-transform: lowercase;
      border-radius: 5px;
      width: 70%;
      max-width: 1500px;
      min-width: 300px;
      height: 47px;
      font-size: 1.2rem;
    }
  }
}
.active {
  left: 0;
}
</style>