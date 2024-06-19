<script lang="ts" setup>
import { PlusIcon } from "@heroicons/vue/24/outline";
import { cva } from "class-variance-authority";

const BoxVariant = cva("", {
   variants: {
      pushAble: {
         primary: "active:border-b-[2px]",
         clear: "",
      },
   },

   defaultVariants: {
      pushAble: "primary",
   },
});

type Props = {
   onClick?: () => void;
   className?: string;
   pushAble?: "primary" | "clear" | null | undefined;
};

const { className, onClick, pushAble } = withDefaults(defineProps<Props>(), {
   className: "pt-[100%]",
});

const classes = {
   container: `group relative overflow-hidden`,
   font: "absolute overflow-hidden border-[2px] border-b-[4px] border-[#ccc] inset-0 flex rounded-[12px] items-center justify-center",
};
</script>

<template>
   <div :onClick="onClick && onClick" :class="`${classes.container} ${className}`">
      <div :class="`${classes.font} ${BoxVariant({ pushAble })}`">
         <template v-if="$slots['children']">
            <slot name="children" />
         </template>
         <template v-else>
            <PlusIcon class="select-none w-[24px]" />
         </template>
      </div>
   </div>
</template>
