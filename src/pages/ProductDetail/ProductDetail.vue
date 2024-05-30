<script setup lang="ts">
import useGetProductDetail from "@/hooks/useGetProductDetail";
import { useProductDetailStore } from "@/stores/productDetail";
import { storeToRefs } from "pinia";
import DetailTop from "./_components/DetailTop.vue";
import DetailBody from "./_components/DetailBody.vue";
import { provide } from "vue";

const { status } = useGetProductDetail();

const p = useProductDetailStore();
const { productDetail } = storeToRefs(p);

const classes = {
   title: "text-[24px] font-[500] mb-[14px]",
   sectionSpace: "mt-[40px]",
};

provide("classes", classes);
</script>
<template>
   <template v-if="status === 'error'">
      <p class="text-center h-[400px]">Some thing went wrong ¯\_(ツ)_/¯</p>
   </template>
   <template v-else>
      <DetailTop :loading="status === 'loading'" :product="productDetail" />
      <DetailBody :loading="status === 'loading'" :product="productDetail" />
   </template>
</template>
