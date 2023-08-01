<template>
  <span class="order-switch">
    <span :class="['triangle', 'triangle-up', isActive('asc')]"></span>
    <span :class="['triangle', 'triangle-down', isActive('desc')]"></span>
  </span>
</template>
<script setup lang="ts">
const props = defineProps({
  orderField: {
    type: String,
    required: true,
  },
  currentOrderField: {
    type: String,
    required: true,
  },
  currentOrderDirection: {
    type: String,
    required: true,
  },
})

function isActive(direction) {
  return props.currentOrderField === props.orderField && props.currentOrderDirection === direction ? 'active' : '';
}
</script>
<style scoped lang="scss">
.order-switch {
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
  &:hover {
    cursor: pointer;
    color: $color-main-second;
  }
}

.triangle {
  display: inline-block;
  width: 0;
  height: 0;
  border-style: solid;
}

.triangle-up {
  border-width: 0 4px 6px 4px;
  border-color: transparent transparent #999 transparent;
}

.triangle-down {
  border-width: 6px 4px 0 4px;
  border-color: #999 transparent transparent transparent;
}

.triangle.active {
  border-color: #444;
}
</style>