<script setup lang="ts">
import Header from "./_components/Header/Header.vue";
</script>

<template>
   <div className="app">
      <Header />
      <div className="container mx-auto">
         <!-- {{status === "error" ?
         <h1 className="text-2xl">Something went wrong</h1>
         : children}} -->
         <RouterView />
      </div>
      <!-- <ScrollTop /> -->
      <!-- <Footer /> -->
   </div>
</template>
