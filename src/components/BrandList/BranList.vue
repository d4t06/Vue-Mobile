<script lang="ts" setup>
import useCategory from "@/composables/useCategory";
import { computed } from "vue";
import { useRoute } from "vue-router";
import BrandItem from "./BrandItem.vue";
import SelectedItem from "./SelectedItem.vue";
import useFilterAction from "@/composables/useFilterAction";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import useProduct from "@/composables/useProducts";
import BrandSkeleton from "../Skeleton/BrandSkeleton.vue";

const { categories, status } = useCategory();
const { handleToggle, brands, price, isFetching } = useFilterAction();

const route = useRoute();

const isFilter = computed(() => !!brands.value.length || !!price.value);

const brandsByCategory = computed(() => {
   if (status.value !== "successful") return [];

   const categoryAscii = route.params.categoryAscii;
   if (!categoryAscii) return [];

   const curCategory = categories.value.find((c) => c.category_ascii === categoryAscii);
   return curCategory ? curCategory.brands : [];
});
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
