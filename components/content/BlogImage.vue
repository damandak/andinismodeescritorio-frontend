<template>
  <div v-if="image" class="blog-image" :class="not_fullwidth">
    <a :href="image.image" target="_blank" rel="noopener" title="Ver foto original">
      <img
        v-if="fullwidth"
        :src="largeSrc(image)"
        :alt="alt || image_detail || image.name"
        :width="image.width || undefined"
        :height="image.height || undefined"
        loading="lazy"
        decoding="async"
      />
      <img
        v-else
        :src="coverSrc(image)"
        :srcset="coverSrcset(image)"
        :alt="alt || image_detail || image.name"
        :width="image.width || undefined"
        :height="image.height || undefined"
        loading="lazy"
        decoding="async"
      />
    </a>
    <div class="caption">
      {{ image_detail }}
      <div v-if="image.author_name" class="author-p">
        <strong>Fotografía por </strong>
        <NuxtLink v-if="image.author" :to="'/andinistas/' + image.author">
          {{ image.author_name }}
        </NuxtLink>
        <template v-else>{{ image.author_name }}</template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const props = withDefaults(
  defineProps<{
    image_id: Number;
    image_detail: string;
    alt: string;
    fullwidth: Boolean;
  }>(),
  {
    fullwidth: true,
  }
);

const not_fullwidth = computed(() => {
  if (props.fullwidth) {
    return "fullwidth";
  } else {
    return "not-fullwidth";
  }
});
const apiURLImage =
  runtimeConfig.public.apiBase + "image/" + props.image_id + "/";
// A missing photo hides this block instead of breaking the whole post.
const image: any = await $fetch(apiURLImage).catch(() => null);
</script>
<style scoped lang="scss">
.blog-image {
  margin: auto;
  width: 100%;
  padding-bottom: 60px;
  a {
    display: block;
  }
  img {
    width: 100%;
    height: auto;
    margin: auto;
  }
  .caption {
    width: 600px;
    margin: auto;
    font-size: 0.9rem;
    font-family: var(--font-serif);
    .author-p {
      display: block;
      text-transform: uppercase;
      font-weight: 100;
      font-size: 0.8rem;
      letter-spacing: 0.2rem;
      a {
        font-family: var(--font-serif);
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
.not-fullwidth {
  width: 600px !important;
  margin: auto;
  img {
    width: 600px !important ;
  }
}
@media screen and (max-width: 680px) {
  .blog-image {
    padding-bottom: 20px;
    .caption {
      width: 90%;
      font-size: 0.7rem;
      line-height: 1.1rem;
      .author-p {
        font-size: 0.6rem;
        letter-spacing: 0.1rem;
      }
    }
  }
  .not-fullwidth {
    width: 90% !important;
    margin: auto;
    text-align: center;
    img {
      width: 90% !important ;
      margin: auto;
    }
  }
}
</style>
