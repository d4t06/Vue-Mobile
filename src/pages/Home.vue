<script setup lang="ts">
import { ref, watch } from "vue";
import Slider from "@/components/Slider.vue";
import { useProductStore } from "@/stores/product";
import { storeToRefs } from "pinia";
import ProductItem from "@/components/ProductItem/ProductItem.vue";
import useGetProduct from "@/composables/useGetProduct";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton.vue";
import TestComponent from "@/components/TestComponent.vue";

const productStore = useProductStore();
const { products, status } = storeToRefs(productStore);

const { getProduct } = useGetProduct();
const count  = ref(0)

watch(
   () => 0,
   () => {
      getProduct({}, { replace: true });
   },
   {
      immediate: true,
   }
);
</script>

<template>
   <Slider />
   <div class="mt-[30px]">
      <h2 class="text-[22px]">New Products</h2>
      <TestComponent :count="count" />
      <button :onClick="() => count = Math.random() * 10"> set count {{ count }}</button>
      <div class="flex flex-wrap mt-[12px] mx-[-8px]">
         <ProductSkeleton v-if="status === 'loading'" />

         <template v-for="product in products">
            <div class="w-1/4 px-[8px] mt-[8px]">
               <ProductItem :product="product" />
            </div>
         </template>
      </div>
   </div>
</template>
