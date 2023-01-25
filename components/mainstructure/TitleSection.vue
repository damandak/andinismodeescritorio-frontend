<template>
  <div class="title-section">
    <div class="title">
      <h2 v-if="prefix">{{ prefix }}</h2>
      <h1>{{ name }}</h1>
      <p v-if="subtitle">{{ subtitle }} <span v-if="mts">mts</span></p>
    </div>
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
  subtitle: {
    type: String,
    required: false,
  },
  mts: {
    type: Boolean,
    required: false,
  },
});
</script>
<style scoped lang="scss">
.title-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  //height: 100px;
  padding: 20px 0 10px 0;
  margin: 0 auto;
  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    //height: 100%;
    h2 {
      font-size: 1.5rem;
      font-weight: 400;
      color: $color-dark;
      margin: 0;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 900;
      color: $color-dark;
      margin: 0;
      text-align: center;
    }
    p {
      font-size: 1.1rem;
      font-weight: 400;
      color: $color-dark;
      margin: 0;
    }
  }
}
</style>
