<script lang="ts" setup>
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/vue/16/solid";
import Button from "./ui/Button.vue";
import useSlider from "@/hooks/useSlider";

type Props = {
   className?: string;
   autoSlide?: number;
   sliderImages: SliderImage[];
};

const props = withDefaults(defineProps<Props>(), {
   className: "pt-[25%]",
});

const { curIndex, next, previous, sliderRef } = useSlider({
   sliderImages: props.sliderImages,
   autoSlide: 0,
});

const classes = {
   container:
      "absolute inset-0 rounded-[14px] whitespace-nowrap overflow-hidden shadow-[2px_4px_16px_rgba(0,0,0,.15)]",
   button:
      "!absolute top-[50%] translate-y-[-50%] bg-white shadow-[1px_2px_8px_rgba(0,0,0,.15)] text-[#999]  z-10 transition-transform hover:scale-[1.05] hover:text-[#333] h-[32px] md:h-[40px] w-[32px] md:w-[40px]",
   leftArrow: "left-[16px]",
   rightArrow: "right-[16px]",
   sliderItem: "inline-block h-full w-full",
   sliderIndex:
      "absolute text-white space-x-[2px] text-[12px] bottom-[8px] left-[16px] flex px-[10px] rounded-[99px] bg-black/40",
};
</script>

<template>
   <div :class="`${className} relative`">
      <div :class="classes.container" ref="sliderRef">
         <template v-for="sliderImage in sliderImages">
            <div :class="classes.sliderItem">
               <img
                  :src="sliderImage.image.image_url"
                  alt=""
                  class="w-full object-cover object-center"
               />
            </div>
         </template>
      </div>
      <Button
         :class="`${classes.button} ${classes.leftArrow}`"
         :onClick="previous"
         :disabled="!sliderImages.length"
         rounded="max"
         variant="clear"
         size="clear"
         colors="clear"
      >
         <ArrowLeftIcon class="w-[20px] md:w-[20px]" />
      </Button>
      <Button
         :class="`${classes.button} ${classes.rightArrow}`"
         :onClick="next"
         :disabled="!sliderImages.length"
         rounded="max"
         variant="clear"
         colors="clear"
         size="clear"
      >
         <ArrowRightIcon class="w-[18px] md:w-[20px]" />
      </Button>

      <div :class="classes.sliderIndex">
         <span>{{ curIndex }}</span>
         <span> / </span>
         <span>{{ sliderImages?.length || 1 }}</span>
      </div>
   </div>
</template>
@/hooks/useSlider
