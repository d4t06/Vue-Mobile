<script setup lang="ts">
import Button from "../ui/Button.vue";
import { computed } from "vue";
import useFilterAction from "@/hooks/useFilterAction";

type Props = {
   brand?: Brand;
   toggle: () => void;
};

const { brand, toggle } = defineProps<Props>();
const { brands } = useFilterAction();

const active = computed(() =>
   brand
      ? brands.value.findIndex((b) => b.id === brand.id) !== -1
      : !brands.value.length
);

const classes = {
   btn: "py-[3px] px-[12px] text-[15px]",
};
</script>

<template>
   <Button
      size="clear"
      :onClick="toggle"
      :active="active"
      :class="classes.btn"
      variant="push"
      colors="secondary"
      >{{ brand ? brand.brand_name : "All" }}
   </Button>
</template>
