<script lang="ts" setup>
import useCategory from "@/composables/useCategory";
import { computed } from "vue";
import { useRoute } from "vue-router";
import BrandItem from "./BrandItem.vue";
import SelectedItem from "./SelectedItem.vue";
import useFilterAction from "@/composables/useFilterAction";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import BrandSkeleton from "../Skeleton/BrandSkeleton.vue";
import useCurrentCategory from "@/composables/useCurrentCategory";

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
               :onClick="() => handleToggle({ variant: 'brand', value: brand })"
               :brand="brand"
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
