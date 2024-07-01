<script setup lang="ts">
import PushFrame from "../ui/PushFrame.vue";
import Skeleton from "./Skeleton.vue";

const NOKey = window.innerWidth <= 767 ? 2 : 3;
</script>
<template>
   <Skeleton className="w-[300px] max-w-full h-[32px] rounded-[6px] mb-[20px]" />
   <PushFrame>
      <Skeleton className="w-[70px] h-[20px] rounded-[6px]" />
      <div class="flex flex-wrap mx-[-4px]">
         <div
            v-for="key in [...Array(NOKey).keys()]"
            :key="key"
            class="w-1/2 md:w-1/3 px-[4px] mt-[8px]"
         >
            <Skeleton className="h-[56px] rounded-[8px]" />
         </div>
      </div>

      <div class="mt-[14px]">
         <Skeleton className="w-[70px] h-[20px] rounded-[6px]" />
         <div class="flex flex-wrap mx-[-4px]">
            <div
               v-for="key in [...Array(NOKey).keys()]"
               :key="key"
               class="w-1/2 md:w-1/3 px-[4px] mt-[8px]"
            >
               <Skeleton className="h-[56px] rounded-[8px]" />
            </div>
         </div>
      </div>

      <div class="space-y-[8px] mt-[20px]">
         <Skeleton className="w-[70px] h-[22px] rounded-[6px] mt-[14px] mb-[6px]" />
         <Skeleton className="w-[200px] h-[42px] sm:h-[47px] rounded-[6px] my-[6px]" />
      </div>
   </PushFrame>

   <Skeleton className="h-[40px] mt-[20px]" />
</template>
