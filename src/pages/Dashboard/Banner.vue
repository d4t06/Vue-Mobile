<script lang="ts" setup>
import useCategory from "@/hooks/useCategory";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

import CategorySliderItem from "./_components/CategorySliderItem.vue";

const { categories, status } = useCategory({ autoGetCategories: true });
</script>
<template>
   <template v-if="status === 'loading'">
      <ArrowPathIcon class="w-[24px] animate-spin" />
   </template>
   <template v-else>
      <h1 class="text-[24px] font-[500] mb-[16px]">Banner</h1>

      <p v-if="status === 'error'">Some thing went wrong</p>
      <template v-else v-for="(category, index) in categories">
         <CategorySliderItem :category="category" :categoryIndex="index" />
      </template>
   </template>
</template>
