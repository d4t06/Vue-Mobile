<script lang="ts" setup>
import type { Brand } from "@/types";

type Props = {
   brand: Brand;
};
const { brand } = defineProps<Props>();
</script>
<template>
   <div class="selected-item" key="{index}">
      <p>{{ brand.brand_name }}</p>
      <TrashIcon className="w-[24px]" />
   </div>
</template>
<style lang="scss" scoped>
@import url(./BrandList.module.scss);
</style>
