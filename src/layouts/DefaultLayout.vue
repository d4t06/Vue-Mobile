<script setup lang="ts">
import { watchEffect } from "vue";
import { useAppStore } from "@/stores/app";
import { publicRequest } from "@/utils/request";
import Header from "./_components/Header/Header.vue";
import PersistLogin from "./PersistLogin.vue";
import ToastPortal from "@/components/ToastPortal.vue";

const appStore = useAppStore();

watchEffect(async () => {
   try {
      const res = await publicRequest.get("/categories");
      appStore.storingCategory({ categories: res.data.data, status: "successful" });
   } catch (err) {}
});
</script>

<template>
   <PersistLogin>
      <div className="app">
         <Header />
         <div className="container mx-auto">
            <RouterView />
         </div>
         <!-- <ScrollTop /> -->
         <!-- <Footer /> -->

         <ToastPortal />
      </div>
   </PersistLogin>
</template>
