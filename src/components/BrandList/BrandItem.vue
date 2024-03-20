<script lang="ts" setup>
import type { Brand } from "@/types";

type Props = {
   brand: Brand;
};

const { brand } = defineProps<Props>();

const classes = {
   brandName: "text-[16px] md:text-[18px] font-[500]",
};
</script>

<template>
   <div class="sort-item" @click="() => {}">
      <template v-if="brand.image_url">
         <img :src="brand.image_url" alt="" />
      </template>
      <template>
         <p :class="classes.brandName">
            {{ brand.brand_name }}
         </p>
      </template>
   </div>
</template>
<style lang="scss" scoped>
@import url(./BrandList.module.scss);
</style>
