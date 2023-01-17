<template>
  <div class="blog-index">
    <ContentList path="/blog" v-slot="{ list }">
      <div v-for="article in list" :key="article._path" class="blog-card">
        <div class="blog-card-header">
          <img :src="image_urls.find((image) => image.id === article.mainimageid).image" alt="blog image" />
          <NuxtLink :to="article._path">
            <h2>{{ article.title }}</h2>
          </NuxtLink>
        </div>
        <NuxtLink :to="'/andinistas/' + article.authorid">
          <p>{{ article.author }}</p>
        </NuxtLink>
        <p class="datespanish">{{ article.datespanish }}</p>
        <p>{{ article.description }}</p>
      </div>
    </ContentList>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

// save mainimageid from every article of content NUXT
const contents = await $fetch('/api/_content/query')
const image_ids = contents.map((content) => content.mainimageid)

const image_urls = await Promise.all(
  image_ids.map(async (id) => {
    const apiURLImage = runtimeConfig.public.apiBase + "image/" + id + "/" 
    const { data } = await useFetch(apiURLImage)
    return {id: id, image: data.value.image}
  })
)
</script>

<style scoped lang="scss">
.blog-index {
  margin: 60px auto auto auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 1500px;
  gap: 50px;
  .blog-card {
    //height: 500px;
    width: 400px;
    border-radius: 0 0 20px 20px;
    background-color: $color-light;
    padding-bottom: 15px;
    .blog-card-header {
      position: relative;
      img {
        //height: 200px;
        width: 100%;
        border-radius: 11px 11px 0 0;
        object-fit: cover;
        filter: brightness(70%);
      }
      h2 {
        //transform: translateY(-110%);
        color: $color-light;
        // text-transform: uppercase;
        position: absolute;
        bottom: 7px;
        margin: 0;
        padding: 10px;
        &:hover {
          color: $color-main-second;
        }
      }
    }
    h2, h3, p {
      margin: 0;
      padding: 0 15px 0 15px;
    }
    a {
      p {
        &:hover {
          text-decoration: underline;
        }
      }
    }
    p {
      font-weight: 200;
      font-family: 'Lora', serif;
      font-size: 0.9em;
    }
    .datespanish {
      font-size: 0.8em;
      font-weight: 200;
      color: $color-main-second;
    }

  }
}
</style>


