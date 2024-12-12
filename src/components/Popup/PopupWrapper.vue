<script setup lang="ts">
const classes = {
   menuItem:
      "*:px-3 *:py-1 *:flex *:items-center  *:space-x-1 hover:[&>*]:bg-[#f4f6f8] hover:[&>*]:text-[#cd1818]",
};
</script>

<template>
   <div
      :class="`rounded-lg py-3 text-[#333] bg-[#fff] flex flex-col shadow-[2px_2px_10px_0_rgba(0,0,0,.15)] ${classes.menuItem}`"
   >
      <slot />
   </div>
</template>
