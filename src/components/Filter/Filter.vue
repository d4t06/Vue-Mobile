<script lang="ts" setup>
import { computed } from "vue";
import useProduct from "@/hooks/useProducts";
import BrandFilterSkeleton from "../Skeleton/BrandFilterSkeleton.vue";
import useFilterAction from "@/hooks/useFilterAction";
import BrandItem from "./BrandItem.vue";
import useCurrentCategory from "@/hooks/useCurrentCategory";
import PriceFilterSkeleton from "../Skeleton/PriceFilterSkeleton.vue";
import PriceItem from "./PriceItem.vue";

const { isFetching } = useProduct();
const { getBrandsByCategory, getPricesByCategory, status } = useCurrentCategory();

const { handleToggle } = useFilterAction();

const brandsByCategory = computed(() => getBrandsByCategory());
const pricesByCategory = computed(() => getPricesByCategory());
</script>

<template>
   <div class="filter-section">
      <h5 class="filter-title">Brand</h5>

      <div :class="`filter-list ${isFetching ? 'disable' : ''}`">
         <template v-if="status == 'loading'">
            <BrandFilterSkeleton v-for="key in [...Array(5).keys()]" :key="key"/>
         </template>
         <template v-else>
            <BrandItem :toggle="() => handleToggle({ variant: 'brand', value: 'clear' })" />

            <template v-for="brand in brandsByCategory">
               <BrandItem
                  :toggle="() => handleToggle({ variant: 'brand', value: brand })"
                  :brand="brand"
               />
            </template>
         </template>
      </div>
   </div>

   <div class="filter-section">
      <h4 class="filter-title">Prices</h4>

      <div :class="`filter-list price ${isFetching ? 'disable' : ''}`">
         <template v-if="status == 'loading'">
            <PriceFilterSkeleton v-for="key in [...Array(5).keys()]" :key="key" />
         </template>
         <template v-else>
            <PriceItem :toggle="() => handleToggle({ variant: 'price', value: 'clear' })" />

            <template v-for="price in pricesByCategory">
               <PriceItem
                  :toggle="() => handleToggle({ variant: 'price', value: price})"
                  :priceRange="price"
               />
            </template>
         </template>
      </div>
   </div>
</template>

<style lang="scss" scoped>
@import url("./Filter.module.scss");
</style>