<script setup lang="ts">
import useCategory from "@/hooks/useCategory";
import PersistLogin from "./PersistLogin.vue";
import Header from "./_components/Header/Header.vue";
import { watch } from "vue";


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

const classes = {
   container:
      "container lg:max-w-[800px] mx-auto pb-[200px] md:pb-[160px] mt-[20px]",
};
</script>

<template>
   <PersistLogin>
      <div>
         <Header />
         <div :class="classes.container">
            <RouterView />
         </div>
      </div>
   </PersistLogin>
</template>
