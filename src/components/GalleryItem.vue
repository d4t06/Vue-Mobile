<script lang="ts" setup>
type Props = {
   onClick?: () => void;
   imageUrl: string;
   active?: boolean;
};

const { active, imageUrl, onClick } = defineProps<Props>();

const classes = {
   imageContainer: "relative pt-[100%]",
   imageFrame:
      "absolute flex  w-full items-center justify-center bg-[#f1f1f1] inset-0 rounded-[8px] border-[2px] border-[#ccc] hover:border-[#cd1818] overflow-hidden",
};
</script>

<template>
   <div class="px-[4px] relative w-1/6 mt-[8px]">
      <div class="{classes.imageContainer}">
         <div
            :onClick="onClick && onClick"
            :class="`${classes.imageFrame} ${active ? 'border-[#cd1818]' : ''}`"
         >
            <img class="w-full h-auto" :src="imageUrl" alt="img" />
            <slot />
         </div>
      </div>
   </div>
</template>
