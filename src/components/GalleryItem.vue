<script lang="ts" setup>
type OneSelect = {
   variant: "one";
   onClick: () => void;
   imageUrl: string;
   active: boolean;
};

type MultiSelect = {
   variant: "multiple";
   imageUrl: string;
   chose: () => void;
   select: () => void;
   active: boolean;
   index: number;
};

type Loading = {
   variant: "loading";
   imageUrl: string;
};

type Props = {
   props: OneSelect | MultiSelect | Loading;
};

const { props } = defineProps<Props>();

const imageFrameOnClick = () => {
   switch (props.variant) {
      case "one":
         return props.onClick();
      case "multiple":
         return props.chose();
   }
};

const classes = {
   imageContainer: "relative pt-[100%] cursor-pointer",
   imageFrame:
      "absolute flex  w-full items-center justify-center bg-[#f1f1f1] inset-0 rounded-[8px] border-[2px] border-[#ccc] hover:border-[#cd1818] overflow-hidden",
};
</script>

<template>
   <div class="px-[4px] relative w-1/6 mt-[8px]">
      <div :class="classes.imageContainer">
         <div
            :onClick="imageFrameOnClick"
            :class="`${classes.imageFrame} ${
               props.variant !== 'loading' && props.active ? 'border-[#cd1818]' : ''
            }`"
         >
            <img
               :class="`w-full h-auto ${
                  props.imageUrl.includes('blob') ? 'opacity-[.6]' : ''
               }`"
               :src="props.imageUrl"
               alt="img"
            />

            <template v-if="props.variant === 'multiple'">
               <button
                  :onClick="props.select"
                  :class="`w-[24px] h-[24px] text-white text-[18px] text-center font-[500]  hover:bg-[#cd1818] rounded-[6px] absolute bottom-[10px] left-[10px] ${!!props.index ? 'bg-[#cd1818]' : 'bg-[#ccc]'}`"
               >
                  {{ !!props.index ? props.index : "" }}
               </button>
            </template>

            <slot />
         </div>
      </div>
   </div>
</template>
