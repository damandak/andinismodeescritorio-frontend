<template>
  <div class="filter-section" v-if="filterItems.length > 0">
    <div class="filter" :class="is_active" @click="$emit('selectFilter', id)">
      <p>
        {{ name }}
      </p>
      <div class="arrow-down"></div>
    </div>
    <div v-if="selected_filter" class="select-group">
      <div v-for="item in filterItems">
        <div class="select-item" :class="item.class" @click="toggleSelectItem(item.id)">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { emit } from 'process';
const config = useRuntimeConfig();
const props = defineProps<{
  id: number,
  name: String,
  filter_type: String,
  obj_type: String,
  selected_filter: Boolean,
  apiUrl: String,
}>()
const emit = defineEmits<{
  selectFilter : (id: number) => void,
  changeApiFilter: (id: number, param_string: string) => void,
}>()

const is_active = ref("")

// define a list of objects with id and name
const filterItems : Ref<[{id: number, name: string, class: string}]> = ref([])

if (props.apiUrl != "") {
  const apiURL = config.public.apiBase + props.apiUrl 
  const { data } = await useFetch(apiURL)
  const output = data.value.results
  for (let i = 0; i < output.length; i++) {
    if (props.name == "prefijo") {
      filterItems.value.push({id: output[i].id, name: output[i].prefix, class: "" })
    } else {
      filterItems.value.push({id: output[i].id, name: output[i].name, class: "" })
    }
  }
} else {
  if (props.name == "altura mínima") {
    filterItems.value.push({id: 0, name: "1000", number: 1000, class: "" })
    filterItems.value.push({id: 1, name: "2000", number: 2000, class: "" })
    filterItems.value.push({id: 2, name: "3000", number: 3000, class: "" })
    filterItems.value.push({id: 3, name: "4000", number: 4000, class: "" })
    filterItems.value.push({id: 4, name: "5000", number: 5000, class: "" })
    filterItems.value.push({id: 5, name: "6000", number: 6000, class: "" })
  } else if (props.name == "altura máxima") {
    filterItems.value.push({id: 0, name: "1000", number: 1000, class: "" })
    filterItems.value.push({id: 1, name: "2000", number: 2000, class: "" })
    filterItems.value.push({id: 2, name: "3000", number: 3000, class: "" })
    filterItems.value.push({id: 3, name: "4000", number: 4000, class: "" })
    filterItems.value.push({id: 4, name: "5000", number: 5000, class: "" })
    filterItems.value.push({id: 5, name: "6000", number: 6000, class: "" })
    filterItems.value.push({id: 6, name: "7000", number: 7000, class: "" })
  } else if (props.name == "ascendida") {
    filterItems.value.push({id: 0, name: "Sí", class: "" })
    filterItems.value.push({id: 1, name: "No", class: "" })
  }
}

const selectedItems : Ref<[{id: number, name: string, number: number}]> = ref([])

function toggleSelectItem(id: number) {
  const fullItem = filterItems.value.find(item => item.id === id)
  if (selectedItems.value.includes(fullItem)) {
    selectedItems.value.splice(selectedItems.value.indexOf(fullItem), 1)
    filterItems.value.find(item => item.id === id).class = ""
  } else {
    if (props.name == "altura mínima" || props.name == "altura máxima" || props.name == "ascendida") {
      // only allow one selected item
      selectedItems.value = []
      selectedItems.value.push(fullItem)
      filterItems.value.forEach(item => item.class = "")
      filterItems.value.find(item => item.id === id).class = "active"
    } else {
      // allow multiple selected items
      selectedItems.value.push(fullItem)
      filterItems.value.find(item => item.id === id).class = "active"
    }
  }
  if (selectedItems.value.length > 0) {
    is_active.value = "active"
  } else {
    is_active.value = ""
  }
  emit('changeApiFilter', props.id, selectedItems.value)
}
</script>
<style scoped lang="scss">
.filter {
  height: 50px;
  background: #1bc2ccb3;
  width: 200px;
  border-radius: 15px;
  text-align: center;
  border: solid 3px $color-light;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  &:hover{
    background: $color-dark;
    border: solid 3px $color-light;
    p {
      color: $color-light;
    }
    .arrow-down {
      border-top: 10px solid $color-light;
    }
  }
  p {
    text-transform: uppercase;
    margin: 13px;
    font-weight: 900;
    width: 60%;
    color: $color-light;
  }
  .arrow-down {
    width: 0; 
    height: 0; 
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    
    border-top: 10px solid $color-light;
  }
  &.active {
    background: $color-dark;
    border: solid 3px $color-light;
    p {
      color: $color-light;
    }
    .arrow-down {
      border-top: 10px solid $color-light;
    }
  }
}
.select-group {
  position: absolute;
  top: 105px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .select-item {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    p {
      text-transform: uppercase;
      margin: 13px;
      font-weight: 900;
      color: $color-light;
      box-sizing: border-box;
      border: 2px solid transparent;
    }
    &:hover {
      background: $color-main-second;
      border: solid 2px $color-light;
      box-sizing: border-box;
    }
    &.active {
      background: $color-main-second;
      border: solid 2px $color-light;
      box-sizing: border-box;
    }
  }
}
</style>
