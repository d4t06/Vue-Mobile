<script setup lang="ts">
const props = defineProps<{
   count: number;
   product: {
      product: { count: number };
      count: number;
   };
}>();
</script>

<template>
   {{ console.log("render in template", props.product.count) }}
</template>
