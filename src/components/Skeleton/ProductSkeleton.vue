<script lang="ts" setup>
import Skeleton from './Skeleton.vue';

const {className, count} = defineProps<{className?: string, count: number}>()

</script>

<template>
   <div v-for="key in [...Array(count).keys()]" :key="key" class="w-1/2 sm:w-1/3 px-[8px] mt-[16px]">
      <Skeleton :className="`min-h-[310px] ${className}`" />
   </div>
</template>
