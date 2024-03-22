<script lang="ts" setup>
import type { Brand } from "@/types";

type Props = {
   brand: Brand;
   onClick: () => void;
};

const { brand, onClick } = defineProps<Props>();
</script>

<template>
   <div :class="`item ${!brand.image_url ? 'no-image' : ''}`" @click="onClick">
      <template v-if="brand.image_url">
         <img :src="brand.image_url" alt="" />
      </template>
      <template v-else>
         <p>
            {{ brand.brand_name }}
         </p>
      </template>
   </div>
</template>
<style lang="scss" scoped>
@import url(./BrandList.module.scss);
</style>
