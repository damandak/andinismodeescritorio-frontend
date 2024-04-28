<template>
  <div class="title">
    <h1>{{ name }}</h1>
    <h2 v-if="prefix">{{ prefix }}</h2>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  prefix: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
});
</script>
<style scoped lang="scss">
.title {
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: flex-end;
  width: 100%;
  //height: 100%;
  h2 {
    font-size: 1.3rem;
    font-weight: 400;
    color: $color-dark;
    margin: 0;
  }
  h1 {
    font-size: 1.8rem;
    font-weight: 900;
    color: $color-dark;
    margin: 0;
    text-align: left;
    line-height: 0.8;
  }
}
</style>
