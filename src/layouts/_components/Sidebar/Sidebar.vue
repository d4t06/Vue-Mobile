<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";
import {
   BookmarkSquareIcon,
   BuildingStorefrontIcon,
   ComputerDesktopIcon,
   DevicePhoneMobileIcon,
PhotoIcon,
} from "@heroicons/vue/24/outline";
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import logo from "@/assets/logo.png";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/16/solid";

const BASE_URL = "/dashboard";

const expand = ref(false);

const route = useRoute();

const handleExpand = () => {
   expand.value = !expand.value;
};

console.log("check path", route.path);
</script>

<template>
   <div :class="`sidebar ${expand ? 'expand' : ''}`">
      <div class="head">
         <h1 v-if="expand" class="logo-text">Vue  <span class="text-[#cd1818]">Dashboard</span></h1>

         <img v-else class="logo-image" :src="logo" />
      </div>
      <div>
         <RouterLink
            to="/dashboard"
            :class="`${route.path === BASE_URL ? 'active' : ''} sidebar__item`"
         >
            <ComputerDesktopIcon class="w-[24px]" />
            <slot v-if="expand">Dashboard</slot>
         </RouterLink>
         <RouterLink
            :to="BASE_URL + '/product'"
            :class="`${route.path === BASE_URL + '/product' ? 'active' : ''} sidebar__item`"
         >
            <DevicePhoneMobileIcon class="w-[24px]" />
            <slot v-if="expand">Product</slot>
         </RouterLink>

         <RouterLink
            :to="BASE_URL + '/category'"
            :class="`${route.path === BASE_URL + '/category' ? 'active' : ''} sidebar__item`"
         >
            <BookmarkSquareIcon class="w-[24px]" />
            <slot v-if="expand">Category</slot>
         </RouterLink>

         <RouterLink
            :to="BASE_URL + '/banner'"
            :class="`${route.path === BASE_URL + '/banner' ? 'active' : ''} sidebar__item`"
         >
            <PhotoIcon class="w-[24px]" />
            <slot v-if="expand">Banner</slot>
         </RouterLink>

         <RouterLink target="blank" :class="`sidebar__item`" to="/">
            <BuildingStorefrontIcon class="w-[24px]" />
            <slot v-if="expand">My shop</slot>
         </RouterLink>
      </div>

      <Button
         :onClick="handleExpand"
         size="clear"
         variant="push"
         class="p-[4px] !absolute bottom-[20px] right-0 translate-x-[50%] z-[10]"
      >
         <slot v-if="expand"><ChevronLeftIcon class="w-[24px]" /></slot>
         <slot v-else><ChevronRightIcon class="w-[24px]" /></slot>
      </Button>
   </div>
</template>

<style lang="scss">
@import url("./Sidebar.module.scss");
</style>
