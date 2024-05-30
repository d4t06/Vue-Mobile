<script setup lang="ts">

import empty from '@/assets/search-empty.png'

const classes = {
   container: "max-w-[80vw] mt-[30px] mx-auto text-center ",
   image: "mx-auto",
};
</script>

<template>
   <div :class="classes.container">
      <img :class="classes.image" :src="empty" alt="" />
      <p class="text-[18px] mt-[30px]">
         No result found, ¯\_(ツ)_/¯
      </p>
   </div>
</template>
