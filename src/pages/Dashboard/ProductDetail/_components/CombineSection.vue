<script setup lang="ts">
import { useProductDetailStore } from "@/stores/productDetail";
import { storeToRefs } from "pinia";
import { inject } from "vue";
import CombineItem from "./child/CombineItem.vue";
import Table from "@/components/ui/Table/Table.vue";

const classes = inject("classes") as Record<string, string>;

const p = useProductDetailStore();
const { productDetail } = storeToRefs(p);
</script>
<template>
   <template v-if="productDetail" >
      <h5 :class="classes.label">Price & Quantity</h5>
      <!-- <div :class="`${classes.group}`"> -->
         <Table
            v-if="!!productDetail.storages.length && !!productDetail.colors.length"
            :col-list="['Name', 'Quantity', 'Price', '']"
         >
            <template v-for="(storage, index) in productDetail.storages">
               <template v-for="color in productDetail.colors">
                  <CombineItem :storageIndex="index" :storage="storage" :color="color" />
               </template>
            </template>
         </Table>

         <p v-else class="text-center">¯\_(ツ)_/¯</p>
      <!-- </div> -->
   </template>
</template>
