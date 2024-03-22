<script setup lang="ts">
import { watch } from "vue";
import Header from "./_components/Header/Header.vue";
import PersistLogin from "./PersistLogin.vue";
import ToastPortal from "@/components/ToastPortal.vue";
import Footer from "./_components/Footer/Footer.vue";
import useCategory from "@/composables/useCategory";

const { getCategories } = useCategory();

watch(
   () => 0,
   async () => {
      getCategories();
   },
   {
      immediate: true,
   }
);
</script>

<template>
   <PersistLogin>
      <div class="app">
         <Header />
         <div class="container mx-auto py-[30px]">
            <RouterView />
         </div>
         <!-- <ScrollTop /> -->
         <Footer />

         <div class="container mx-auto">
            <p class="py-[10px] text-[14px] text-[#333]">
               Make with ❤️ by d4t06 <br />
               © All rights no reserved ¯\_(ツ)_/¯
            </p>
         </div>

         <ToastPortal />
      </div>
   </PersistLogin>
</template>
