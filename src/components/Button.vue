<script lang="ts" setup>
import { type VariantProps, cva } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "vue";
import { RouterLink } from "vue-router";

const classes = {
   primary: "rounded-[6px]  hover:brightness-90 text-[14px] bg-[#cd1818]",
   push: 'active:translate-y-[4px] active:before:shadow-none before:z-[-1] border-b-[4px] border-transparent  before:absolute before:content-[""] before:bg-[#cd1818] before:inset-0 before:shadow-[0_4px_0_#9e010d] transition-[transform] before:transition-shadow',
};

const ButtonVariant = cva(
   "font-[500] text-white inline-flex disabled:opacity-[.6] relative justify-center items-center z-0",
   {
      variants: {
         variant: {
            primary: classes.primary,
            push: classes.push,
         },
         size: {
            primary: "px-[20px] py-[4px]",
            full: "w-full py-[4px]",
            clear: "",
         },
         rounded: {
            primary: "before:rounded-[8px] rounded-[8px]",
            lg: "before:rounded-[12px] rounded-[12px]",
         },
      },
      defaultVariants: {
         variant: "primary",
         size: "primary",
         rounded: "primary",
      },
   }
);

interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
   href?: string;
   loading?: boolean;
   className?: string;
   disable?: boolean;
   variant?: "primary" | "push" | null | undefined;
   size?: "primary" | "full" | "clear" | null | undefined;
   rounded?: "primary" | "lg" | null | undefined;
}

const { href, variant, size, className, loading, disable, rounded, ...rest } =
   defineProps<ButtonProps>();
</script>

<template>
   <RouterLink
      v-if="href"
      v-bind="rest"
      :to="href"
      :class="ButtonVariant({ variant, size, className })"
   >
      <span><slot /></span>
   </RouterLink>

   <button v-else v-bind="rest" :class="ButtonVariant({ variant, size, className })">
      <span><slot /></span>
   </button>
</template>
