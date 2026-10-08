<template>
  <NuxtLayout>
    <div class="error-page">
      <h1 v-if="is404">No encontramos esta página</h1>
      <h1 v-else>Algo salió mal</h1>
      <p v-if="is404">
        Puede que el enlace esté mal escrito o que el registro ya no exista.
      </p>
      <p v-else>Intenta de nuevo en unos minutos.</p>
      <button type="button" @click="handleError">Volver al inicio</button>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number } }>();
const is404 = computed(() => props.error?.statusCode === 404);

useHead({ title: is404.value ? "Página no encontrada" : "Error" });

const handleError = () => clearError({ redirect: "/" });
</script>

<style scoped lang="scss">
.error-page {
  width: 90%;
  max-width: 600px;
  margin: 80px auto;
  text-align: center;
  h1 {
    font-family: var(--font-serif);
    margin-bottom: 16px;
  }
  p {
    margin-bottom: 32px;
  }
  button {
    background: linear-gradient(to right, $color-main-first, $color-main-second);
    color: white;
    border: none;
    padding: 12px 24px;
    font-weight: 700;
    cursor: pointer;
  }
}
</style>
