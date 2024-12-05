<script setup lang="ts">
import { computed } from "vue";

type Props = {
   attributeId: number;
   product: ProductDetail;
};

const { attributeId, product } = defineProps<Props>();

const foundedCatAttribute = computed(() => {
   return product.category.attributes.find((attr) => attr.id === attributeId);
});

const foundedProAttribute = computed(() =>
   foundedCatAttribute.value
      ? product.attributes
           .find((attr) => attr.category_attribute_id === foundedCatAttribute.value?.id)
           ?.value.split("/n") || []
      : []
);
</script>
<template>
   <tr>
      <td class="w-[40%]">{{ foundedCatAttribute?.attribute_name || "..." }}</td>
      <td class="leading-[1.6]">
         <p v-if="foundedProAttribute.length" v-for="v in foundedProAttribute">{{ v }}</p>
         <p v-else>...</p>
      </td>
   </tr>
</template>

<style lang="scss" scoped>
@import url("./AttributeItem.module.scss");
</style>
