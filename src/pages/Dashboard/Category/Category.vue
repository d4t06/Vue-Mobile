<script lang="ts" setup>
import useCategory from "@/composables/useCategory";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import CategoryList from "./CategoryList.vue";
import BrandList from "./BrandList.vue";
import PriceRangeList from "./PriceRangeList.vue";

const { status } = useCategory({ autoGetCategories: true });
</script>

<template>
   <template v-if="status === 'loading'">
      <ArrowPathIcon class="w-[24px] animate-spin" />
   </template>
   <template v-else>
      <p v-if="status === 'error'">Some thing went wrong</p>
      <template v-else>
         <div class="space-y-[30px]">
            <CategoryList />
            <BrandList />
            <PriceRangeList />
         </div>
      </template>
   </template>
</template>
