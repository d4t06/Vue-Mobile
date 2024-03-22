<script lang="ts" setup>
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { type VariantProps, cva } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "vue";
import { RouterLink } from "vue-router";

const classes = {
   primary: "text-white rounded-[6px]  hover:brightness-90 text-[14px] bg-[#cd1818]",
   push: 'active:translate-y-[2px] active:before:shadow-none before:z-[-1] before:border-[2px]  before:absolute before:content-[""]  before:inset-0 ',
   active: "translate-y-[2px] before:shadow-none",
};

const ButtonVariant = cva(
   "inline-flex justify-center items-center disabled:opacity-[.6] relative  z-0",
   {
      variants: {
         variant: {
            primary: classes.primary,
            push: classes.push,
            clear: "",
         },
         size: {
            primary: "px-[20px] py-[4px]",
            full: "w-full py-[4px]",
            clear: "",
         },
         rounded: {
            primary: "before:rounded-[8px] rounded-[8px]",
            lg: "before:rounded-[12px] rounded-[12px]",
            max: "before:rounded-[99px] rounded-[99px]",
         },
         colors: {
            primary:
               "before:bg-[#cd1818] before:border-[#a40000] text-[#fff] before:shadow-[0_2px_0_#a40000]",
            secondary:
               "before:bg-[#f6f6f6] before:border-[#ccc] text-[#000] before:shadow-[0_2px_0_#ccc]",
            clear: "",
         },
      },

      // before:shadow-[0_4px_0_#9e010d]
      defaultVariants: {
         variant: "primary",
         size: "primary",
         rounded: "primary",
         colors: "primary",
      },
   }
);

interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
   href?: string;
   active?: string;
   loading?: boolean;
   className?: string;
   variant?: "primary" | "push" | "clear" | null | undefined;
   size?: "primary" | "full" | "clear" | null | undefined;
   rounded?: "primary" | "lg" | "max" | null | undefined;
   colors?: "primary" | "clear" | "secondary" | null | undefined;
   rest?: Partial<ButtonHTMLAttributes>;
}

const { href, variant, colors, className, loading, rounded, ...rest } = defineProps<ButtonProps>();
</script>

<template>
   <RouterLink
      v-if="href"
      v-bind="rest"
      :to="href"
      :class="ButtonVariant({ variant, size, rounded, colors, className })"
   >
      <slot />
   </RouterLink>

   <template v-else>
      <button
         v-bind="rest"
         :class="`${ButtonVariant({ variant, size, rounded, colors, className })} ${active ? classes.active + ' ' + active : ''}`"
      >
         <template v-if="loading">
            <ArrowPathIcon class="w-[24px] animate-spin" />
         </template>
         <template v-else>
            <slot />
         </template>
      </button>
   </template>
</template>
