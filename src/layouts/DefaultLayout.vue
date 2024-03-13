<script setup lang="ts">
import { watchEffect } from "vue";
import { useAppStore } from "@/stores/app";
import { publicRequest } from "@/utils/request";
import Header from "./_components/Header/Header.vue";

const appStore = useAppStore();

watchEffect(async () => {
   try {
      const res = await publicRequest.get("/categories");
      appStore.storingCategory({ categories: res.data.data, initLoading: false });
   } catch (err) {}
});
</script>

<template>
   <div className="app">
      <Header />
      <div className="container mx-auto">
         <RouterView />
      </div>
      <!-- <ScrollTop /> -->
      <!-- <Footer /> -->
   </div>
</template>
