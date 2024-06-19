<script setup lang="ts">
import { ref, watch } from "vue";
import Slider from "@/components/Slider.vue";
import { useProductStore } from "@/stores/product";
import { storeToRefs } from "pinia";
import ProductItem from "@/components/ProductItem/ProductItem.vue";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton.vue";
import { useAppStore } from "@/stores/app";
import NotFoundProduct from "@/components/ProductItem/NotFoundProduct.vue";

import Skeleton from "@/components/Skeleton/Skeleton.vue";
import useGetProduct from "@/hooks/useGetProduct";

const productStore = useProductStore();
const appStore = useAppStore();
const { products, status } = storeToRefs(productStore);

const { getProduct } = useGetProduct();

const sliderImages = ref<SliderImage[]>([]);

const getHomeSliderImages = () => {
   return (
      appStore.categories.find((c) => c.category_name_ascii === "home")?.category_slider
         .slider.slider_images || []
   );
};

watch(
   appStore,
   () => {
      if (appStore.status === "loading") return;
      const homeSliderImages = getHomeSliderImages();
      sliderImages.value = homeSliderImages;
   },
   {
      immediate: true,
   }
);

watch(
   appStore,
   () => {
      if (appStore.status === "loading") return;
      getProduct({ size: 4 }, { replace: true });
   },
   {
      immediate: true,
   }
);
</script>

<template>
   <Skeleton v-if="appStore.status === 'loading'" className="pt-[25%] !rounded-[16px]" />
   <Slider v-else :sliderImages="sliderImages" :key="sliderImages.length" />
   <div class="mt-[30px]">
      <h2 class="text-[18px] md:text-[22px] font-[500] text-[#333]">New Products</h2>

      <div class="flex flex-wrap mt-[12px] mx-[-4px]">
         <ProductSkeleton className="sm:w-1/4" :count="8" v-if="status === 'loading'" />

         <template v-else-if="!!products.length">
            <div v-for="product in products" class="w-1/2 sm:w-1/4 px-[4px] mt-[8px]">
               <ProductItem :product="product" />
            </div>
         </template>
         <NotFoundProduct v-else />
      </div>
   </div>
</template>
