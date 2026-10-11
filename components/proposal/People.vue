<template>
  <div class="people">
    <ul v-if="modelValue.length" class="chips">
      <li v-for="p in modelValue" :key="p.id">
        {{ p.name }}
        <button type="button" :aria-label="`Quitar a ${p.name}`" @click="remove(p.id)">×</button>
      </li>
    </ul>
    <input
      v-model="query"
      type="search"
      placeholder="Buscar andinista por nombre"
      :aria-label="`${label}: buscar andinista`"
      @input="searchSoon"
    />
    <ul v-if="results.length" class="results">
      <li v-for="a in results" :key="a.id">
        <button type="button" @click="add(a)">{{ a.fullname }}</button>
      </li>
    </ul>
    <p v-else-if="query.trim().length > 1 && searched" class="hint">
      Sin resultados. Si la persona no está en el sitio, escríbelo en el comentario.
    </p>
  </div>
</template>

<script setup lang="ts">
// Andinists chosen with a search box (there are too many for a list).
type Person = { id: number; name: string };
const props = defineProps<{ modelValue: Person[]; label: string }>();
const emit = defineEmits<{ "update:modelValue": [Person[]] }>();
const config = useRuntimeConfig();

const query = ref("");
const results = ref<{ id: number; fullname: string }[]>([]);
const searched = ref(false);
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
  const chosen = new Set(props.modelValue.map((p) => p.id));
  results.value = (data?.results ?? []).filter((a: any) => !chosen.has(a.id));
  searched.value = true;
}
function add(a: { id: number; fullname: string }) {
  emit("update:modelValue", [...props.modelValue, { id: a.id, name: a.fullname }]);
  query.value = "";
  results.value = [];
  searched.value = false;
}
function remove(id: number) {
  emit("update:modelValue", props.modelValue.filter((p) => p.id !== id));
}
</script>

<style scoped lang="scss">
.people {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 400;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    display: flex;
    align-items: center;
    gap: 4px;
    background: $color-light-dark;
    border-radius: 999px;
    padding: 3px 4px 3px 12px;
    font-size: 0.9rem;
  }
  button {
    font: inherit;
    border: 0;
    background: none;
    cursor: pointer;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    line-height: 1;
    &:hover {
      background: white;
    }
  }
}
.results {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 2px solid $color-light-dark;
  border-radius: 10px;
  overflow: hidden;
  button {
    font: inherit;
    display: block;
    width: 100%;
    text-align: left;
    background: white;
    border: 0;
    border-bottom: 1px solid $color-light-dark;
    padding: 8px 14px;
    cursor: pointer;
    &:hover,
    &:focus-visible {
      background: $color-light;
    }
  }
  li:last-child button {
    border-bottom: 0;
  }
}
</style>
