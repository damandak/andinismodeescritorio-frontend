<template>
  <h4>{{ subtitle }}</h4>
  <h1>{{ title }}</h1>
  <div class="image-container"> 
    <img :src="image.image" alt="blog image" />
  </div>
  <div class="abstract">
    {{ abstract }}
  </div>
  <div class="author">
    <strong>POR </strong>
    <NuxtLink :to="'/andinistas/' + authorID">
      {{ author.name + " " + author.surname }}
    </NuxtLink>
  </div>
  <!-- <div class="photographers">
    <strong>FOTOS POR </strong>
    <NuxtLink v-for="photographer in photographers"  :to="'/andinistas/' + authorID">
      {{ author.name + " " + author.surname }}
    </NuxtLink>
  </div> -->
  <div class="date">
    {{ dateSpanish }}
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();

const props = defineProps<{
  title: string;
  subtitle: string;
  image_id: number;
  abstract: string;
  authorID: string;
  dateSpanish: string;
}>()

const apiURLImage = config.public.apiBase + "image/" + props.image_id + "/" 
const { data } = await useFetch(apiURLImage)
const image = data.value

const apiURLauthor = config.public.apiBase + "andinist/" + props.authorID + "/"
const { data: authorData } = await useFetch(apiURLauthor)
const author = authorData.value
</script>
<style scoped lang="scss">
h1 {
  font-size: 4rem;
  text-align: center;
  margin: 10px auto 20px auto;
  max-width: 1000px;
  width: 90%;
  font-style: italic;
}
h4 {
  font-size: 1.2rem;
  text-align: center;
  margin: 30px auto auto auto;
  width: 600px;
}
.abstract {
  text-align: justify;
  margin-block-start: 2em;
  margin-block-end: 2em;
  font-family: 'Lora', serif;
  font-weight: 900;
  font-size: 1.5rem;
  line-height: 2.2rem;
  width: 600px;
  margin: 30px auto 0px auto;
  font-style: italic;

}
.author {
  width: 600px;
  margin: 10px auto;
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
.date {
  width: 600px;
  margin: 10px auto;
  font-weight: 400;
  color: $color-main-first;
  letter-spacing: 0.1rem;
}
.image-container {
  margin: auto;
  width: 100%;
  img {
    width: 100%;
    object-fit: cover;
    object-position: center;
    margin: auto;
  }
}

@media screen and (max-width: 1000px) {
  h1 {
    font-size: 3rem;
  }
}

@media screen and (max-width: 680px) {
  h1 {
    font-size: 2rem;
  }
  h4 {
    width: 90%;
    font-size: 1rem;
  }
  .abstract {
    width: 90%;
    font-size: 1.2rem;
    line-height: 1.8rem;
    margin-bottom: 30px;
  }
  .author {
    width: 90%;
    text-align: center;
  }
  .date {
    width: 90%;
    text-align: center;
  }
}

</style>


