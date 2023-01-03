<template>
  <NuxtLayout>
    <NuxtPage />
    <MainstructureSocialBanner />
  </NuxtLayout>
</template>
<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
