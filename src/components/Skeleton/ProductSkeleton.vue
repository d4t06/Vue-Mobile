<script lang="ts" setup></script>

<template>
   <div v-for="key in [...Array(6).keys()]" :key="key" class="w-1/63 px-[4px] mt-[8px]">
      <Skeleton className="pt-[100%]" />
   </div>
</template>
