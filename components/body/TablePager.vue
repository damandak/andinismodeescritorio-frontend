<template>
  <div class="page-number-banner">
    <button
      type="button"
      class="pager-button"
      aria-label="Página anterior"
      title="Página anterior"
      :disabled="page <= 1"
      @click="emit('change', page - 1)"
    >
      ‹
    </button>
    <label>
      <span>Página</span>
      <select
        :value="page"
        @change="emit('change', Number(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="n in total" :key="n" :value="n">{{ n }}</option>
      </select>
    </label>
    <span class="page-total">de {{ total }}</span>
    <button
      type="button"
      class="pager-button"
      aria-label="Página siguiente"
      title="Página siguiente"
      :disabled="page >= total"
      @click="emit('change', page + 1)"
    >
      ›
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ page: number; total: number }>();
const emit = defineEmits<{ change: [page: number] }>();
</script>
