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
  width: 100%;
  margin: 50px auto auto auto;
  &:deep(h3) {
    // https://stackoverflow.com/questions/73800242/nuxt-content-v2-markdown-headers-rendered-as-urls
    // REVISAR ESO PARA ARREGLAR ESTE DESASTREEE
    font-size: 2rem;
    text-align: center;
    font-family: 'Lora', serif;
    margin: 70px auto 40px auto;
    line-height: 2.2rem;
  }
  &:deep(p) {
    font-size: 1.3rem;
    line-height: 2.2rem;
    text-align: justify;
    margin-block-start: 2em;
    margin-block-end: 2em;
    font-family: 'Lora', serif;
    width: 600px;
    margin: 40px auto;
    strong {
      font-weight: 900;
      font-size: 1.5rem;
      line-height: 2.2rem;
    }
  }
  &:deep(hr) {
    opacity: 0.4;
    margin: 30px 50px 50px 50px;
    height: 10px;
    background: $color-main-first; /* For browsers that do not support gradients */ 
    background: -webkit-linear-gradient(left, $color-main-first , $color-main-second); /*For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(right, $color-main-first, $color-main-second); /* For Opera 11.1 to 12.0 */ 
    background: -moz-linear-gradient(right, $color-main-first, $color-main-second); /* For Firefox 3.6 to 15 */ 
    background: linear-gradient(to right, $color-main-first , $color-main-second); /* Standard syntax */
    border: 0px solid transparent;
  }
}
@media screen and (max-width: 680px) {
  main {
    &:deep(p) {
      width: 90%;
      margin: 40px auto;
      font-size: 1.2rem;
      strong {
        font-size: 1.3rem;
      }
    }
  }
}

</style>
