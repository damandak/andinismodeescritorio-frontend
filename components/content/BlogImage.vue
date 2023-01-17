<template>
  <div class="blog-image" :class="not_fullwidth">
    <img v-if="fullwidth" :src="image.image" :alt="alt" />
    <img v-else :src="image.tb_item_cover" :alt="alt" />
    <div class="caption">
      {{ image_detail }}
      <div class="author-p">
        <strong>Fotografía por </strong> 
        <NuxtLink :to="'/andinistas/' + image.author + '/'">
          {{ image.author_name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const props = defineProps<{
  image_id: string;
  image_detail: string;
  alt: string;
  fullwidth: { type: Boolean; default: true}
}>();

const not_fullwidth = computed(() => {
  if (props.fullwidth) {
    return "fullwidth"
  } else {
    return "not-fullwidth"
  }
})
const apiURLImage = runtimeConfig.public.apiBase + "image/" + props.image_id + "/" 
const { data } = await useFetch(apiURLImage)
const image = data.value
</script>
<style scoped lang="scss">
.blog-image {
  margin: auto;
  width: 100%;
  padding-bottom: 60px;
  img {
    width: 100%;
    margin: auto;
    
  }
  .caption {
    width: 600px;
    margin: auto;
    font-size: 0.9rem;
    font-family: 'Lora', serif;
    .author-p {
      display: block;
      text-transform: uppercase;
      font-weight: 100;
      font-size: 0.8rem;
      letter-spacing: 0.2rem;
      a {
        font-family: 'Lora', serif;
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
}
</style>