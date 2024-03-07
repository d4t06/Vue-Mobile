<script setup lang="ts">
import { ArrowPathIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

const handleSearchText = (e: Event) => {
   console.log((e.target as HTMLInputElement).value);
};

const handleSubmit = () => {};

const handleShow = () => {};

const query = ref("");
</script>

<template>
   <div class="wrap">
      <form class="form" @submit="handleSubmit">
         <input
            class="input"
            type="text"
            placeholder="iPhone 15 Pro Max..."
            @change="handleSearchText"
         />
         <button v-if="false" class="loading-btn btn">
            <ArrowPathIcon class="w-[24px] animate-spin" />
         </button>

         <button v-if="false" type="button" class="clear-btn btn" @click="">
            <XMarkIcon class="w-[24px]" />
         </button>

         <button type="submit" class="search-btn btn">
            <MagnifyingGlassIcon class="w-[24px]" />
         </button>
      </form>
   </div>
</template>

<style lang="scss" scoped>
@import url("./Search.module.scss");
</style>
