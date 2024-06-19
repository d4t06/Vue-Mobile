<script setup lang="ts">
import { cva } from "class-variance-authority";

const classes = {
   container: `relative before:absolute before:content-[""] before:inset-0 before:bg-white before:border-[#e1e1e1] before:z-[-1] `,
};

const PushFrameVariant = cva(classes.container, {
   variants: {
      size: {
         primary:
            "before:rounded-[14px] rounded-[14px] before:border-[4px] before:shadow-[0_4px_0_#e1e1e1] p-[14px] active:translate-y-[4px]",
         small: "before:rounded-[8px] rounded-[8px] before:border-[2px] before:shadow-[0_2px_0_#e1e1e1] p-[10px] active:translate-y-[2px]",
      },
      pushAble: {
         primary: "active:before:shadow-none",
         clear: "active:translate-y-[none]",
      },
   },

   defaultVariants: {
      size: "primary",
      pushAble: "primary",
   },
});

type Props = {
   size?: "primary" | "small" | null | undefined;
   pushAble?: "primary" | "clear" | null | undefined;
   className?: string;
};

const { size, pushAble, className } = defineProps<Props>();
</script>

<template>
   <div :class="PushFrameVariant({ size, pushAble, className })">
      <slot />
   </div>
</template>
