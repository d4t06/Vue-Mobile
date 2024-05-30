<script setup lang="ts">
import { useProductDetailStore } from "@/stores/productDetail";
import { storeToRefs } from "pinia";
import { inject } from "vue";
import SliderItem from "./child/SliderItem.vue";

const classes = inject("classes") as Record<string, string>;

const p = useProductDetailStore();
const { productDetail } = storeToRefs(p);
</script>

<template>
   <template v-if="productDetail">
      <h5 :class="classes.label">Slider</h5>
      <div class="space-y-[16px]">
         <div :class="`${classes.group} space-y-[40px]`">
            <SliderItem
               v-if="!!productDetail.colors.length"
               v-for="(color, index) in productDetail.colors"
               :color="color"
               :index="index"
            />

            <p v-else class="text-center">¯\_(ツ)_/¯</p>
         </div>
      </div>
   </template>
</template>
