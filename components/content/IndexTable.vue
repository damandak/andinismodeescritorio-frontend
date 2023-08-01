<template>
  <table class="adetable">
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="col.field"
          @click="changeOrder(col.field)"
        >
          {{ col.label }}
          <BodyOrderSwitch
            v-if="col.sortable"
            :orderField="col.field"
            :currentOrderField="order_field"
            :currentOrderDirection="order_direction"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data" :key="row.id">
        <td v-for="col in columns" :key="col.field" :class="col.class">
          <div v-if="col.formatter_html" v-html="col.formatter(row)"></div>
          <NuxtLink v-else-if="col.link" :to="col.link(row)">
            {{ col.formatter ? col.formatter(row) : row[col.field] }}
          </NuxtLink>
          <span v-else-if="col.is_boolean && row[col.field] === true">
            <font-awesome-icon icon="circle-check" />
          </span>
          <span v-else-if="col.is_boolean && row[col.field] === false">
            no
          </span>
          <span v-else>{{
            col.formatter ? col.formatter(row) : row[col.field]
          }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  order_field: {
    type: String,
    required: true,
  },
  order_direction: {
    type: String,
    required: true,
  },
  changeOrder: {
    type: Function,
    required: true,
  },
  reloadMethod: {
    type: Function,
    required: false,
  },
});
</script>
<style scoped lang="scss">
.adetable {
  margin: 20px auto;
  width: 90% !important;
  max-width: 1000px;
  display: block;
  overflow-x: auto;
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
}
</style>
