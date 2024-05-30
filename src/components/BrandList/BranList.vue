<script lang="ts" setup>
import { computed } from "vue";
import BrandItem from "./BrandItem.vue";
import SelectedItem from "./SelectedItem.vue";
import useFilterAction from "@/hooks/useFilterAction";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import BrandSkeleton from "../Skeleton/BrandSkeleton.vue";
import useCurrentCategory from "@/hooks/useCurrentCategory";


const { getBrandsByCategory, status } = useCurrentCategory();
const { handleToggle, brands, price, isFetching } = useFilterAction();

const isFilter = computed(() => !!brands.value.length || !!price.value);

const brandsByCategory = computed(() => getBrandsByCategory());
</script>

<template>
   <div class="container">
      <div :class="`brand-list ${isFetching ? 'disable' : ''}`">
         <template v-if="isFilter">
            <SelectedItem
               v-for="brand in brands"
               :props="{
                  type: 'brand',
                  onClick: () => handleToggle({ variant: 'brand', value: brand }),
                  brand,
               }"
            />
            <SelectedItem
               v-if="price != null"
               :props="{
                  type: 'filter',
                  onClick: () => handleToggle({ variant: 'price', value: 'clear' }),
                  price,
               }"
            />

            <button
               :onClick="() => handleToggle({ variant: 'clear' })"
               class="hover:text-[#cd1818]"
            >
               <XMarkIcon class="w-[24px]" />
            </button>
         </template>
         <template v-else>
            <BrandSkeleton v-if="status === 'loading'" />
            <BrandItem
               v-else
               v-for="brand in brandsByCategory"
               :onClick="() => handleToggle({ variant: 'brand', value: brand })"
               :brand="brand"
            />
         </template>
      </div>
   </div>
</template>

<style scoped lang="scss">
@import "./BrandList.module.scss";
</style>