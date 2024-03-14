<script setup lang="ts">
import usePrivateRequest from "@/composables/usePrivateRequest";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import { publicRequest } from "@/utils/request";
import { ref, watch, watchEffect } from "vue";

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
   <h1>This is home page</h1>

   {{ JSON.stringify(authStore.user) }}
</template>
