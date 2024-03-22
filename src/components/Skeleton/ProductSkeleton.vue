<script lang="ts" setup>
import Skeleton from './Skeleton.vue';
</script>

<template>
   <div v-for="key in [...Array(6).keys()]" :key="key" class="w-1/3 px-[4px] mt-[8px]">
      <Skeleton className="h-[310px]" />
   </div>
</template>
