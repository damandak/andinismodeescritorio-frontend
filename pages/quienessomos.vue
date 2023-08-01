<template>
  <main>
    <BlogHeader
      :title="'Quiénes Somos'"
      :subtitle="''"
      :image_id="1"
      :abstract="''"
      :authorID="''"
      :dateSpanish="''"
      :coverimgclass="'smaller'"
      />
    <p>
      Somos un colectivo de personas que reconocemos que el andinismo en los Andes tiene una rica historia que debe ser recuperada para que así todos podamos apreciar a quienes compartieron las mismas pasiones, solo que años antes. No somos más que un resultado de todo lo que ha ocurrido antes que nosotros.
    </p>
    <p>
      Este proyecto toma como punto de partida y busca complementar el enorme y destacado trabajo compilatorio de muchos: Evelio Echevarría, Joszef Ambrus, Humberto Barrera, Club Andino de Chile, Proyecto Nomenclatura, Perros Alpinos, DAV, Andeshandbook, entre otros.
    </p>
    <p>
      También es necesario decir que los supuestos considerados para incluir qué cerros o ascensos se incluyen en el sitio, así como sus características, no son imposiciones y están abiertos a cambios. No nos adjudicamos un poder absoluto de decidir qué entra en esta gran base de datos y cualquier propuesta de modificación estructural o circunstancial es bienvenida para nutrir de la manera más adecuada la información contenida en el sitio.
    </p>
  </main>
</template>
<script setup lang="ts">
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
      font-family: 'Lora', serif;
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