<script lang="ts" setup>
import useCategory from "@/composables/useCategory";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import CategoryList from "./CategoryList.vue";
import BrandList from "./BrandList.vue";
import { watch } from "vue";

const { status, getCategories } = useCategory();
watch(
   () => 0,
   () => {
      getCategories();
   },
   {
      immediate: true,
   }
);
</script>

<template>
   <template v-if="status === 'loading'">
      <ArrowPathIcon class="w-[24px] animate-spin" />
   </template>
   <template v-else>
      <p v-if="status === 'error'">Some thing went wrong</p>
      <template v-else>
         <CategoryList />
         <div class="mt-[30px]">
            <BrandList />
         </div>
      </template>
   </template>
</template>
