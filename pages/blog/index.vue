<template>
  <div class="blog-index">
    <MainstructureTitleSection name="Blog" />
    <div class="blog-cards">
      <ContentList path="/blog" v-slot="{ list }">
        <div v-for="article in list" :key="article._path" class="blog-card">
          <div class="blog-card-header">
            <img
              :src="
                image_urls.find((image) => image.id === article.mainimageid)
                  .image
              "
              alt="blog image"
            />
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
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

// save mainimageid from every article of content NUXT
const contents = await queryContent("blog").only("mainimageid").find();
// const image_ids = contents.map((content) => content.mainimageid)

const image_urls = await Promise.all(
  contents.map(async (article) => {
    const apiURLImage =
      runtimeConfig.public.apiBase + "image/" + article.mainimageid + "/";
    const { data } = await useFetch(apiURLImage);
    return { id: article.mainimageid, image: data.value.tb_item_cover };
  })
);
</script>

<style scoped lang="scss">
.blog-index {
  margin: 45px auto 50px auto;
  .blog-cards {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 1500px;
    width: 95%;
    gap: 20px;
    margin: 15px auto;
    .blog-card {
      //height: 500px;
      width: 400px;
      border-radius: 0 0 20px 20px;
      background-color: $color-light;
      padding-bottom: 15px;
      -webkit-box-shadow: 4px 4px 18px -13px rgba(0, 0, 0, 0.42);
      -moz-box-shadow: 4px 4px 18px -13px rgba(0, 0, 0, 0.42);
      box-shadow: 4px 4px 18px -13px rgba(0, 0, 0, 0.42);
      .blog-card-header {
        position: relative;
        img {
          //height: 200px;
          width: 100%;
          border-radius: 11px 11px 0 0;
          object-fit: cover;
          filter: brightness(80%);
        }
        h2 {
          //transform: translateY(-110%);
          color: $color-light;
          text-shadow: 1px 1px 1px $color-main-first;
          // text-transform: uppercase;
          position: absolute;
          bottom: 7px;
          margin: 0;
          padding: 10px;
          &:hover {
            text-shadow: 1px 1px 1px $color-main-second;
          }
        }
      }
      h2,
      h3,
      p {
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
        font-family: "Lora", serif;
        font-size: 0.9em;
      }
      .datespanish {
        font-size: 0.8em;
        font-weight: 200;
        color: $color-main-second;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .blog-index {
    .blog-cards {
      .blog-card {
        width: 90%;
      }
    }
  }
}
</style>
