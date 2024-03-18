<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ref, watch, watchEffect } from "vue";
import Slider from "@/components/Slider.vue";
import Button from "@/components/ui/Button.vue";
import { useToastStore } from "@/stores/toast";

const authStore = useAuthStore();
const toastStore = useToastStore();
const count = ref(0);

watch(
   [count],
   () => {
      console.log("run watch", count.value);
   },
   {
      immediate: true,
   }
);

watchEffect(async () => {
   console.log("run effect", count.value);
   // try {
   //    console.log("run watch");
   //    const res = await publicRequest.get("/products");
   //    console.log(res.data);
   // } catch (error) {
   //    console.log("check error");
   // }
}, {});

const handleIncrease = () => {
   count.value += 1;
};
</script>

<template>
   <div class="mt-[30px]">
      <Button :onClick="handleIncrease" variant="push">{{ count }}</Button>
   </div>
</template>
