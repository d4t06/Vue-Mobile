<script setup lang="ts">
import BranList from "@/components/BrandList/BranList.vue";
import Filter from "@/components/Filter/Filter.vue";
import ProductItem from "@/components/ProductItem/ProductItem.vue";
import Slider from "@/components/Slider.vue";
import useProduct from "@/composables/useProducts";
import { useAppStore } from "@/stores/app";
import { useProductStore } from "@/stores/product";
import type { Category } from "@/types";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

// hooks
const route = useRoute();
const appStore = useAppStore();
const productStore = useProductStore();

const { status: appStatus } = storeToRefs(appStore);
const { products } = storeToRefs(productStore);
const { getProduct, status } = useProduct();

watch(
   [route, appStatus],
   () => {
      if (appStatus.value == "loading") return;

      getProduct(1, 1, { replace: true });
   },
   {
      immediate: true,
   }
);
</script>

<template>
   <p v-if="appStatus === 'error'">Some thing went wrong</p>
   <div class="mt-[30px]">
      <Slider />
   </div>
   <div class="mt-[30px] flex">
      <div class="w-2/3">
         <BranList />
         <div class="flex flex-wrap mt-[8px] mx-[8px]">
            <template v-if="status == 'loading'"> loading </template>
            <template v-else>
               <div v-for="product in products" class="w-1/3 px-[8px] mt-[8px]">
                  <ProductItem :product="product" />
               </div>
            </template>
         </div>
      </div>
      <div class="1/3">
         <Filter />
      </div>
   </div>
</template>
