<template>
  <AccountPanel title="Confirmar correo">
    <p v-if="state === 'working'" class="notice">Confirmando…</p>
    <template v-else-if="state === 'done'">
      <p class="notice" role="status">Tu correo <strong v-if="email">{{ email }}</strong> quedó confirmado. ¡Gracias!</p>
      <div class="links">
        <NuxtLink :to="auth.me.value ? '/mi-cuenta' : '/entrar'">{{ auth.me.value ? "Ir a mi cuenta" : "Entrar" }}</NuxtLink>
      </div>
    </template>
    <template v-else>
      <p class="notice warn">Este enlace no es válido, ya se usó o venció.</p>
      <div class="links"><NuxtLink to="/mi-cuenta">Ir a mi cuenta</NuxtLink></div>
    </template>
  </AccountPanel>
</template>

<script setup lang="ts">
useHead({ title: "Confirmar correo", meta: [{ name: "robots", content: "noindex" }] });
const route = useRoute();
const auth = useAuth();
const key = String(route.params.key || "");
const state = ref<"working" | "done" | "invalid">("working");
const email = ref("");

onMounted(async () => {
  const info = await auth.checkEmailKey(key);
  if (!info.ok) {
    state.value = "invalid";
    return;
  }
  email.value = info.data?.data?.email || "";
  const r = await auth.verifyEmail(key);
  // 401: confirmed, but the visitor isn't signed in on this browser.
  state.value = r.ok || r.status === 401 ? "done" : "invalid";
});
</script>
