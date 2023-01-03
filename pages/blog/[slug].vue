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
  &:deep(h1) {
    font-size: 2.8rem;
    text-align: center;
    margin: 10px 0 20px 0;
  }
  &:deep(h3) {
    // https://stackoverflow.com/questions/73800242/nuxt-content-v2-markdown-headers-rendered-as-urls
    // REVISAR ESO PARA ARREGLAR ESTE DESASTREEE
    font-size: 2rem;
    text-align: center;
    font-family: 'Lora', serif;
  }
  &:deep(h4) {
    font-size: 1.2rem;
    text-align: center;
    margin: 30px 0px 0 0;
  }
  &:deep(p) {
    font-size: 1.3rem;
    line-height: 2rem;
    text-align: justify;
    margin-block-start: 2em;
    margin-block-end: 2em;
    font-family: 'Lora', serif;
  }
  &:deep(img) {
    margin-left: calc(-50vw + 300px);
    margin-right: calc(-50vw + 300px);
    width: 100vw;
  }
}
</style>
