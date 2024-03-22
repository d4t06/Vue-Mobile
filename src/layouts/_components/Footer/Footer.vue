<script lang="ts" setup>
import { MapPinIcon, PhoneIcon } from "@heroicons/vue/24/outline";
</script>
<template>
   <div class="container mx-auto footer">
      <div class="rounded-[16px] border-[2px] border-[#ccc]">
         <div class="flex flex-wrap text-[#333] p-[20px]">
            <div class="w-full sm:w-1/2 flex flex-col items-center justify-center">
               <h1 class="text-[26px] leading-[26px] text-[#000] font-[500]">
                  HD <span class="text-[#cd1818]">Mobile</span>
               </h1>
               <i class="text-[16px]">'' Hắc đê mô bồ ''</i>
            </div>
            <div class="flex mt-[30px] md:mt-0 w-full sm:w-1/2">
               <div class="w-1/2 md:w-1/3">
                  <h5>
                     <PhoneIcon class="w-[22px]" />
                     <span> Hotline </span>
                  </h5>

                  <ul class="list">
                     <li>012345689</li>
                     <li>012345689</li>
                  </ul>
               </div>

               <div class="w-1/2 md:w-1/3">
                  <h5>
                     <MapPinIcon class="w-[22px]" />
                     <span> Address </span>
                  </h5>

                  <ul class="list">
                     <li>An Giang Province</li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<style scoped lang="scss">
@import url(./Footer.module.scss);
</style>
