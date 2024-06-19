<script lang="ts" setup>
import Skeleton from "./Skeleton.vue";

const { className, count, skeletonClassName } = defineProps<{
   className?: string;
   count: number;
   skeletonClassName?: string;
}>();
</script>

<template>
   <div
      v-for="key in [...Array(count).keys()]"
      :key="key"
      :class="`w-1/2 sm:w-1/3 px-[4px] mt-[8px] ${className || ''}`"
   >
      <Skeleton :className="`min-h-[320px] ${skeletonClassName || ''}`" />
   </div>
</template>
