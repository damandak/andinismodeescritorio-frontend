<template>
  <AccountPanel title="Crear una cuenta" intro="Para aportar datos, fotos y testimonios a la base, con tu nombre.">
    <form @submit.prevent="submit" novalidate>
      <label>
        Nombre público
        <span class="hint">Así aparecerás junto a tus aportes.</span>
        <input v-model="form.public_name" type="text" autocomplete="name" maxlength="80" required />
        <p v-for="m in errors.public_name" :key="m" class="error">{{ m }}</p>
      </label>
      <label>
        Correo
        <span class="hint">No se muestra en el sitio.</span>
        <input v-model.trim="form.email" type="email" autocomplete="email" required />
        <p v-for="m in errors.email" :key="m" class="error">{{ m }}</p>
      </label>
      <label>
        Contraseña
        <span class="hint">Al menos 8 caracteres, que no sea solo números ni una muy común.</span>
        <input v-model="form.password" type="password" autocomplete="new-password" required />
        <p v-for="m in errors.password" :key="m" class="error">{{ m }}</p>
      </label>
      <!-- Invisible: people leave it empty, spam bots fill it -->
      <div class="trap" aria-hidden="true">
        <label>Sitio web <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" /></label>
      </div>
      <label class="check">
        <input v-model="form.accept_privacy" type="checkbox" required />
        <span>Acepto la <NuxtLink to="/privacidad" class="inline" target="_blank">política de privacidad</NuxtLink>.</span>
      </label>
      <p v-for="m in errors.accept_privacy" :key="m" class="error">{{ m }}</p>
      <p v-for="m in errors['']" :key="m" class="error" role="alert">{{ m }}</p>
      <p v-for="m in errors.website" :key="m" class="error" role="alert">{{ m }}</p>
      <button class="primary" type="submit" :disabled="busy">Crear cuenta</button>
    </form>
    <div class="links">
      <span>¿Ya tienes cuenta? <NuxtLink :to="{ path: '/entrar', query: route.query }">Entrar</NuxtLink></span>
    </div>
  </AccountPanel>
</template>

<script setup lang="ts">
useHead({ title: "Crear una cuenta", meta: [{ name: "robots", content: "noindex" }] });
const route = useRoute();
const auth = useAuth();
const form = reactive({ public_name: "", email: "", password: "", accept_privacy: false, website: "" });
const busy = ref(false);
const errors = ref<FormErrors>({});

onMounted(async () => {
  if (await auth.ensureChecked()) navigateTo("/mi-cuenta", { replace: true });
});

async function submit() {
  busy.value = true;
  const r = await auth.signup({ ...form });
  busy.value = false;
  if (r.ok || (r.status === 401 && auth.me.value)) {
    return navigateTo({ path: "/mi-cuenta", query: { nueva: "1" } });
  }
  errors.value = r.status === 429
    ? { "": ["Demasiados intentos. Espera unos minutos e intenta de nuevo."] }
    : r.errors;
}
</script>

<style scoped>
.trap {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
</style>
