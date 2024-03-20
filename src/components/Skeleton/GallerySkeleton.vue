<script lang="ts" setup></script>

<template>
   <div v-for="key in [...Array(18).keys()]" class="w-1/6 px-[4px] mt-[8px]">
      <Skeleton className="pt-[100%]" />
   </div>
</template>
