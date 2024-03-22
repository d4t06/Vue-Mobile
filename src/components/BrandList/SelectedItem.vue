<script lang="ts" setup>
import type { Brand } from "@/types";
import { TrashIcon } from "@heroicons/vue/24/outline";

type Props = {
   brand: Brand;
   onClick: () => void
};
const { brand } = defineProps<Props>();
</script>
<template>
   <div :onClick="onClick" class="selected-item" key="{index}">
      <p>{{ brand.brand_name }}</p>
      <TrashIcon class="w-[24px]" />
   </div>
</template>
<style lang="scss" scoped>
@import url(./BrandList.module.scss);
</style>
