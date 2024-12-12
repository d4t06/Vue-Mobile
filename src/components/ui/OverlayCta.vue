<script lang="ts" setup>
const classes = {
   container:
      "transition-[opacity,transform] flex absolute bottom-0 w-full h-[40%] items-center justify-center gap-[12px]",
   button:
      "text-[#333] bg-[#ccc] h-[34px] w-[34px] hover:text-white hover:bg-[#cd1818] hover:scale-[1.1] transition-transform",
   hide: "opacity-0 translate-y-[10px]",
   show: "group-hover:!translate-y-[0] group-hover:!opacity-[1]",
   children: '*:rounded-md *:bg-white *:shadow-md hover:*:text-white hover:*:bg-[#cd1818] hover:*:scale-[1.05] *:transition-transform'
};
</script>

<template>
   <div :class="`${classes.container} ${classes.hide} ${classes.show} ${classes.children}`">
      <slot />
   </div>
</template>
