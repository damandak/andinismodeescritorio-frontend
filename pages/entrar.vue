<template>
  <AccountPanel title="Entrar">
    <form @submit.prevent="submit" novalidate>
      <label>
        Correo
        <input v-model.trim="email" type="email" autocomplete="email" required />
        <p v-for="m in errors.email" :key="m" class="error">{{ m }}</p>
      </label>
      <label>
        Contraseña
        <input v-model="password" type="password" autocomplete="current-password" required />
        <p v-for="m in errors.password" :key="m" class="error">{{ m }}</p>
      </label>
      <p v-for="m in errors['']" :key="m" class="error" role="alert">{{ m }}</p>
      <button class="primary" type="submit" :disabled="busy">Entrar</button>
    </form>
    <div class="links">
      <NuxtLink to="/recuperar-clave">¿Olvidaste tu contraseña?</NuxtLink>
      <NuxtLink :to="{ path: '/crear-cuenta', query: route.query }">Crear una cuenta</NuxtLink>
    </div>
  </AccountPanel>
</template>

<script setup lang="ts">
useHead({ title: "Entrar", meta: [{ name: "robots", content: "noindex" }] });
const route = useRoute();
const auth = useAuth();
const email = ref("");
const password = ref("");
const busy = ref(false);
const errors = ref<FormErrors>({});

// Only paths inside the site (never an outside address).
const next = computed(() => {
  const n = String(route.query.next || "");
  return n.startsWith("/") && !n.startsWith("//") ? n : "/mi-cuenta";
});

onMounted(async () => {
  if (await auth.ensureChecked()) navigateTo(next.value, { replace: true });
});

async function submit() {
  busy.value = true;
  const r = await auth.login(email.value, password.value);
  busy.value = false;
  if (r.ok) return navigateTo(next.value);
  if (r.status === 429) errors.value = { "": ["Demasiados intentos. Espera unos minutos e intenta de nuevo."] };
  else if (r.status === 400 && (r.errors.email || r.errors.password) && email.value && password.value)
    errors.value = { "": ["Correo o contraseña incorrectos."] };
  else errors.value = Object.keys(r.errors).length ? r.errors : { "": ["Correo o contraseña incorrectos."] };
}
</script>
