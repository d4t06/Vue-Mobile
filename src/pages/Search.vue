<script setup lang="ts">
import NotFoundProduct from "@/components/ProductItem/NotFoundProduct.vue";
import ProductItem from "@/components/ProductItem/ProductItem.vue";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton.vue";
import Skeleton from "@/components/Skeleton/Skeleton.vue";
import Sort from "@/components/Sort.vue";
import { Button } from "@/components/ui";
import useGetProduct from "@/hooks/useGetProduct";
import { useAppStore } from "@/stores/app";
import { useProductStore } from "@/stores/product";
import { storeToRefs } from "pinia";
import { computed, watch } from "vue";
import { useRoute } from "vue-router";

const appStore = useAppStore();
const p = useProductStore();

const { status: productFetching, products, count, isLast, page } = storeToRefs(p);
const { status } = storeToRefs(appStore);

const { getProduct } = useGetProduct();

const route = useRoute();
const q = computed(() => route.params.q || "");

const noHaveProduct = computed(
   () => productFetching.value === "successful" && !products.value.length
);

const handleGetMore = () => {
   getProduct({ page: page.value + 1 }, { more: true });
};

watch(
   [route, status],
   () => {
      if (status.value !== "successful") return;
      if (!q.value) return;

      getProduct({ q: q.value as string }, { replace: true });
   },
   {
      immediate: true,
   }
);
</script>
<template>
   <template v-if="status === 'error' && productFetching === 'error'">
      <p class="text-center">Some thing went wrong</p>
   </template>

   <template v-else>
      <template v-if="!!q">
         <Skeleton
            v-if="status === 'loading'"
            className="h-[36px] w-[300px] max-w-[80vw] rounded-[8px] "
         />

         <h1 v-else class="text-[26px]">Result of '{{ q }}' ({{ count }})</h1>

         <!-- use route param instead of product store -->
         <Sort :additionParams="{ q: q as string }" />

         <div class="mt-[20px]">
            <div class="flex mx-[-4px] mt-[-8px] flex-wrap">
               <NotFoundProduct v-if="noHaveProduct" />

               <template v-if="productFetching !== 'loading'">
                  <div
                     v-for="product in products"
                     class="w-1/2 sm:w-1/4 px-[4px] mt-[8px]"
                  >
                     <ProductItem :product="product" />
                  </div>
               </template>

               <ProductSkeleton
                  :count="4"
                  className="sm:w-1/4"
                  :skeletonClassName="`${
                     productFetching === 'more-loading' ? 'h-full' : ''
                  }`"
                  v-if="
                     productFetching === 'loading' || productFetching === 'more-loading'
                  "
               />
            </div>
         </div>
         <p
            v-if="productFetching !== 'loading' && !noHaveProduct"
            class="text-center mt-[30px]"
         >
            <Button
               variant="push"
               border="thin"
               :loading="productFetching === 'more-loading'"
               :disabled="isLast"
               :onClick="handleGetMore"
            >
               More
            </Button>
         </p>
      </template>

      <template v-else>
         <p class="text-center">Type some thing to search</p>
      </template>
   </template>

   <!-- )} -->
</template>
