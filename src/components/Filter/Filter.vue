<script lang="ts" setup>
import useCategory from "@/composables/useCategory";
import { computed } from "vue";
import { Button } from "@/components/ui";
import useProduct from "@/composables/useProducts";
import BrandFilterSkeleton from "../Skeleton/BrandFilterSkeleton.vue";
import useFilterAction from "@/composables/useFilterAction";
import BrandItem from "./BrandItem.vue";
import useCurrentCategory from "@/composables/useCurrentCategory";

const { isFetching } = useProduct();
const {getBrandsByCategory, status} = useCurrentCategory()

const { handleToggle } = useFilterAction();

const brandsByCategory = computed(() => getBrandsByCategory());
</script>

<template>
   <div class="filter-section">
      <h4 class="filter-title">Brand</h4>

      <div :class="`filter-list ${isFetching ? 'disable' : ''}`">
         <template v-if="status == 'loading'">
            <BrandFilterSkeleton v-for="key in [...Array(5).keys()]" />
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
      <!-- <h4 class="filter-title">Prices</h4> -->

      <!-- <div class="filter-list">
         <template v-if="isFetching">
            <BrandFilterSkeleton v-for="key in [...Array(5).keys()]" />
         </template>
         <template v-else>
            <Button
               size="clear"
               active="text-[#cd1818] font-[500]"
               class="py-[2px] px-[10px]"
               variant="push"
               colors="secondary"
               >All
            </Button>

            <Button
               size="clear"
               active=""
               class="py-[2px] px-[10px]"
               variant="push"
               colors="secondary"
               v-for="brand in brandsByCategory"
               >{{ brand.brand_name }}
            </Button>
         </template>
      </div> -->
   </div>
</template>

<style lang="scss" scoped>
@import url("./Filter.module.scss");
</style>
