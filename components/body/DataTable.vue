<template>
  <div class="page-filters">
    <BodyTablePageSize :value="state.pageSize" @change="setPageSize" />
    <div class="search-table">
      <input
        v-model="searchInput"
        type="search"
        placeholder="Buscar"
        :aria-label="`Buscar ${itemsLabel}`"
        @input="onSearchInput"
        @keydown.enter="flushSearch"
      />
    </div>
    <BodyTablePager :page="page" :total="totalPages" @change="setPage" />
  </div>
  <p class="visually-hidden" aria-live="polite">{{ statusText }}</p>
  <table
    ref="tableEl"
    class="adetable"
    :class="{ 'is-loading': pending }"
    :aria-busy="pending"
    :aria-label="title"
  >
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="col.field"
          scope="col"
          :aria-sort="ariaSort(col)"
        >
          <button
            v-if="col.sortable"
            type="button"
            class="sort-button"
            @click="sortBy(col)"
          >
            {{ col.label }}
            <BodyOrderSwitch
              :orderField="col.key"
              :currentOrderField="state.sort"
              :currentOrderDirection="state.desc ? 'desc' : 'asc'"
            />
          </button>
          <template v-else>{{ col.label }}</template>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td v-for="col in columns" :key="col.field" :class="col.class">
          <span v-if="col.links">
            <template v-for="(item, index) in col.links(row)" :key="item.to">
              <span v-if="index !== 0">, </span>
              <NuxtLink :to="item.to">{{ item.text }}</NuxtLink>
            </template>
          </span>
          <NuxtLink v-else-if="col.link" :to="col.link(row)">
            {{ col.formatter ? col.formatter(row) : row[col.field] }}
          </NuxtLink>
          <span v-else-if="col.is_boolean && row[col.field] === true">
            <font-awesome-icon icon="circle-check" title="sí" />
          </span>
          <span v-else-if="col.is_boolean && row[col.field] === false">
            no
          </span>
          <span v-else>{{
            col.formatter ? col.formatter(row) : row[col.field]
          }}</span>
        </td>
      </tr>
      <tr v-if="rows.length === 0 && !pending">
        <td :colspan="columns.length" class="table-message">
          {{ emptyText }}
        </td>
      </tr>
    </tbody>
  </table>
  <div class="page-filters">
    <BodyTablePageSize
      :value="state.pageSize"
      @change="(size) => setPageSize(size, true)"
    />
    <BodyTablePager
      :page="page"
      :total="totalPages"
      @change="(n) => setPage(n, true)"
    />
  </div>
</template>

<script setup lang="ts">
// One table for the four index pages: search, sort and paging, all kept in the
// URL (see utils/tableQuery.ts). The page is rendered on the server with the
// state of the URL, so a shared link opens on the same page of results.

const props = defineProps<{
  /** Unique name, used as cache key (e.g. "cerros"). */
  name: string;
  /** Page title, read by screen readers as the table's name. */
  title: string;
  /** "cerros", "rutas"... for "Buscar cerros" and "50 cerros". */
  itemsLabel: string;
  /** API path, relative to apiBase (e.g. "route/table/"). */
  endpoint: string;
  /** Extra fixed API parameters (e.g. { table: "" }). */
  extraQuery?: Record<string, string>;
  columns: TableColumn[];
}>();

type Page = { count: number; results: any[]; page: number };

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const tableEl = ref<HTMLElement | null>(null);

const state = computed(() => tableStateFromQuery(route.query, props.columns));
const apiQuery = computed(() => tableApiQuery(state.value, props.columns));

async function fetchPage(): Promise<Page> {
  const query = { ...props.extraQuery, ...apiQuery.value };
  const get = (q: object) =>
    $fetch<{ count: number; results: any[] }>(config.public.apiBase + props.endpoint, {
      query: q,
    });
  try {
    return { ...(await get(query)), page: Number(query.page) };
  } catch (error: any) {
    // A page past the end (old link, fewer results now): show the first one.
    if (error?.statusCode === 404 && Number(query.page) > 1) {
      return { ...(await get({ ...query, page: 1 })), page: 1 };
    }
    throw error;
  }
}

const { data, pending, error } = await useAsyncData(`table-${props.name}`, fetchPage, {
  watch: [apiQuery],
});

const rows = computed(() => data.value?.results ?? []);
const count = computed(() => data.value?.count ?? 0);
const page = computed(() => data.value?.page ?? state.value.page);
const totalPages = computed(() => Math.max(1, Math.ceil(count.value / state.value.pageSize)));

const emptyText = computed(() => {
  if (error.value) return "No se pudieron cargar los datos. Intenta de nuevo en un momento.";
  if (state.value.search) return `Sin resultados para «${state.value.search}».`;
  return "No hay datos.";
});
const statusText = computed(() => {
  if (pending.value) return "";
  if (error.value) return emptyText.value;
  return `${count.value} ${props.itemsLabel}, página ${page.value} de ${totalPages.value}.`;
});

function update(patch: Partial<TableState>, scrollToTable = false) {
  const next = { ...state.value, ...patch };
  router.replace({ query: tableStateToQuery(next, route.query) });
  if (scrollToTable && tableEl.value) {
    // Changed from the controls below the table: go back up to its first row.
    const top = tableEl.value.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: Math.max(0, top) });
  }
}

function setPage(n: number, scrollToTable = false) {
  update({ page: n }, scrollToTable);
}
function setPageSize(size: number, scrollToTable = false) {
  update({ pageSize: size, page: 1 }, scrollToTable);
}
function sortBy(col: TableColumn) {
  const same = state.value.sort === col.key;
  update({ sort: col.key!, desc: same ? !state.value.desc : false, page: 1 });
}
function ariaSort(col: TableColumn) {
  if (!col.sortable || state.value.sort !== col.key) return undefined;
  return state.value.desc ? "descending" : "ascending";
}

// Search: wait until the user stops typing (300 ms) before asking the API.
const searchInput = ref(state.value.search);
let searchTimer: ReturnType<typeof setTimeout> | undefined;
function flushSearch() {
  clearTimeout(searchTimer);
  searchTimer = undefined;
  const term = searchInput.value.trim();
  if (term !== state.value.search) update({ search: term, page: 1 });
}
function onSearchInput() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(flushSearch, 300);
}
// The URL changed from outside (menu link, back button): show its search.
watch(
  () => state.value.search,
  (term) => {
    if (!searchTimer && term !== searchInput.value.trim()) searchInput.value = term;
  }
);
onBeforeUnmount(() => clearTimeout(searchTimer));

// The requested page didn't exist and the first one was shown: fix the URL.
watch(
  () => data.value?.page,
  (shown) => {
    if (import.meta.client && shown && shown !== state.value.page) update({ page: shown });
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.adetable {
  margin: 20px auto;
  width: 90% !important;
  max-width: 1000px;
  display: block;
  overflow-x: auto;
  transition: opacity 0.2s;
  &.is-loading {
    opacity: 0.55;
  }
  th {
    text-align: left;
  }
  td {
    text-align: left;
    width: 20%;
    :deep(a) {
      &:hover {
        color: $color-main-second;
      }
    }
  }
  td.main-column {
    font-weight: 900;
  }
  td.small-column {
    font-size: 0.9rem;
  }
  td.table-message {
    width: auto;
    text-align: center;
    color: #777;
  }
}
.sort-button {
  font: inherit;
  color: inherit;
  text-align: inherit;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  &:hover {
    color: $color-main-second;
  }
}
</style>
