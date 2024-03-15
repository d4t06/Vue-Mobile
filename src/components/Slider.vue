<script lang="ts" setup>
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/vue/24/outline";
import Button from "./Button.vue";

type Props = {
   className?: string;
   autoSlider?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
   className: "pt-[25%]",
   autoSlider: true,
});

console.log(">>> check props", props.className);

const classes = {
   container: "absolute inset-0 rounded-[24px] bg-[#f1f1f1]",
   button:
      "!absolute top-[50%] translate-y-[-50%] bg-white text-[#ccc] opacity-60 hover:opacity-[1] h-[40px] w-[40px] rounded-[50%]",
   leftArrow: "left-[16px]",
   rightArrow: "right-[16px]",
};
</script>

<template>
   <div :class="`${props.className} relative`">
      <div :class="classes.container">
         <!-- loop here -->
      </div>
      <Button :class="`${classes.button} ${classes.leftArrow}`" variant="clear" size="clear">
         <ArrowLeftIcon class="w-[20px]" />
      </Button>
      <Button :class="`${classes.button} ${classes.rightArrow}`" variant="clear" size="clear">
         <ArrowRightIcon class="w-[20px]" />
      </Button>
   </div>
</template>
