<script setup lang="ts">
import { ref, watch } from "vue";
import Slider from "@/components/Slider.vue";
import { useProductStore } from "@/stores/product";
import { storeToRefs } from "pinia";
import ProductItem from "@/components/ProductItem/ProductItem.vue";

const count = ref(0);

const productStore = useProductStore();
const { products } = storeToRefs(productStore);

watch(
   () => 0,
   () => {
      // getProduct({},{replace: true});
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
         <div class="flex flex-wrap mt-[12px] mx-[8px]">
            <template v-for="product in products">
               <div class="w-[1/3] px-[8px] mt-[8px]">
                  <ProductItem :product="product" />
               </div>
            </template>
         </div>
      </div>
   </div>
</template>
