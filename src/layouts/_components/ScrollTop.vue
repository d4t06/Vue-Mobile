<script setup lang="ts">
import { Button } from "@/components/ui";
import { ChevronUpIcon } from "@heroicons/vue/16/solid";
import { onMounted, ref } from "vue";

const scroll = ref(false);

const scrollToTop = () => {
   setTimeout(() => {
      window?.scroll({
         behavior: "smooth",
         top: 0,
      });
   }, 150);
};

onMounted(() => {
   window.addEventListener("scroll", () => {
      if (window.scrollY > 100) scroll.value = true;
      else scroll.value = false;
   });
});

const classes = {
   container:
      "!fixed z-[99] transition-[border,opacity,transform] bottom-[30px] right-[22px] ",
   button: "p-[4px]",
   show: "opacity-1 translate-y-[0]",
   hide: "opacity-0 translate-y-[30px]",
};
</script>

<template>
   <div :class="`${classes.container} ${scroll ? classes.show : classes.hide}`">
      <Button
         variant="push"
         size="clear"
         colors="third"
         :className="`${classes.button}`"
         :onClick="scrollToTop"
      >
         <ChevronUpIcon class="w-[24px]" />
      </Button>
   </div>
</template>
