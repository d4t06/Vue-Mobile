<script lang="ts" setup>
import Button from "./Button.vue";

// type Props = {
//    data: {
//       cb: () => void;
//       icon: Object;
//       className?: string;
//    }[];
// };

// const { data } = defineProps<Props>();

const classes = {
   container:
      "transition-[opacity,transform] flex absolute bottom-0 w-full h-[40%] items-center justify-center gap-[12px]",
   button:
      "text-[#333] bg-[#ccc] h-[34px] w-[34px] hover:text-white hover:bg-[#cd1818] hover:scale-[1.1] transition-transform",
   hide: "opacity-0 translate-y-[10px]",
   show: "group-hover:!translate-y-[0] group-hover:!opacity-[1]",
};
</script>

<template>
   <div :class="`${classes.container} ${classes.hide} ${classes.show} `">
      <slot />
   </div>
</template>
