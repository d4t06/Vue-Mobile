<script setup lang="ts">
import Search from "@/components/Search/Search.vue";
import { Bars3Icon, Cog6ToothIcon, ShoppingCartIcon, UserIcon } from "@heroicons/vue/24/outline";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import Button from "@/components/ui/Button.vue";
import MobileSidebar from "@/components/MobileSidebar.vue";
import Modal from "@/components/Modal/Modal.vue";
import { ref } from "vue";

const appStore = useAppStore();
const authStore = useAuthStore();
const { categories, status } = storeToRefs(appStore);

const isOpenSidebar = ref(false);

const closeModal = () => (isOpenSidebar.value = false);
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
            <div class="w-full h-[50px] flex items-center justify-center md:hidden">
               <RouterLink class="text-[22px] font-[500] p-[6px]" to="/">
                  Vue <span class="text-[#cd1818]">Mobile</span>
               </RouterLink>

               <Button
                  :onClick="() => (isOpenSidebar = true)"
                  variant="push"
                  colors="secondary"
                  size="clear"
                  class="!absolute p-[4px] left-[10px]"
               >
                  <Bars3Icon class="w-[24px]" />
               </Button>
            </div>

            <div class="left w-1/4 hidden md:block">
               <RouterLink class="text-[26px] font-[500]" to="/">
                  Vue <span class="text-[#cd1818]">Mobile</span>
               </RouterLink>
            </div>

            <Search />

            <div class="w-1/4 hidden md:block text-right">
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
               <template v-for="category in categories">
                  <li
                     v-if="
                        status === 'successful' &&
                        !!categories.length &&
                        !!category.is_show
                     "
                     className="nav-item"
                  >
                     <RouterLink :to="`/${category.category_name_ascii}`">
                        <p>{{ category.category_name }}</p>
                     </RouterLink>
                  </li>
               </template>
            </ul>

            <ul class="nav-list">
               <li v-if="authStore.user?.role.includes('ADMIN')" class="nav-item">
                  <RouterLink to="/cart">
                     <span class="nav-text">Cart</span>
                     <ShoppingCartIcon class="w-[24px]" />
                  </RouterLink>
               </li>
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

   <MobileSidebar :close="closeModal" :isOpenSidebar="isOpenSidebar" />

   <Modal v-if="isOpenSidebar" zIndex="z-[201]" :close="closeModal" />
</template>

<style scoped lang="scss">
@import "./Header.module.scss";
</style>
