<script lang="ts" setup>
import Button from "@/components/Button.vue";
import { HomeIcon } from "@heroicons/vue/24/outline";

const classes = {
   btnContainer: "!absolute z-[99] bottom-[15px] left-[15px] h-[44px] w-[44px] ",
};
</script>

<template>
   <div className="relative h-screen w-screen bg-[#f0f4f9]">
      <div class="flex w-full h-full justify-center">
         <RouterView />
      </div>
      <Button :className="classes.btnContainer" size="clear" variant="primary">
         <HomeIcon class="w-[24px]" />
      </Button>
   </div>
</template>
