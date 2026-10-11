<template>
  <AccountPanel title="Mi cuenta">
    <p v-if="!me" class="notice">Cargando…</p>
    <template v-else>
      <p v-if="route.query.nueva" class="notice" role="status">
        ¡Bienvenido, {{ me.public_name }}! Te enviamos un correo para confirmar tu dirección.
      </p>

      <p class="email-line">
        <strong>{{ me.email }}</strong>
        <span v-if="me.email_verified" class="badge ok">Confirmado</span>
        <template v-else>
          <span class="badge">Sin confirmar</span>
          <button class="link-button" type="button" :disabled="resent" @click="resend">
            {{ resent ? "Correo enviado" : "Reenviar correo de confirmación" }}
          </button>
        </template>
      </p>

      <h2>Nombre público</h2>
      <form @submit.prevent="saveName" novalidate>
        <label>
          <span class="hint">Así apareces junto a tus aportes.</span>
          <input v-model="name" type="text" maxlength="80" aria-label="Nombre público" />
          <p v-for="m in nameErrors.public_name" :key="m" class="error">{{ m }}</p>
        </label>
        <div class="row">
          <button class="secondary" type="submit" :disabled="name.trim() === me.public_name">Guardar</button>
          <span v-if="nameSaved" class="saved" role="status">Guardado</span>
        </div>
      </form>

      <h2>Perfil de andinista</h2>
      <p v-if="me.andinist">
        Tu cuenta está vinculada a
        <NuxtLink :to="`/andinistas/${me.andinist.id}`" class="inline">{{ me.andinist.name }}</NuxtLink>.
      </p>
      <template v-else-if="me.claim?.pending">
        <p>
          Pediste vincular tu cuenta a
          <NuxtLink :to="`/andinistas/${me.claim.andinist.id}`" class="inline">{{ me.claim.andinist.name }}</NuxtLink>.
          Un editor lo revisará.
        </p>
        <button class="secondary" type="button" @click="auth.cancelClaim()">Retirar solicitud</button>
      </template>
      <p v-else-if="!me.email_verified" class="hint">
        Si apareces como andinista en el sitio, podrás pedir vincular tu cuenta a tu ficha
        después de confirmar tu correo.
      </p>
      <template v-else>
        <p v-if="me.claim" class="notice warn">
          Tu solicitud para vincularte a {{ me.claim.andinist.name }} no fue aprobada.
        </p>
        <p class="hint">
          Si apareces como andinista en el sitio (por tus ascensos), búscate y pide vincular tu cuenta.
          Un editor lo confirmará.
        </p>
        <input v-model="query" type="search" placeholder="Buscar por nombre" aria-label="Buscar andinista" @input="searchSoon" />
        <ul v-if="results.length" class="results">
          <li v-for="a in results" :key="a.id">
            <template v-if="choosing?.id === a.id">
              <form @submit.prevent="claim" novalidate>
                <strong>{{ a.fullname }}</strong>
                <label>
                  <span class="hint">Mensaje para el editor (opcional): cómo podemos confirmarlo.</span>
                  <textarea v-model="message" maxlength="1000" />
                </label>
                <p v-for="m in claimErrors[''] || claimErrors.andinist" :key="m" class="error">{{ m }}</p>
                <div class="row">
                  <button class="primary" type="submit">Enviar solicitud</button>
                  <button class="link-button" type="button" @click="choosing = null">Cancelar</button>
                </div>
              </form>
            </template>
            <template v-else>
              <NuxtLink :to="`/andinistas/${a.id}`" target="_blank">{{ a.fullname }}</NuxtLink>
              <button class="secondary small" type="button" @click="choosing = a">Soy yo</button>
            </template>
          </li>
        </ul>
        <p v-else-if="query.trim().length > 1 && searched" class="hint">Sin resultados.</p>
      </template>

      <h2>Cambiar contraseña</h2>
      <form @submit.prevent="savePassword" novalidate>
        <label>
          Contraseña actual
          <input v-model="currentPassword" type="password" autocomplete="current-password" />
          <p v-for="m in passwordErrors.current_password" :key="m" class="error">{{ m }}</p>
        </label>
        <label>
          Contraseña nueva
          <input v-model="newPassword" type="password" autocomplete="new-password" />
          <p v-for="m in passwordErrors.new_password" :key="m" class="error">{{ m }}</p>
        </label>
        <p v-for="m in passwordErrors['']" :key="m" class="error">{{ m }}</p>
        <div class="row">
          <button class="secondary" type="submit" :disabled="!currentPassword || !newPassword">Cambiar contraseña</button>
          <span v-if="passwordSaved" class="saved" role="status">Contraseña cambiada</span>
        </div>
      </form>

      <div class="row end footer">
        <a v-if="me.is_editor" href="/admin/" class="inline">Ir al admin</a>
        <button class="secondary" type="button" @click="logout">Salir</button>
      </div>
    </template>
  </AccountPanel>
</template>

<script setup lang="ts">
useHead({ title: "Mi cuenta", meta: [{ name: "robots", content: "noindex" }] });
const route = useRoute();
const config = useRuntimeConfig();
const auth = useAuth();
const me = auth.me;

onMounted(async () => {
  const user = await auth.ensureChecked();
  if (!user) return navigateTo({ path: "/entrar", query: { next: "/mi-cuenta" } }, { replace: true });
  name.value = user.public_name;
});

// Email confirmation
const resent = ref(false);
async function resend() {
  const r = await auth.resendVerification(me.value!.email);
  resent.value = r.ok;
}

// Public name
const name = ref("");
const nameSaved = ref(false);
const nameErrors = ref<FormErrors>({});
async function saveName() {
  const r = await auth.updatePublicName(name.value);
  nameErrors.value = r.errors;
  nameSaved.value = r.ok;
  if (r.ok) name.value = r.data.public_name;
}

// Andinist profile
type Found = { id: number; fullname: string };
const query = ref("");
const results = ref<Found[]>([]);
const searched = ref(false);
const choosing = ref<Found | null>(null);
const message = ref("");
const claimErrors = ref<FormErrors>({});
let timer: ReturnType<typeof setTimeout> | undefined;
function searchSoon() {
  clearTimeout(timer);
  timer = setTimeout(search, 300);
}
async function search() {
  const term = query.value.trim();
  if (term.length < 2) {
    results.value = [];
    return;
  }
  const data: any = await $fetch(config.public.apiBase + "andinist/table/", {
    query: { search: term, page_size: 8 },
  }).catch(() => null);
  if (term !== query.value.trim()) return; // an older search
  results.value = data?.results ?? [];
  searched.value = true;
}
async function claim() {
  const r = await auth.claimAndinist(choosing.value!.id, message.value);
  claimErrors.value = r.errors;
  if (r.ok) {
    choosing.value = null;
    results.value = [];
    query.value = "";
  }
}

// Password
const currentPassword = ref("");
const newPassword = ref("");
const passwordSaved = ref(false);
const passwordErrors = ref<FormErrors>({});
async function savePassword() {
  const r = await auth.changePassword(currentPassword.value, newPassword.value);
  passwordErrors.value = r.errors;
  passwordSaved.value = r.ok;
  if (r.ok) currentPassword.value = newPassword.value = "";
}

async function logout() {
  await auth.logout();
  navigateTo("/");
}
</script>

<style scoped lang="scss">
.email-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
}
.badge {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: $color-light-dark;
}
.badge.ok {
  background: #e3f6f7;
  color: #0f6f75;
}
.link-button {
  font: inherit;
  font-size: 0.9rem;
  background: none;
  border: 0;
  padding: 0;
  color: $color-main-second;
  text-decoration: underline;
  cursor: pointer;
  &:disabled {
    color: #777;
    text-decoration: none;
    cursor: default;
  }
}
.row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  &.end {
    justify-content: flex-end;
  }
}
.footer {
  margin-top: 36px;
  padding-top: 20px;
  border-top: 1px solid $color-light-dark;
}
.saved {
  color: #0f6f75;
  font-size: 0.9rem;
}
.results {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid $color-light-dark;
    a {
      font-family: inherit;
    }
    form {
      width: 100%;
    }
  }
}
.secondary.small {
  padding: 4px 12px;
  font-size: 0.9rem;
}
</style>
