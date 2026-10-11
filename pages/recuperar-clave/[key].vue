<template>
  <AccountPanel title="Elige una contraseña nueva">
    <p v-if="state === 'checking'" class="notice">Revisando el enlace…</p>
    <template v-else-if="state === 'invalid'">
      <p class="notice warn">Este enlace no es válido o ya venció. Pide uno nuevo.</p>
      <div class="links"><NuxtLink to="/recuperar-clave">Pedir otro enlace</NuxtLink></div>
    </template>
    <template v-else-if="state === 'done'">
      <p class="notice" role="status">Listo, tu contraseña cambió. Ya puedes entrar con ella.</p>
      <div class="links"><NuxtLink to="/entrar">Entrar</NuxtLink></div>
    </template>
    <form v-else @submit.prevent="submit" novalidate>
      <label>
        Contraseña nueva
        <span class="hint">Al menos 8 caracteres, que no sea solo números ni una muy común.</span>
        <input v-model="password" type="password" autocomplete="new-password" required />
        <p v-for="m in errors.password" :key="m" class="error">{{ m }}</p>
      </label>
      <p v-for="m in errors[''] || errors.key" :key="m" class="error" role="alert">{{ m }}</p>
      <button class="primary" type="submit" :disabled="busy">Guardar contraseña</button>
    </form>
  </AccountPanel>
</template>

<script setup lang="ts">
useHead({ title: "Contraseña nueva", meta: [{ name: "robots", content: "noindex" }] });
const route = useRoute();
const auth = useAuth();
const key = String(route.params.key || "");
const state = ref<"checking" | "invalid" | "form" | "done">("checking");
const password = ref("");
const busy = ref(false);
const errors = ref<FormErrors>({});

onMounted(async () => {
  const r = await auth.checkResetKey(key);
  state.value = r.ok ? "form" : "invalid";
});

async function submit() {
  busy.value = true;
  const r = await auth.resetPassword(key, password.value);
  busy.value = false;
  // 401 = changed, but not signed in automatically (allauth's default).
  if (r.ok || r.status === 401) state.value = "done";
  else errors.value = r.errors;
}
</script>
