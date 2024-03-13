<script setup lang="ts">
import Search from "@/components/Search/Search.vue";
import { ArchiveBoxIcon, Cog6ToothIcon, ShoppingCartIcon } from "@heroicons/vue/24/outline";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const {categories, initLoading} = storeToRefs(appStore);

</script>

<template>
   <div class="header-banner">
      <img
         src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2024/01/banner/Big-steak-1200-44-1200x44.png"
         alt=""
      />
   </div>
   <div class="container mx-auto">
      <div class="header-top">
         <div class="header-top-wrap">
            <div class="left w-1/4 max-[768px]:hidden">
               <RouterLink class="text-[26px]" to="/">
                  HD <span class="text-[#cd1818]">Mobile</span>
               </RouterLink>
            </div>

            <Search />

            <div class="w-1/4 max-[768px]:hidden"></div>
         </div>
      </div>
      <div class="header-nav">
         <div class="header-nav-wrap">
            <ul class="nav-list">
               <li v-if="!initLoading && !!categories.length" v-for="category in categories" className="nav-item">
                  <RouterLink :to="category.category_ascii">
                     <p>{{ category.category_name }}</p>
                  </RouterLink>
               </li>
            </ul>
            <ul class="nav-list">
               <li class="nav-item">
                  <RouterLink to="">
                     <span class="nav-text">Cart</span>
                     <ShoppingCartIcon class="w-[24px]" />
                  </RouterLink>
               </li>

               <li class="nav-item">
                  <RouterLink to="">
                     <span class="nav-text">Order</span>
                     <ArchiveBoxIcon class="w-[24px]" />
                  </RouterLink>
               </li>

               <li class="nav-item">
                  <RouterLink to="">
                     <span class="nav-text">Dashboard</span>
                     <Cog6ToothIcon class="w-[24px]" />
                  </RouterLink>
               </li>
            </ul>
         </div>
      </div>
   </div>

   <!-- <Sidebar isOpen={isOpenSidebar} setIsOpen={setIsOpenSidebar} /> -->

   <!-- {{showModal && <Modal setShowModal={setShowModal}></Modal>}} -->
</template>

<style scoped lang="scss">
@import "./Header.module.scss";
</style>