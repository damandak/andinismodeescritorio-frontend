<template>
  <div class="social-wrapper">
    <client-only>
      <a href="https://www.facebook.com/andinismodeescritorio/" class="fb">
        <font-awesome-icon icon="fa-brands fa-square-facebook" />
      </a>
      <a href="https://github.com/damandak/andinismodeescritorio-frontend" class="gh">
        <font-awesome-icon icon="fa-brands fa-square-github" />
      </a>
      <a href="https://www.instagram.com/andinismodeescritorio/" class="ig">
        <font-awesome-icon icon="fa-brands fa-instagram" />
      </a>
    </client-only>
  </div>
</template>
<script setup lang="ts">
</script>
<style lang="scss" scoped>
.social-wrapper {
  position: fixed;
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
  display: flex;
  align-items: space-around;
  justify-content: center;
  gap: 20px;
  width: 100%;
  height: 33px;
  background-color: $color-light;
  padding-top: 4px;
  box-sizing: border-box;
  border-top: 1px solid $color-light-dark;
  // box-shadow: 1px 1px 5px 0px rgba(222, 7, 118, 0.572);
  // border-radius: 10px 10px 0px 0px;
  color: $color-main-first;
  font-size: 1.4rem;
  a {
    transition: all 0.3s ease;
  }
  .fb {
    color: $color-main-first;
    &:hover {
      color: $color-main-second;
    }
  }
  .ig {
    color: $color-main-second;
    &:hover {
      color: $color-main-first;
    }
  }
  .gh {
    color: $color-dark;
    &:hover {
      color: $color-dark-soft;
    }
  }
}
</style>