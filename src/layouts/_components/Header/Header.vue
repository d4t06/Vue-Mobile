<script setup lang="ts">
import Search from "@/components/Search/Search.vue";
import { Cog6ToothIcon, UserIcon } from "@heroicons/vue/24/outline";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

const appStore = useAppStore();
const authStore = useAuthStore();
const { categories, status } = storeToRefs(appStore);

// console.log(">>> check authstore", authStore.user);
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
               <RouterLink class="text-[26px] font-[500]" to="/">
                  HD <span class="text-[#cd1818]">Mobile</span>
               </RouterLink>
            </div>

            <Search />

            <div class="w-1/4 max-[768px]:hidden text-right">
               <template v-if="!authStore.loading">
                  <RouterLink
                     v-if="!authStore.user"
                     class="inline-flex space-x-[4px] hover:text-[#cd1818]"
                     to="/login"
                  >
                     <UserIcon class="w-[24px]" />
                     <span> Sign in </span>
                  </RouterLink>

                  <RouterLink
                     v-else
                     class="inline-flex space-x-[4px] hover:text-[#cd1818]"
                     to="/account"
                  >
                     <UserIcon class="w-[24px]" />
                     <span>{{ authStore.user.username }}</span>
                  </RouterLink>
               </template>
            </div>
         </div>
      </div>
      <div class="header-nav">
         <div class="header-nav-wrap">
            <ul class="nav-list">
               <li
                  v-if="status === 'successful' && !!categories.length"
                  v-for="category in categories"
                  className="nav-item"
               >
                  <RouterLink :to="category.category_ascii">
                     <p>{{ category.category_name }}</p>
                  </RouterLink>
               </li>
            </ul>

            <ul class="nav-list">
               <li v-if="authStore.user?.role.includes('ADMIN')" class="nav-item">
                  <RouterLink to="/dashboard">
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
