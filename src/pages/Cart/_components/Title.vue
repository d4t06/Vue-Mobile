<script setup lang="ts">
type Props = {
   className?: string;
};

const { className } = defineProps<Props>();
</script>
<template>
   <div
      :class="`flex space-x-[8px] items-center text-[#cd1818] text-[20px] leading-[1.2]  ${
         className || ''
      }`"
   >
      <slot />
   </div>
</template>
