<template>
  <div class="page-size-selector">
    <label>
      <span>Mostrar</span>
      <select
        :value="value"
        @change="emit('change', Number(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="option in PAGE_SIZES" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <span>por página</span>
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{ value: number }>();
const emit = defineEmits<{ change: [size: number] }>();
</script>
