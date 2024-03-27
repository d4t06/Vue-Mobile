<script lang="ts" setup>
import Skeleton from './Skeleton.vue';

const {className} = defineProps<{className?: string}>()

</script>

<template>
   <div v-for="key in [...Array(6).keys()]" :key="key" class="w-1/3 px-[4px] mt-[8px]">
      <Skeleton :className="`min-h-[310px] ${className}`" />
   </div>
</template>
