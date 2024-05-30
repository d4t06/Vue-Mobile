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
   button:
      "!fixed border-[#cd1818] bg-[#fff] border-[2px] border-b-[4px] active:border-b-[2px] hover:border-b-[5px] z-[99] transition-[border,opacity,transform] p-[4px] bottom-[30px] right-[22px] ",
   show: "opacity-1 translate-y-[0]",
   hide: "opacity-0 translate-y-[30px]",
};
</script>

<template>
   <Button
      variant="clear"
      size="clear"
      colors="clear"
      :className="`${classes.button} ${scroll ? classes.show : classes.hide}`"
      :onClick="scrollToTop"
   >
      <ChevronUpIcon class="w-[24px]" />
   </Button>
</template>
