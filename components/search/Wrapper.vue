<template>
  <div class="search-wrapper" :class="active">
    <client-only>
      <font-awesome-icon
        icon="fa-solid fa-rectangle-xmark"
        class="search__close"
        @click="$emit('closeSearch')"
      />
    </client-only>
    <div class="search-bar" :class="searchbarUp">
      <input
        type="text"
        class="search-input"
        placeholder="Buscar"
        @input="searchTimer"
      />
    </div>
    <div class="search-results" :class="activeSearch">
      <MainstructureLoader v-if="loading" />
      <div v-if="!noItems">
        <div v-if="searchedMountains.length > 0" class="search-results-cerros">
          <div class="search-results-cerros__title">
            <h2 style="margin-top: 0">Cerros</h2>
          </div>
          <div class="search-results-cerros__list">
            <div
              v-for="mtn in searchedMountains"
              :key="mtn.id"
              class="search-results-cerros__list__item"
            >
              <NuxtLink :to="'/cerros/' + mtn.id" @click="$emit('closeSearch')">
                <span class="prefix"
                  ><strong>{{ mtn.prefix }}</strong
                  >{{ " " }}</span
                >
                <span class="name"
                  ><strong>{{ mtn.name }}</strong></span
                >
                <span v-if="mtn.altitude != null" class="altitude"
                  >{{ " - " + formatAltitude(mtn.altitude) }}
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-if="searchedRoutes.length > 0" class="search-results-rutas">
          <div class="search-results-rutas__title">
            <h2>Rutas</h2>
          </div>
          <div class="search-results-rutas__list">
            <div
              v-for="route in searchedRoutes"
              :key="route.id"
              class="search-results-rutas__list__item"
            >
              <NuxtLink
                :to="'/rutas/' + route.id"
                @click="$emit('closeSearch')"
              >
                <span class="name"
                  ><strong>{{ route.name }}</strong
                  >{{ " - " }}</span
                >
                <span class="mountain">{{ route.mountain_name }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-if="searchedAscents.length > 0" class="search-results-ascensos">
          <div class="search-results-ascensos__title">
            <h2>Ascensos</h2>
          </div>
          <div class="search-results-ascensos__list">
            <div
              v-for="asc in searchedAscents"
              :key="asc.id"
              class="search-results-ascensos__list__item"
            >
              <NuxtLink
                :to="'/ascensos/' + asc.id"
                @click="$emit('closeSearch')"
              >
                <span class="name"
                  ><strong>{{ asc.name }}</strong> {{ " - " }}</span
                >
                <span class="route">{{ asc.route_name + " - " }}</span>
                <span class="mountain">{{ asc.mountain_name }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div
          v-if="searchedAndinists.length > 0"
          class="search-results-andinistas"
        >
          <div class="search-results-andinistas__title">
            <h2>Andinistas</h2>
          </div>
          <div class="search-results-andinistas__list">
            <div
              v-for="and in searchedAndinists"
              :key="and.id"
              class="search-results-andinistas__list__item"
            >
              <NuxtLink
                :to="'/andinistas/' + and.id"
                @click="$emit('closeSearch')"
              >
                <span class="name">{{ and.fullname }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="hasSearched && !loading">
        <div class="search-results__noitems">
          <h2>No se encontraron resultados</h2>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const props = defineProps<{
  active: String;
}>();
const emit = defineEmits<{
  closeSearch: () => void;
}>();

const loading = ref(false);

const activeSearch = ref("");
const searchbarUp = ref("");

const searchedMountains = ref([]);
const searchedRoutes = ref([]);
const searchedAscents = ref([]);
const searchedAndinists = ref([]);
const searchedMountainGroups = ref([]);
const searchedArticles = ref([]);

const noItems = ref(true);

var timer: any;
function searchTimer(e: any) {
  loading.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => {
    searchAgain(e);
  }, 300);
}

// Each new search gets a number; answers to older searches are ignored, so
// a slow response can't overwrite the results of what the user typed last.
let lastSearch = 0;
const hasSearched = ref(false);

async function fetchResults(path: string, term: string) {
  const data: any = await $fetch(config.public.apiBase + path, {
    query: { search: term },
  });
  return data?.results ?? [];
}

async function searchAgain(e: any) {
  const term = e.target.value.trim();
  const searchId = ++lastSearch;

  if (term.length === 0) {
    activeSearch.value = "";
    searchbarUp.value = "";
    searchedMountains.value = [];
    searchedRoutes.value = [];
    searchedAscents.value = [];
    searchedAndinists.value = [];
    noItems.value = true;
    hasSearched.value = false;
    loading.value = false;
    return;
  }
  activeSearch.value = "activeSearch";
  searchbarUp.value = "searchbarUp";

  // In parallel; if one category fails the others still show.
  const [mountains, routes, ascents, andinists] = await Promise.allSettled([
    fetchResults("mountains/", term),
    fetchResults("route/table/", term),
    fetchResults("ascent/table/", term),
    fetchResults("andinist/table/", term),
  ]);
  if (searchId !== lastSearch) return;

  const value = (r: PromiseSettledResult<any[]>) =>
    r.status === "fulfilled" ? r.value : [];
  searchedMountains.value = value(mountains);
  searchedRoutes.value = value(routes);
  searchedAscents.value = value(ascents);
  searchedAndinists.value = value(andinists);

  noItems.value =
    searchedMountains.value.length === 0 &&
    searchedRoutes.value.length === 0 &&
    searchedAscents.value.length === 0 &&
    searchedAndinists.value.length === 0;
  hasSearched.value = true;
  loading.value = false;
}
</script>
<style lang="scss">
.search-wrapper {
  position: fixed;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, $color-main-first, $color-main-second);
  z-index: 100;
  transition: all 0.7s ease-in-out;
  opacity: 0.98;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  .search__close {
    color: white;
    font-size: 4rem;
    position: absolute;
    top: 10px;
    right: 15px;
    z-index: 20;
    cursor: pointer;
    transition: all 0.7s ease-in-out;
    &:hover {
      color: $color-main-first;
    }
  }
  .search-bar {
    width: 100%;
    height: 50px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.7s ease-in-out;
    .search-input {
      outline: none;
      color: $color-dark;
      background-color: $color-light;
      border: none;
      padding: 10px 30px;
      font-family: var(--font-serif);
      text-transform: lowercase;
      border-radius: 5px;
      width: 70%;
      max-width: 1500px;
      min-width: 300px;
      height: 47px;
      font-size: 1.2rem;
    }
    &.searchbarUp {
      top: 30px;
      transform: translate(-50%, 0);
    }
  }
  .search-results {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    height: 0;
    bottom: 20px;
    width: 80%;
    background-color: $color-light;
    transition: all 0.7s ease-in-out;
    overflow-y: auto;
    border-radius: 5px;

    box-sizing: border-box;
    a {
      text-decoration: none;
      color: $color-dark;
      display: block;
      padding: 10px 20px;
      border-bottom: 1px solid $color-main-first;
      &:hover {
        background-color: $color-main-first;
        color: white;
      }
    }
  }
  .search-results.activeSearch {
    display: block;
    height: calc(100vh - 150px);
    padding: 15px;
  }
}
.search-wrapper.active {
  left: 0;
}

@media screen and (max-width: 768px) {
  .search-wrapper {
    .search__close {
      top: 5px;
      right: 5px;
      font-size: 2rem;
    }
  }
}
</style>
