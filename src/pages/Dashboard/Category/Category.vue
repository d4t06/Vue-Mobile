<script lang="ts" setup>
import useCategory from "@/hooks/useCategory";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import CategoryList from "./_components/CategoryList.vue";
import BrandList from "./_components/BrandList.vue";
import PriceRangeList from "./_components/PriceRangeList.vue";
import Attribute from "./_components/Attribute.vue";
import { provide } from "vue";

const { status } = useCategory({ autoGetCategories: true });


const classes = {
   label: "text-[20px] text-[#1f1f1f] font-[500] mb-[8px]",
   flexContainer: "flex mx-[-8px] flex-wrap",
   flexCol: "px-[8px] mt-[16px]",
   group: "rounded-[12px] border border-black/15 p-[20px]",
};

provide("classes", classes);


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
            <Attribute />
         </div>
      </template>
   </template>
</template>
