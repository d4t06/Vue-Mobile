<script setup lang="ts">
import BranList from "@/components/BrandList/BranList.vue";
import Filter from "@/components/Filter/Filter.vue";
import NotFoundProduct from "@/components/ProductItem/NotFoundProduct.vue";
import ProductItem from "@/components/ProductItem/ProductItem.vue";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton.vue";
import Skeleton from "@/components/Skeleton/Skeleton.vue";
import Slider from "@/components/Slider.vue";
import Sort from "@/components/Sort.vue";
import useCategory from "@/composables/useCategory";
import useProduct from "@/composables/useProducts";
import { computed, watch } from "vue";
import { useRoute } from "vue-router";

// hooks
const route = useRoute();

const { getCurCategory, status: appStatus } = useCategory();
const { getProduct, status: productStatus, count, products } = useProduct();

const curCategory = computed(() => getCurCategory());

const isLoading = computed(
   () => appStatus.value === "loading" || productStatus.value === "loading"
);

watch(
   [route, appStatus],
   () => {
      if (appStatus.value == "loading") return;
      if (!curCategory.value) {
         productStatus.value == "error";
         return;
      }
      getProduct({ page: 0, categoryID: curCategory.value.id }, { replace: true });
   },
   {
      immediate: true,
   }
);
</script>

<template>
   <p v-if="appStatus === 'error'">Some thing went wrong</p>
   <template v-else>
      <Slider />
      <div class="mt-[30px] flex">
         <div class="w-2/3">
            <template v-if="appStatus == 'loading'">
               <Skeleton className="w-[180px] h-[24px] rounded-[4px] mb-[6px]" />
            </template>
            <template v-else>
               <h2 class="mb-[6px] text-[18px]">
                  {{ curCategory?.category_name }} ( {{ count }} ) products
               </h2>
            </template>
            <BranList />
            <Sort />
            <div class="flex flex-wrap mt-[8px] mx-[-8px]">
               <template v-if="isLoading">
                  <ProductSkeleton />
               </template>
               <template v-else>
                  <div v-for="product in products" class="w-1/3 px-[4px] mt-[8px]">
                     <ProductItem :product="product" />
                  </div>

                  <NotFoundProduct v-if="productStatus === 'successful' && !products.length" />
               </template>
            </div>
         </div>
         <div class="w-1/3 pl-[12px]">
            <Filter />
         </div>
      </div>
   </template>
</template>
