<template>
  <div class="blog-index">
    <div class="blog-cards">
      <!-- The newest post as a wide card, the rest below -->
      <div v-for="article in posts.slice(0, 1)" :key="article._path" class="blog-card blog-card-wide">
        <div class="blog-card-header">
          <img
            :src="largeSrc(images[String(article.mainimageid)])"
            :alt="article.title"
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
      <div v-for="article in posts.slice(1)" :key="article._path" class="blog-card">
        <div class="blog-card-header">
          <img
            :src="coverSrc(images[String(article.mainimageid)])"
            :alt="article.title"
            loading="lazy"
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
    </div>
  </div>
</template>

<script setup lang="ts">
usePageSeo({
  title: "Blog",
  description:
    "Relatos de los Andes Centrales: primeros ascensos, cumbres olvidadas e investigación de la historia del andinismo.",
});

const config = useRuntimeConfig();
const images = useBlogImageStore();

// The posts (only the fields the cards use, not the whole text) and their
// cover photos in one request, both sent to the browser with the page.
const { data: posts } = await useAsyncData("blog-index", async () => {
  const list: any[] = await queryContent("blog")
    .where({ draft: false })
    .only(["_path", "title", "author", "authorid", "datespanish", "mainimageid"])
    .sort({ date: -1 })
    .find();
  await loadBlogImages(config.public.apiBase, images, list.map((p) => p.mainimageid));
  return list;
}, { default: () => [] });

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
        font-family: var(--font-serif);
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
