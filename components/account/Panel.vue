<template>
  <main class="account-panel">
    <h1>{{ title }}</h1>
    <p v-if="intro" class="intro">{{ intro }}</p>
    <slot />
  </main>
</template>

<script setup lang="ts">
// Frame shared by the account pages (entrar, crear cuenta, mi cuenta...),
// with the form styles they all use.
defineProps<{ title: string; intro?: string }>();
</script>

<style scoped lang="scss">
.account-panel {
  width: calc(100% - 32px);
  max-width: 440px;
  margin: 70px auto 60px;
  text-align: left;
  h1 {
    font-family: var(--font-serif);
    font-size: 2.2rem;
    line-height: 1.2;
    text-align: center;
    margin: 0 0 12px;
  }
  .intro {
    text-align: center;
    margin: 0 0 28px;
    color: #555;
  }
  :deep(h2) {
    font-family: var(--font-serif);
    font-size: 1.3rem;
    margin: 36px 0 8px;
    padding-top: 20px;
    border-top: 1px solid $color-light-dark;
  }
  :deep(form) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  :deep(label) {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-weight: 600;
    font-size: 0.95rem;
  }
  :deep(.hint) {
    font-weight: 400;
    font-size: 0.85rem;
    color: #666;
  }
  :deep(input[type="text"]),
  :deep(input[type="email"]),
  :deep(input[type="password"]),
  :deep(input[type="search"]),
  :deep(textarea) {
    font: inherit;
    font-weight: 400;
    padding: 10px 14px;
    border: 2px solid $color-light-dark;
    border-radius: 10px;
    background-color: $color-light;
    color: $color-dark;
    box-sizing: border-box;
    width: 100%;
    &:focus {
      outline: none;
      border-color: $color-main-first;
    }
  }
  :deep(textarea) {
    min-height: 80px;
    resize: vertical;
  }
  :deep(.check) {
    flex-direction: row;
    align-items: flex-start;
    gap: 10px;
    font-weight: 400;
    input {
      margin-top: 4px;
      width: 18px;
      height: 18px;
      flex: none;
      accent-color: $color-main-second;
    }
  }
  :deep(.primary),
  :deep(.secondary) {
    font: inherit;
    font-weight: 700;
    padding: 12px 24px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    &:disabled {
      opacity: 0.6;
      cursor: wait;
    }
  }
  :deep(.primary) {
    background: linear-gradient(to right, $color-main-first, $color-main-second);
    color: white;
  }
  :deep(.secondary) {
    background: $color-light;
    color: $color-dark;
    border: 2px solid $color-light-dark;
    padding: 8px 16px;
  }
  :deep(.error) {
    color: #b3261e;
    font-size: 0.9rem;
    font-weight: 400;
    margin: 0;
  }
  :deep(.notice) {
    background: $color-light;
    border-left: 4px solid $color-main-first;
    padding: 12px 16px;
    border-radius: 6px;
    margin: 0 0 20px;
  }
  :deep(.notice.warn) {
    border-left-color: $color-main-second;
  }
  :deep(.links) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
    font-size: 0.95rem;
    a {
      color: $color-main-second;
      font-family: inherit;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  :deep(a.inline) {
    color: $color-main-second;
    font-family: inherit;
    text-decoration: underline;
  }
}
</style>
