<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Button from "./ui/Button.vue";
import { useAuthStore } from "@/stores/auth";
import {
   ArrowRightEndOnRectangleIcon,
   ArrowRightStartOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import Skeleton from "./Skeleton/Skeleton.vue";
import useLogout from "@/hooks/useLogout";

type Props = {
   isOpenSidebar: Boolean;
   close: () => {};
};
const { isOpenSidebar, close } = defineProps<Props>();

const appStore = useAppStore();
const authStore = useAuthStore();
const { user, loading } = storeToRefs(authStore);
const { categories, status } = storeToRefs(appStore);

// hooks
const { isFetching, logout } = useLogout();
const router = useRouter();

const handleNavigate = (to: string) => {
   close();
   setTimeout(() => router.push(to), 200);
};

const handleLogout = () => {
   logout();
};
</script>
<template>
   <div
      :class="`fixed z-[299] top-[0] left-0 bottom-0 w-[260px] max-w-[60vw] bg-[#fff] hidden max-[768px]:block transition-[transform, opacity] duration-[.3s]  ${
         isOpenSidebar ? 'translate-x-0 opacity-[1]' : 'translate-x-[-100%] opacity-0'
      }`"
   >
      <div class="h-full p-[10px] pt-[30px] space-y-[8px]">
         <template v-if="loading">
            <Skeleton
               v-for="key in [...Array(4).keys()]"
               :key="key"
               className="h-[24px] rounded-[6px]"
            />
         </template>

         <template v-else>
            <ul class="nav-list">
               <template v-for="category in categories">
                  <li
                     v-if="
                        status === 'successful' &&
                        !!categories.length &&
                        !!category.is_show
                     "
                     className="cursor-pointer py-[2px]"
                     :onClick="() => handleNavigate(`/${category.category_name_ascii}`)"
                  >
                     <p>{{ category.category_name }}</p>
                  </li>
               </template>
            </ul>

            <div v-if="user" class="border-t pt-[8px]">
               <button
                  class="w-full text-left py-[2px]"
                  :onClick="() => handleNavigate('/cart')"
               >
                  My Cart
               </button>
            </div>

            <div class="border-t pt-[8px]">
               <Button variant="push" border="clear" v-if="!user" href="/login">
                  <ArrowRightEndOnRectangleIcon class="w-[22px] mr-[6px]" />
                  Login
               </Button>
               <div v-else class="">
                  <p class="font-[500] text-[18px] mb-[4px] text-[#3f3f3f]">
                     {{ user.username }}
                  </p>
                  <Button :onClick="handleLogout" :loading="isFetching" variant="push" border="clear">
                     <ArrowRightStartOnRectangleIcon class="w-[22px] mr-[6px]" />
                     Logout
                  </Button>
               </div>
            </div>
         </template>
      </div>
   </div>
</template>
