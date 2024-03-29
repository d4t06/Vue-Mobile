<script lang="ts" setup>
import type { Brand, PriceRange } from "@/types";
import { TrashIcon } from "@heroicons/vue/24/outline";

type PriceItem = {
   type: "filter";
   price: PriceRange;
   onClick: () => void;
};

type BrandItem = {
   type: "brand";
   brand: Brand;
   onClick: () => void;
};

type Props = PriceItem | BrandItem;
const { props } = defineProps<{ props: Props }>();
</script>
<template>
   <div :onClick="props.onClick" class="selected-item" key="{index}">
      <p>{{ props.type === "brand" ? props.brand.brand_name : props.price.label }}</p>
      <TrashIcon class="w-[24px]" />
   </div>
</template>
<style lang="scss" scoped>
@import url(./BrandList.module.scss);
</style>
