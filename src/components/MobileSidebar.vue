<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

type Props = {
   isOpenSidebar: Boolean;
   close: () => {};
};
const { isOpenSidebar, close } = defineProps<Props>();

const appStore = useAppStore();
const { categories, status } = storeToRefs(appStore);

const router = useRouter();

const handleNavigate = (to: string) => {
   close();
   setTimeout(() => router.push(to), 200);
};
</script>
<template>
   <div
      :class="`fixed z-[299] top-[0] left-0 bottom-0 w-[260px] max-w-[60vw] bg-[#fff] hidden max-[768px]:block transition-[transform, opacity] duration-[.3s]  ${
         isOpenSidebar ? 'translate-x-0 opacity-[1]' : 'translate-x-[-100%] opacity-0'
      }`"
   >
      <div class="p-[10px] pt-[30px]">
         <ul class="nav-list">
            <template v-for="category in categories">
               <li
                  v-if="
                     status === 'successful' && !!categories.length && !!category.is_show
                  "
                  className="cursor-pointer"
                  :onClick="() => handleNavigate(`/${category.category_ascii}`)"
               >
                  <p>{{ category.category_name }}</p>
               </li>
            </template>
         </ul>
      </div>
   </div>
</template>
