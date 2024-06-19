<script setup lang="ts">
import { useProductDetailStore } from "@/stores/productDetail";
import { storeToRefs } from "pinia";
import { inject } from "vue";
import MyEditor from "./MyEditor/MyEditor.vue";

const classes = inject("classes") as Record<string, string>;

const p = useProductDetailStore();
const { productDetail } = storeToRefs(p);
</script>

<template>
   <template v-if="productDetail">
      <h5 :class="classes.label">Description</h5>
      <MyEditor classNames="h-[65vh]" :productId="productDetail.id" :content="productDetail.description.content" />
   </template>
</template>
