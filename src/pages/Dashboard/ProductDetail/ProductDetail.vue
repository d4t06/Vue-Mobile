<script setup lang="ts">
import NotFoundProduct from "@/components/ProductItem/NotFoundProduct.vue";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { provide } from "vue";
import { storeToRefs } from "pinia";
import SliderSection from "./_components/SliderSection.vue";
import CombineSection from "./_components/CombineSection.vue";
import useGetProductDetail from "@/hooks/useGetProductDetail";
import StorageColor from "./_components/StorageColor.vue";
import Specification from "./_components/Specification.vue";
import DescSection from "./_components/DescSection.vue";
import { useProductDetailStore } from "@/stores/productDetail";

const { status } = useGetProductDetail();
const productDetailStore = useProductDetailStore();

const { productDetail } = storeToRefs(productDetailStore);

const classes = {
   proName: "text-[24px] font-[500]",
   label: "text-[20px] text-[#1f1f1f] font-[500] mb-[8px]",
   flexContainer: "flex mx-[-8px] flex-wrap",
   flexCol: "px-[8px] mt-[16px]",
   group: "rounded-[12px] border border-black/15 p-[20px]",
};

provide("classes", classes);
</script>
<template>
   <ArrowPathIcon v-if="status === 'loading'" class="animate-spin w-[24px]" />
   <NotFoundProduct v-if="status === 'error'" />
   <template v-if="status === 'success'">
      <div v-if="productDetail" class="space-y-[24px] pb-[90px]">
         <h1 :class="classes.proName">{{ productDetail.product_name }}</h1>

         <StorageColor />

         <SliderSection />

         <CombineSection />

         <Specification />

         <DescSection />
      </div>

      <p v-else>Some things went wrong</p>
   </template>
</template>
@/hooks/useGetProductDetail