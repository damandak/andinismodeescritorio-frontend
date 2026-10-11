<template>
  <div class="nav-right">
    <button
      type="button"
      class="nav-right__item icon-button"
      aria-label="Buscar"
      title="Buscar"
      aria-controls="site-search"
      :aria-expanded="searchOpen"
      @click="$emit('openSearch')"
    >
      <client-only>
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
      </client-only>
    </button>
    <NuxtLink
      class="nav-right__item account-link"
      :class="{ signed: auth.me.value }"
      :to="auth.me.value ? '/mi-cuenta' : '/entrar'"
      :aria-label="auth.me.value ? `Mi cuenta (${auth.me.value.public_name})` : 'Entrar o crear cuenta'"
      :title="auth.me.value ? auth.me.value.public_name : 'Entrar'"
    >
      <client-only>
        <font-awesome-icon icon="fa-solid fa-user" />
      </client-only>
    </NuxtLink>
    <MainstructureMainButton
      :buttonclass="'nav-right__item navbutton'"
      :to="'/'"
      :text="'PORTADA'"
      v-if="route.name == 'blog'"
    />
    <MainstructureMainButton
      :buttonclass="'nav-right__item navbutton'"
      :to="'/blog'"
      :text="'BLOG'"
      v-else
    />
    <button
      type="button"
      class="nav-right__item icon-button"
      aria-label="Menú"
      title="Menú"
      aria-controls="site-menu"
      :aria-expanded="menuOpen"
      @click="$emit('openExtendedNav')"
    >
      <client-only>
        <font-awesome-icon icon="bars" />
      </client-only>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ menuOpen?: boolean; searchOpen?: boolean }>();
const emit = defineEmits<{
  openExtendedNav: [];
  openSearch: [];
}>();

const route = useRoute();

// Who is signed in, once per visit (the icon links to "Mi cuenta" or "Entrar").
const auth = useAuth();
onMounted(() => auth.ensureChecked());
</script>

<style lang="scss">
.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 17px;
  height: 100%;
  margin: 0 20px 0 0;
  .nav-right__item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;
    transition: all 0.7s ease-in-out;
    color: $color-main-second;
    font-size: 1.05rem;
    &:hover {
      color: $color-main-first;
    }
  }
  .account-link {
    font-family: inherit;
    // A small dot when signed in.
    position: relative;
    &.signed::after {
      content: "";
      position: absolute;
      top: 9px;
      right: -5px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: $color-main-first;
      border: 1.5px solid $color-light;
    }
  }
}
</style>
