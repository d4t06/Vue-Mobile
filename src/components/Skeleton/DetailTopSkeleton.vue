<script setup lang="ts">
import Skeleton from "./Skeleton.vue";
</script>
<template>
   <Skeleton className="w-[300px] max-w-full h-[32px] rounded-[6px] mb-[14px]" />
   <div class="mt-[30px]">
      <Skeleton className="w-[70px] h-[20px] rounded-[6px]" />
      <div class="flex flex-wrap mx-[-4px]">
         <div
            v-for="key in [...Array(3).keys()]"
            :key="key"
            class="w-1/2 md:w-1/3 px-[4px] mt-[8px]"
         >
            <Skeleton className="h-[56px] rounded-[8px]" />
         </div>
      </div>
   </div>

   <div class="mt-[14px]">
      <Skeleton className="w-[70px] h-[20px] rounded-[6px]" />
      <div class="flex flex-wrap mx-[-4px]">
         <div
            v-for="key in [...Array(3).keys()]"
            :key="key"
            class="w-1/2 md:w-1/3 px-[4px] mt-[8px]"
         >
            <Skeleton className="h-[56px] rounded-[8px]" />
         </div>
      </div>
   </div>

   <div class="space-y-[8px] mt-[20px]">
      <Skeleton className="w-[70px] h-[20px] rounded-[6px] mt-[14px] mb-[6px]" />
      <Skeleton className="w-[200px] h-[34px] rounded-[6px] my-[6px]" />
   </div>
</template>
