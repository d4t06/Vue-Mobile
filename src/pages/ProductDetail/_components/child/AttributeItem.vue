<script setup lang="ts">
import { computed } from "vue";

type Props = {
   attributeId: number;
   product: Product;
};

const { attributeId, product } = defineProps<Props>();

const foundedCatAttribute = computed(() => {
   return product.category.attributes.find((attr) => attr.id === attributeId);
});

const foundedProAttribute = computed(() =>
   foundedCatAttribute.value
      ? product.attributes.find(
           (attr) => attr.category_attribute_id === foundedCatAttribute.value?.id
        )
      : undefined
);
</script>
<template>
   <tr>
      <td class="w-[40%]">{{ foundedCatAttribute?.attribute || "..." }}</td>
      <td class="leading-[1.6]">{{ foundedProAttribute?.value || "..." }}</td>
   </tr>
</template>


<style lang="scss" scoped>
@import url("./style.scss");
</style>