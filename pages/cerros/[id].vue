<template>
  <div class="content-wrapper mountain-wrapper">
    <div class="cards-wrapper">
      <div class="title-section">
        <MainstructureLeftTitle :prefix="mtnPrefix" :name="mtnName" />
        <MainstructureRightTitle :name="mtnAltitude" :prefix="'mts'" />
      </div>
      <div v-if="img_url" class="main-image-section">
        <img :src="img_url" alt="" />
        <div class="info-image">
          +
          <p v-if="info - image">Fotografía de: {{ image.author }}</p>
          <p v-else>Imagen sin autor</p>
        </div>
      </div>
      <div v-else class="main-image-section no-image">
        <p>No hay imagen disponible</p>
      </div>
      <div class="row" style="width: 90%; border-top: 0px">
        <div class="mtn-card mtn-info"></div>
        <div class="mtn-card mtn-description">
          <p>
            El Cerro El Plomo, rebautizado por los locales como "Apu Wamani", es
            una montaña no solo geológicamente alta, sino espiritualmente
            inalcanzable, situada majestuosamente a 5424 metros sobre el nivel
            de los mortales en Santiago de Chile. Este coloso no es una simple
            montaña, es el centro místico del universo, un portal cósmico donde
            los mortales buscan obtener superpoderes y la eterna juventud.
          </p>
          <p>
            Cada año, hordas de aventureros, desafiando toda lógica y
            supervivencia, se lanzan en una peregrinación épica hacia su cumbre,
            como si subir Apu Wamani fuera un mandato divino para ganar favor
            con las deidades andinas. Los rumores dicen que al alcanzar la cima,
            uno puede escuchar las voces de antiguos sabios que murmurán
            secretos del universo, aunque lo más probable es que sea el viento
            helado jugando con tu mente exhausta.
          </p>
          <p>
            La fiebre por conquistar este gigante no se limita a los montañistas
            serios con sus picos y cuerdas; los trail runners, esos valientes
            velocistas de la montaña, han hecho del ascenso un espectáculo de
            resistencia. Estos corredores, considerados héroes nacionales, suben
            y bajan a velocidades que harían palidecer a un cóndor en pleno
            vuelo. Sus hazañas son tan legendarias que se rumorea que tienen un
            contrato de patrocinio con las mismísimas fuerzas de la naturaleza.
          </p>
          <p>
            No es exagerado decir que Apu Wamani no solo es una montaña: es un
            fenómeno cultural, un desafío personal y una obsesión nacional. La
            gente del lugar suele decir que si puedes hablar después de subir,
            es que no lo has hecho lo suficientemente rápido. Así que ya sabes,
            si buscas un poco de magia, un desafío sobrehumano y la posibilidad
            de ser parte de la leyenda nacional, el Cerro El Plomo es tu
            destino. Solo recuerda, la línea en tre la aventura épica y la
            locura absoluta es tan delgada como el aire allá arriba.
          </p>
        </div>
      </div>
      <div class="row" style="width: 95%">
        <div class="mtn-routes mtn-card">
          <h3>Rutas</h3>
          <MountainRoutesContent :mtnID="mtnID" :mtnFullName="mtnFullName" />
        </div>
        <div class="mtn-ascent mtn-card">
          <h3>Ascensos Relevantes</h3>
          <MountainAscentsContent :mtnID="mtnID" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute();

const apiURLMountain =
  config.public.apiBase + "mountain/" + route.params.id + "/";
const mtn = (await $fetch(apiURLMountain)) as any;

const mtnID = ref(route.params.id);
const mtnName = ref(mtn.name);
const mtnPrefix = ref(mtn.prefix);
const mtnAltitude = ref(mtn.altitude);

const main_image = ref(mtn.main_image);
const img_url = ref(null);
const image = ref(null);
const author = ref(null);

if (main_image.value != null) {
  const apiURLImage = config.public.apiBase + "image/" + main_image.value + "/";
  const dataImage = await $fetch(apiURLImage);
  image.value = dataImage;
  img_url.value = image.value.image;
  author.value = image.author;
}
</script>
<style scoped lang="scss">
.mountain-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  .cards-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    //min-width: 1100px;
    height: 100%;
    .row {
      display: flex;
      gap: 10px;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      margin-top: 15px;
      border-top: 3px dotted #1b1b1b1f;
    }
    .title-section {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 75%;
      padding: 20px 0 10px 0;
      margin: 0 auto;
      font-family: "Arvo", serif;
    }
    .main-image-section {
      width: 75%;
      height: 400px;
      border: 3px solid $color-dark;
      border-radius: 10px;
      //border-bottom: 1px solid $color-dark-soft;
      display: flex;
      justify-content: space-around;
      background-color: $color-light;
      padding: 0;
      &.no-image {
        height: 150px;
        text-align: center;
        font-size: 20px;
        opacity: 0.4;
        padding: 40px 0;
        box-sizing: border-box;
        font-family: "Arvo";
      }
      img {
        height: 400px;
        object-fit: cover;
        width: 100%;
        border-radius: 6px;
      }
      .no-image {
        height: 200px;
        width: 100%;
        text-align: center;
        font-size: 20px;
        opacity: 0.4;
        padding: 80px 0;
        box-sizing: border-box;
      }
      .info-image {
        height: 20px;
        width: 30px;
        position: absolute;
        top: 475.7px;
        border: 2px solid #ffffff;
        border-bottom: 0px !important;
        border-radius: 6px 6px 0px 0px;
        background: $color-main-first;
        color: white;
        font-weight: bold;
        font-size: 20px;
        text-align: center;
        line-height: 0.9;
        transition: 0.3s ease-in-out;
        overflow: hidden;
        &:hover {
          background: $color-main-second;
          width: 250px;
          height: 40px;
          top: 455.7px;
          p {
            display: block;
          }
        }
        p {
          display: none;
          margin: 0;
          font-size: 0.8rem;
          font-weight: 400;
          font-family: "Arvo";
        }
      }
    }
    .mtn-card {
      // height: 300px;
      // border: 3px solid $color-dark;
      border-radius: 10px;
      padding: 6px 10px;
      p {
        text-indent: 3em;
        margin: 0;
        font-size: 1rem;
        line-height: 1.4rem;
        text-align: justify;
        font-family: "Lora", serif;
      }
    }
    .mtn-info {
      width: 300px;
    }
    .mtn-description {
      width: 72%;
      max-width: 800px;
      display: block;
      //overflow: auto;
    }
    .mtn-route {
      width: 28%;
    }
    .mtn-ascent {
      //max-height: 400px;
      height: auto;
      width: 72%;
    }
  }
}
</style>
