<script lang="ts" setup>
import { ref } from "vue";

const scroll = ref(false);

const classes = {
   container: "absolute flex items-center left-0 w-[100%] h-[60px] px-[20px]",
};
</script>

<template>
   <div :class="`${classes.container} ${scroll ? 'shadow-md' : ''}`">
      <p class="ml-auto">
         Hello <span class="font-[500]">{data ? data.user.name : "no persist"}</span>
      </p>
   </div>
</template>
