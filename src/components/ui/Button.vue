<script lang="ts" setup>
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { cva } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "vue";
import { RouterLink } from "vue-router";

const classes = {
   primary: "text-white rounded-[6px]  hover:brightness-90 text-[14px] bg-[#cd1818]",
   push: 'active:translate-y-[2px] active:before:shadow-none before:z-[-1]  before:absolute before:content-[""]  before:inset-0 ',
   active: "translate-y-[2px] before:shadow-none text-[#cd1818] font-[500]",
};

const ButtonVariant = cva(
   "inline-flex justify-center items-center disabled:opacity-[.6] disabled:pointer-events-none relative  z-0",
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
            clear: "",
         },
         colors: {
            primary:
               "before:bg-[#cd1818] before:border-[#a00000] text-[#fff] before:shadow-[0_2px_0_#a00000]",
            secondary:
               "before:bg-[#f6f6f6] before:border-[#e1e1e1] text-[#333] before:shadow-[0_2px_0_#e1e1e1]",
            third: "before:bg-[#fff] before:border-[#cd1818] text-[#333] before:shadow-[0_2px_0_#cd1818]",
            clear: "",
         },
         hover: {
            brightness: "hover:brightness-[.90]",
            scale: "transition-transform hover:scale-[1.05]",
            clear: "",
         },
         border: {
            primary: "before:border-[2px]",
            thin: "before:border-[1px] before:border-b-[2px]",
            clear: "before:border-b-[2px]",
         },
      },

      // before:shadow-[0_4px_0_#9e010d]
      defaultVariants: {
         variant: "primary",
         size: "primary",
         rounded: "primary",
         colors: "primary",
         hover: "clear",
         border: "primary",
      },
   }
);

interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
   href?: string;
   active?: boolean;
   loading?: boolean;
   disabled?: boolean;
   className?: string;
   variant?: "primary" | "push" | "clear" | null | undefined;
   size?: "primary" | "full" | "clear" | null | undefined;
   rounded?: "primary" | "lg" | "max" | "clear" | null | undefined;
   hover?: "brightness" | "scale" | "clear" | null | undefined;
   colors?: "primary" | "clear" | "secondary" | "third" | null | undefined;
   border?: "primary" | "clear" | "thin" | null | undefined;
   rest?: Partial<ButtonHTMLAttributes>;
}

const {
   href,
   variant,
   colors,
   size,
   className,
   disabled = false,
   loading = false,
   border,
   hover,
   rounded,
   type = "button",
   ...rest
} = defineProps<ButtonProps>();
</script>

<template>
   <RouterLink
      v-if="href"
      v-bind="rest"
      :to="href"
      :class="ButtonVariant({ variant, size, rounded, colors, border, className })"
   >
      <slot />
   </RouterLink>

   <template v-else>
      <button
         :type="type"
         v-bind="rest"
         :disabled="loading || disabled"
         :class="`${ButtonVariant({
            variant,
            size,
            rounded,
            colors,
            hover,
            border,
            className,
         })} ${active ? classes.active + ' ' + active : ''}`"
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
