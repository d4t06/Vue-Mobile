<script lang="ts" setup>
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/vue/16/solid";
import Button from "./ui/Button.vue";
import useSlider from "@/hooks/useSlider";
import {getDisable} from "@/utils/appHelper"

type Props = {
   className?: string;
   autoSlide?: number;
   sliderImages: SliderImage[];
   quantity: number;
};

const props = withDefaults(defineProps<Props>(), {
   className: "",
});

const { next, previous, sliderRef, curIndex } = useSlider({
   sliderImages: props.sliderImages,
   autoSlide: 0,
   quantity: props.quantity,
});

const widthMap: Record<number, string> = {
   1: "w-full",
   2: "w-1/2",
};

const ptMap: Record<number, string> = {
   1: "pt-[60%]",
   2: "pt-[32%]",
};

const classes = {
   container: "whitespace-nowrap overflow-hidden -mx-2",
   button:
     `${getDisable(props.sliderImages.length < curIndex.value)} !absolute top-[50%] translate-y-[-50%] flex items-center justify-center bg-white rounded-[99px] shadow-[1px_2px_8px_rgba(0,0,0,.15)] text-[#999]  z-10 transition-transform hover:scale-[1.05] hover:text-[#333] h-[32px] md:h-[40px] w-[32px] md:w-[40px]`,
   leftArrow: "left-[16px]",
   rightArrow: "right-[16px]",
   sliderItem: `inline-block h-full px-2 ${widthMap[props.quantity]}`,
   imageWrapper: ` ${
      ptMap[props.quantity]
   } relative w-full rounded-[14px] overflow-hidden`,
   // sliderIndex:
   //    "absolute text-white space-x-[2px] text-[12px] bottom-[8px] left-[16px] flex px-[10px] rounded-[99px] bg-black/40",
};
</script>

<template>
   <div :class="`${className} relative`">
      <div :class="classes.container" ref="sliderRef">
         <template v-for="sliderImage in sliderImages">
            <div :class="classes.sliderItem">
               <div :class="classes.imageWrapper">
                  <img
                     :src="sliderImage.image.image_url"
                     alt=""
                     class="w-full object-cover object-center absolute top-0 left-0 h-full"
                  />
               </div>
            </div>
         </template>
      </div>
      <button
         :class="`${classes.button} ${classes.leftArrow}`"
         :onClick="previous"
         :disabled="!sliderImages.length"
      >
         <ArrowLeftIcon class="w-[20px] md:w-[20px]" />
      </button>
      <button
         :class="`${classes.button} ${classes.rightArrow}`"
         :onClick="next"
         :disabled="!sliderImages.length"
      >
         <ArrowRightIcon class="w-[18px] md:w-[20px]" />
      </button>
   </div>
</template>
