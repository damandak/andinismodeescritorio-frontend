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
const route = useRoute();
const config = useRuntimeConfig();

const findPost = (path: string) =>
  queryContent(path).only(["_path", "title", "description", "mainimageid"]).findOne();

const { data: post } = await useAsyncData(`blog-seo-${route.path}`, async () => {
  const lowerPath = route.path.toLowerCase();
  // Both queries start before any await: queryContent needs the Nuxt context,
  // which is lost after the first await.
  const [found, lower]: any[] = await Promise.all([
    findPost(route.path).catch(() => null),
    lowerPath !== route.path ? findPost(lowerPath).catch(() => null) : null,
  ]);
  if (found) {
    // Cover image for the social preview (fetched once, during SSR).
    const cover: any = found.mainimageid
      ? await $fetch(`${config.public.apiBase}image/${found.mainimageid}/`).catch(() => null)
      : null;
    return { ...found, cover: cover?.tb_item_cover || cover?.image || null };
  }
  // Old links written like the file name (/blog/Cerro-Evelio): the real
  // address is lowercase, so redirect instead of showing a 404.
  return lower ? { redirect: lower._path } : null;
});

if (post.value?.redirect) {
  await navigateTo(post.value.redirect, { redirectCode: 301 });
} else if (!post.value) {
  // A real 404 (it used to answer 200 with "Document not found").
  throw createError({ statusCode: 404, statusMessage: "Página no encontrada", fatal: true });
} else {
  usePageSeo({
    title: post.value.title,
    description: post.value.description || "",
    image: post.value.cover,
    type: "article",
  });
}
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
    font-family: var(--font-serif);
    margin: 70px auto 40px auto;
    line-height: 2.2rem;
  }
  &:deep(p) {
    font-size: 1.3rem;
    line-height: 2.2rem;
    text-align: justify;
    margin-block-start: 2em;
    margin-block-end: 2em;
    font-family: var(--font-serif);
    width: 600px;
    margin: 40px auto;
    strong {
      font-weight: 900;
      font-size: 1.5rem;
      line-height: 2.2rem;
    }
    a {
      color: $color-main-first;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  &:deep(blockquote) {
    margin: 40px auto;
    width: 500px;
    border-left: 5px solid $color-main-first;
    padding: 0 10px;
    p {
      margin: 0;
      font-size: 1.1rem;
      line-height: 2.2rem;
      text-align: justify;
      font-family: var(--font-serif);
      width: 500px;
      strong {
        font-weight: 900;
        font-size: 1.2rem;
        line-height: 2.2rem;
      }
    }
  }
  &:deep(hr) {
    opacity: 0.4;
    margin: 30px 50px 50px 50px;
    height: 10px;
    background: $color-main-first; /* For browsers that do not support gradients */
    background: -webkit-linear-gradient(
      left,
      $color-main-first,
      $color-main-second
    ); /*For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(
      right,
      $color-main-first,
      $color-main-second
    ); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(
      right,
      $color-main-first,
      $color-main-second
    ); /* For Firefox 3.6 to 15 */
    background: linear-gradient(
      to right,
      $color-main-first,
      $color-main-second
    ); /* Standard syntax */
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
    &:deep(blockquote) {
      width: 80%;
      margin-left: 10%;
      p {
        width: 80%;
        font-size: 1rem;
        strong {
          font-size: 1.1rem;
        }
      }
    }
  }
}
</style>
