<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ref, watch, watchEffect } from "vue";
import Slider from "@/components/Slider.vue";
import Button from "@/components/ui/Button.vue";
import useProduct from "@/composables/useProducts";
import { useProductStore } from "@/stores/product";
import { storeToRefs } from "pinia";
import ProductItem from "@/components/ProductItem/ProductItem.vue";
import BranList from "@/components/BrandList/BranList.vue";

const count = ref(0);

const productStore = useProductStore();
const { products } = storeToRefs(productStore);
const { getProduct } = useProduct();

watch(
   () => 0,
   () => {
      getProduct(1, 1, { replace: true });
   },
   {
      immediate: true,
   }
);
</script>

<template>
   <Slider />
   <div class="mt-[30px] flex">
      <div class="w-[2/3]">
         <BranList />
         <div class="flex flex-wrap mt-[8px] mx-[8px]">
            <template v-for="product in products">
               <div class="w-[1/3] px-[8px] mt-[8px]">
                  <ProductItem :product="product" />
               </div>
            </template>
         </div>
      </div>
   </div>
</template>
