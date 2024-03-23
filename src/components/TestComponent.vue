<script setup lang="ts">
const { count } = defineProps<{ count: number }>();

console.log("render in script", count);
</script>

<template>
   {{ console.log("render in template") }}
   <p>child {{ count }}</p>
</template>
