<script lang="ts" setup>
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";

const scroll = ref(false);

const authStore = useAuthStore()

const classes = {
   container: "absolute flex items-center left-0 w-[100%] h-[60px] px-[20px]",
};
</script>

<template>
   <div :class="`${classes.container} ${scroll ? 'shadow-md' : ''}`">
      <p class="ml-auto">
         Hello <span class="font-[500]">{{authStore.user?.username}}</span>
      </p>
   </div>
</template>
