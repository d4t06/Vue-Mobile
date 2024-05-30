<script setup lang="ts">
import { useProductDetailStore } from "@/stores/productDetail";
import { storeToRefs } from "pinia";
import { computed, inject } from "vue";
import SpecItem from "./child/SpecItem.vue";
import Table from "@/components/ui/Table/Table.vue";

const classes = inject("classes") as Record<string, string>;

const p = useProductDetailStore();
const { productDetail } = storeToRefs(p);

const attributeOrderArray = computed(() =>
   productDetail.value ? productDetail.value.category.attribute_order.split("_") : []
);
</script>
<template>
   <template v-if="productDetail">
      <h5 :class="classes.label">Specification</h5>

      <Table
         v-if="!!productDetail.category.attributes.length"
         :col-list="['Name', 'Value', '']"
      >
         <template v-for="id in attributeOrderArray">
            <SpecItem :orderId="+id" />
         </template>
      </Table>

      <p v-else class="text-center">¯\_(ツ)_/¯</p>
   </template>
</template>
