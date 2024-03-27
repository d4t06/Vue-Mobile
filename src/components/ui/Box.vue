<script lang="ts" setup>
import { PlusIcon } from "@heroicons/vue/24/outline";

type Props = {
   onClick?: () => void;
   className?: string;
};

const { className, onClick } = withDefaults(defineProps<Props>(), {
   className: 'pt-[100%]'
})

const classes = {
   container: `group relative rounded-[12px] border border-[#ccc] overflow-hidden bg-[#f1f1f1]`,
   font: "absolute border-[2px] overflow-hidden border-b-[6px] active:border-b-[2px]  transition-[border] border-[#ccc] inset-0 flex rounded-[12px] items-center justify-center",
};
</script>

<template>
   <div :onClick="onClick && onClick" :class="`${classes.container} ${className}`">
      <div :class="`${classes.font} `">
         <template v-if="$slots['children']">
            <slot name="children" />
         </template>
         <template v-else>
            <PlusIcon class="select-none w-[24px]" />
         </template>
      </div>
   </div>
</template>
