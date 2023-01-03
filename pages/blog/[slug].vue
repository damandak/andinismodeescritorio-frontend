<template>
  <main>
    <!-- <header>
      <h1>{{ data.title }}</h1>
      <p>{{ data.description }}</p>
    </header>
    <ContentRenderer /> -->
    <ContentDoc />
  </main>
</template>
<script setup lang="ts">
// const route = useRoute();

// const { data } = await useAsyncData(`content-${route.path}`, () =>
//   queryContent().where({ _path: route.path }).findOne()
// );
</script>
<style scoped lang="scss">
main {
  padding-bottom: 50px;
  width: 600px;
  margin: 50px auto auto auto;
  &:deep(h3) {
    font-size: 2rem;
    text-align: center;
  }
  &:deep(p) {
    font-size: 1.3rem;
    line-height: 2rem;
    text-align: justify;
    margin-block-start: 2em;
    margin-block-end: 2em;
  }
  &:deep(img) {
    margin-left: calc(-50vw + 300px);
    margin-right: calc(-50vw + 300px);
    width: 100vw;
  }
}
</style>
