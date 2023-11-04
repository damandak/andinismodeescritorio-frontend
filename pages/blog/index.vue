<template>
  <div class="blog-index">
    <div class="blog-cards">
      <ContentList :query="queryParamsFirst" v-slot="{ list }">
        <div
          v-for="article in list"
          :key="article._path"
          class="blog-card blog-card-wide"
        >
          <div class="blog-card-header">
            <img
              :src="
                image_urls.find((image) => image.id === article.mainimageid)
                  .main_image
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
        </div>
      </ContentList>
      <ContentList :query="queryParamsRest" v-slot="{ list }">
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
        </div>
      </ContentList>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

// save mainimageid from every article of content NUXT
const contents = await queryContent("blog").only("mainimageid").find();
// const image_ids = contents.map((content) => content.mainimageid)

// Query for the List object
import type { QueryBuilderParams } from "@nuxt/content/dist/runtime/types";
const queryParamsFirst: QueryBuilderParams = {
  path: "/blog",
  where: { draft: false },
  sort: { date: -1 },
  limit: 1, // Limit the results to only one post
};

// Define the query parameters to get all blog posts but skip the first
const queryParamsRest: QueryBuilderParams = {
  path: "/blog",
  where: { draft: false },
  sort: { date: -1 },
  skip: 1, // Skip the first result
};

const image_urls = await Promise.all(
  contents.map(async (article) => {
    const apiURLImage =
      config.public.apiBase + "image/" + article.mainimageid + "/";
    const { data } = await useFetch(apiURLImage);
    return {
      id: article.mainimageid,
      image: data.value.tb_item_cover,
      main_image: data.value.image,
    };
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
      -webkit-box-shadow: 10px 12px 18px -10px rgba(0, 0, 0, 0.42);
      -moz-box-shadow: 10px 12px 18px -10px rgba(0, 0, 0, 0.42);
      box-shadow: 10px 12px 18px -10px rgba(0, 0, 0, 0.42);
      .blog-card-header {
        position: relative;
        img {
          //height: 200px;
          width: 100%;
          height: 300px;
          border-radius: 11px 11px 0 0;
          object-fit: cover;
          filter: brightness(70%) hue-rotate(-15deg);
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
        font-weight: 600;
        font-family: "Lora", serif;
        font-size: 0.9em;
      }
      .datespanish {
        font-size: 0.8em;
        font-weight: 200;
        color: $color-main-second;
      }
    }
    .blog-card-wide {
      width: 80%;
      .blog-card-header {
        img {
          height: auto;
          max-height: 500px;
          object-position: top;
        }
        h2 {
          font-size: 3rem;
          line-height: 1.3em;
          padding: 35px;
        }
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
      .blog-card-wide {
        width: 90%;
        .blog-card-header {
          h2 {
            font-size: 1.5rem !important;
            line-height: inherit !important;
          }
        }
      }
    }
  }
}
</style>
