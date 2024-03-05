<template>
  <div class="filter-wrapper" :class="active">
    <MapFilter
      v-for="filter in filters"
      :key="filter.id"
      :id="filter.id"
      :name="filter.name"
      :apiUrl="filter.apiUrl"
      :filter_type="filter.filter_type"
      :obj_type="filter.obj_type"
      :selected_filter="selected_filter[filter.id]"
      @selectFilter="selectFilter"
      @changeApiFilter="changeApiFilter"
    />
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  active: String;
}>();

const emit = defineEmits<{
  changeFilters: (id: number, param_string: string) => void;
}>();

const filters = ref([
  {
    id: 0,
    name: "prefijo",
    apiUrl: "prefixes/",
    filter_type: "select",
    obj_type: "object",
  },
  {
    id: 1,
    name: "país",
    apiUrl: "countries/?only_andes",
    filter_type: "select",
    obj_type: "object",
  },
  {
    id: 2,
    name: "región",
    apiUrl: "regions/",
    filter_type: "select",
    obj_type: "object",
  },
  {
    id: 3,
    name: "altura mínima",
    apiUrl: "",
    filter_type: "range",
    obj_type: "number",
  },
  {
    id: 4,
    name: "altura máxima",
    apiUrl: "",
    filter_type: "range",
    obj_type: "number",
  },
  {
    id: 5,
    name: "ascendida",
    apiUrl: "",
    filter_type: "select",
    obj_type: "boolean",
  },
]);

const selected_filter = ref([false, false, false, false, false]);

function selectFilter(id: number) {
  selected_filter.value[id] = !selected_filter.value[id];
  for (let i = 0; i < selected_filter.value.length; i++) {
    if (i != id) {
      selected_filter.value[i] = false;
    }
  }
}

const allFilters = ref({
  prefixes: ref<number[]>([]),
  countries: ref<number[]>([]),
  regions: ref<number[]>([]),
  mountain_groups: ref<number[]>([]),
  min_altitude: ref(0),
  max_altitude: ref(9000),
  ascended: ref([false, true]),
});

function changeApiFilter(id: number, param: number[]) {
  if (id == 0) {
    allFilters.value.prefixes = param;
  } else if (id == 1) {
    allFilters.value.countries = param;
  } else if (id == 2) {
    allFilters.value.regions = param;
  } else if (id == 3) {
    if (param.length == 0) {
      allFilters.value.min_altitude = 0;
    } else {
      allFilters.value.min_altitude = param[0].number;
    }
  } else if (id == 4) {
    if (param.length == 0) {
      allFilters.value.max_altitude = 9000;
    } else {
      allFilters.value.max_altitude = param[0].number;
    }
  } else if (id == 5) {
    if (param.length == 0) {
      allFilters.value.ascended = [false, true];
    } else if (param[0].name == "No") {
      allFilters.value.ascended = [false];
    } else if (param[0].name == "Sí") {
      allFilters.value.ascended = [true];
    }
  }
  emit("changeFilters", id, allFilters);
}
</script>
<style scoped lang="scss">
.filter-wrapper {
  position: fixed;
  top: 45px;
  height: 140px;
  width: calc(100vw - 48px);
  left: 24px;
  margin: 9px auto auto auto;
  opacity: 0;
  transition: all 1s ease-in-out;
  background: $color-dark-extreme;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding-top: 30px;
  gap: 20px;
  transform: translateY(-100%);
  border-radius: 10px 10px 0 0;
  border-bottom: solid 5px $color-light;
  &.active {
    opacity: 1;
    transform: translateY(0);
  }
}
@media screen and (max-width: 850px) {
  .filter-wrapper {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    padding-top: 10px;
    border-radius: 0;
    border-bottom: none;
    &.active {
      transform: translateY(0);
    }
  }
}
</style>
