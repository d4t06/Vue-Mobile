<script setup lang="ts">
import type { PriceRange } from "@/types";
import Button from "../ui/Button.vue";
import { computed } from "vue";
import useFilterAction from "@/composables/useFilterAction";

type Props = {
   priceRange?: PriceRange;
   toggle: () => void;
};

const { priceRange, toggle } = defineProps<Props>();
const { price } = useFilterAction();

const active = computed(() => {
   if (priceRange) return price.value?.id === priceRange?.id;
   else return !price.value;
});

const classes = {
   active: "text-[#cd1818] font-[500] pointer-events-none",
   btn: "py-[3px] px-[12px] text-[15px]",
};
</script>

<template>
   <Button
      size="clear"
      :onClick="active ? () => {} : toggle"
      :active="`${active ? classes.active : ''}`"
      :class="classes.btn"
      variant="push"
      colors="secondary"
      >{{ priceRange ? priceRange.label : "All" }}
   </Button>
</template>
