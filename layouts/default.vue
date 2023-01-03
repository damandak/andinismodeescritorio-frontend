<template>
  <div id="full-wrapper">
    <NavbarMain />
    <slot />
  </div>
</template>
<style scoped lang="scss">
#full-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>