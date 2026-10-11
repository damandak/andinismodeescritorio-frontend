<template>
  <AccountPanel title="Recuperar contraseña">
    <p v-if="sent" class="notice" role="status">
      Si hay una cuenta con <strong>{{ email }}</strong>, te enviamos un correo con un enlace para
      elegir una contraseña nueva. Revisa también la carpeta de spam.
    </p>
    <form v-else @submit.prevent="submit" novalidate>
      <p class="hint">Escribe el correo de tu cuenta y te enviaremos un enlace.</p>
      <label>
        Correo
        <input v-model.trim="email" type="email" autocomplete="email" required />
        <p v-for="m in errors.email" :key="m" class="error">{{ m }}</p>
      </label>
      <p v-for="m in errors['']" :key="m" class="error" role="alert">{{ m }}</p>
      <button class="primary" type="submit" :disabled="busy">Enviar enlace</button>
    </form>
    <div class="links"><NuxtLink to="/entrar">Volver a entrar</NuxtLink></div>
  </AccountPanel>
</template>

<script setup lang="ts">
useHead({ title: "Recuperar contraseña", meta: [{ name: "robots", content: "noindex" }] });
const auth = useAuth();
const email = ref("");
const busy = ref(false);
const sent = ref(false);
const errors = ref<FormErrors>({});

async function submit() {
  busy.value = true;
  const r = await auth.requestPasswordReset(email.value);
  busy.value = false;
  // The answer is the same whether the account exists or not (privacy).
  if (r.ok) sent.value = true;
  else errors.value = r.status === 429 ? { "": ["Demasiados intentos. Espera unos minutos."] } : r.errors;
}
</script>
