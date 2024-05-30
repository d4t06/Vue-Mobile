<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";
import { HomeIcon } from "@heroicons/vue/24/outline";

const classes = {
   btnContainer: "!absolute z-[99] bottom-[15px] left-[15px] h-[36px] w-[36px] ",
};
</script>

<template>
   <div className="relative h-screen w-screen bg-[#f0f4f9]">
      <div class="flex h-full">
         <RouterView />
      </div>
      <Button colors="third" href="/" :className="classes.btnContainer" variant="push" size="clear">
         <HomeIcon class="w-[22px]" />
      </Button>
   </div>
</template>
