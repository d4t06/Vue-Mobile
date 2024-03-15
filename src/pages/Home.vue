<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ref, watch, watchEffect } from "vue";
import Slider from "@/components/Slider.vue";

const authStore = useAuthStore();

watchEffect(async () => {
   // try {
   //    console.log("run watch");
   //    const res = await publicRequest.get("/products");
   //    console.log(res.data);
   // } catch (error) {
   //    console.log("check error");
   // }
}, {});
</script>

<template>
   <div class="mt-[30px]">
      <Slider />
   </div>
</template>
