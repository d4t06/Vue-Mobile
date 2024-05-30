<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref, watch, watchEffect } from "vue";

const scroll = ref(false);

const authStore = useAuthStore();

onMounted(() => {
   console.log("on mounted");
   const dashContent = document.querySelector(".dash-content");
   if (dashContent) {
      dashContent.addEventListener("scroll", (e) => {
         if ((e.target as HTMLDivElement).scrollTop > 10) scroll.value = true;
         else scroll.value = false;
      });
   }
});

watchEffect(() => {
   console.log("run effect");
});

watch(
   () => 0,
   () => {
      console.log("run watch");
   },
   {
      immediate: true,
   }
);

const classes = {
   container: "absolute flex items-center left-0 w-[100%] h-[60px] px-[20px]",
};
</script>

<template>
   {{ console.log("render header") }}
   <div :class="`${classes.container} ${scroll ? 'shadow-md' : ''}`">
      <p class="ml-auto">
         Hello <span class="font-[500]">{{ authStore.user?.username }}</span>
      </p>
   </div>
</template>
