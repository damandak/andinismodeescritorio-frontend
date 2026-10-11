<template>
  <aside class="record-contributors" aria-label="Aportes">
    <p v-if="names?.length" class="names">
      Con aportes de: <span>{{ names.join(", ") }}</span>.
    </p>
    <p class="propose">
      ¿Ves un error o tienes más datos?
      <NuxtLink :to="`/proponer/${model}/${id}`" rel="nofollow">Proponer una corrección</NuxtLink>
    </p>
  </aside>
</template>

<script setup lang="ts">
// Foot of a record (cerro, ruta, ascenso, andinista): who contributed to it
// (approved proposals) and a link to propose a change.
defineProps<{ model: "cerro" | "ruta" | "ascenso" | "andinista"; id: string | number; names?: string[] }>();
</script>

<style scoped lang="scss">
.record-contributors {
  width: 80%;
  max-width: 900px;
  margin: 0 auto 40px;
  padding: 16px 0 0;
  border-top: 1px solid $color-light-dark;
  font-size: 0.9rem;
  color: #555;
  text-align: center;
  p {
    margin: 0 0 6px;
  }
  .names span {
    color: $color-dark;
  }
  a {
    font-family: inherit;
    color: $color-main-second;
    text-decoration: underline;
    &:hover {
      color: $color-main-first;
    }
  }
}
</style>
