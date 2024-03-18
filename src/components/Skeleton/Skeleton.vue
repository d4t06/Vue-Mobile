<script lang="ts" setup>
type Props = {
   className: string;
};

const { className } = defineProps<Props>();
</script>

<template>
   <div :class="`animate-pulse bg-[#f1f1f1] duration-[.1s] rounded-[6px] ${className}`"></div>
</template>
