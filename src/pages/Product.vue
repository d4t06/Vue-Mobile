<script setup lang="ts">
import BranList from "@/components/BrandList/BranList.vue";
import Filter from "@/components/Filter/Filter.vue";
import NotFoundProduct from "@/components/ProductItem/NotFoundProduct.vue";
import ProductItem from "@/components/ProductItem/ProductItem.vue";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton.vue";
import Skeleton from "@/components/Skeleton/Skeleton.vue";
import Slider from "@/components/Slider.vue";
import Sort from "@/components/Sort.vue";
import Button from "@/components/ui/Button.vue";
import useCategory from "@/composables/useCategory";
import useGetProduct from "@/composables/useGetProduct";
import useProduct from "@/composables/useProducts";
import useCurrentCategory from "@/composables/useCurrentCategory";
import { computed, watch } from "vue";
import { useRoute } from "vue-router";

// hooks
const route = useRoute();

const { status: appStatus } = useCategory();
const { status: productStatus, count, products, isLast, isFetching, page } = useProduct();
const { getProduct } = useGetProduct();
const { getCurCategory } = useCurrentCategory();

const isReplaceLoading = computed(
   () => appStatus.value === "loading" || productStatus.value == "loading"
);

const isGetMoreLoading = computed(() => productStatus.value == "more-loading");

const handleGetMore = () => {
   getProduct({ page: page.value + 1 }, { more: true });
};

const curCategory = computed(() => getCurCategory());

watch(
   [route, appStatus],
   () => {
      if (appStatus.value == "loading") return;
      getProduct({ categoryID: curCategory.value?.id }, { replace: true });
   },
   {
      immediate: true,
   }
);
</script>

<template>
   <p v-if="appStatus === 'error'">Some thing went wrong</p>
   <template v-else>
      <Skeleton v-if="appStatus === 'loading'" className="pt-[25%] !rounded-[16px]" />
      <Slider
         v-else-if="curCategory"
         :sliderImages="curCategory.category_slider.slider.slider_images"
         :key="curCategory.category_ascii"
      />
      <div class="mt-[30px] flex">
         <div class="w-2/3">
            <template v-if="appStatus == 'loading'">
               <Skeleton className="w-[180px] h-[24px] rounded-[4px] mb-[6px]" />
            </template>
            <template v-else>
               <h2 class="mb-[6px] text-[22px] font-[500]">
                  {{ getCurCategory()?.category_name }}
                  <span class="text-[#333] text-[18px]"> ({{ count }} products)</span>
               </h2>
            </template>

            <BranList />
            <Sort />
            <div class="flex flex-wrap mt-[12px] mx-[-8px]">
               <NotFoundProduct v-if="productStatus === 'successful' && !products.length" />

               <template v-if="!isReplaceLoading">
                  <div v-for="product in products" class="w-1/3 px-[4px] mt-[8px]">
                     <ProductItem :product="product" />
                  </div>
               </template>

               <ProductSkeleton
                  :className="`${isGetMoreLoading ? 'h-[100%]' : ''}`"
                  v-if="isReplaceLoading || isGetMoreLoading"
               />
            </div>
            <div class="my-[30px] text-center">
               <Button
                  :onClick="handleGetMore"
                  :class="`${isLast || isFetching ? 'disable' : ''}`"
                  variant="push"
                  >Show more</Button
               >
            </div>
         </div>
         <div class="w-1/3 pl-[12px]">
            <Filter />
         </div>
      </div>
   </template>
</template>
