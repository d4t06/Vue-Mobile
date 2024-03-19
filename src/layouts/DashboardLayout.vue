<script lang="ts" setup>
import ToastPortal from "@/components/ToastPortal.vue";
import PersistLogin from "./PersistLogin.vue";
import RequireAuth from "./RequireAuth.vue";
import DashboardHeader from "./_components/DashboardHeader.vue";
import Sidebar from "./_components/Sidebar/Sidebar.vue";
</script>

<template>
   <PersistLogin>
      <RequireAuth :allow-roles="['ADMIN']">
         <div class="flex h-screen overflow-hidden">
            <Sidebar />
            <div class="bg-[#f1f1f1] relative w-full">
               <DashboardHeader />
               <div class="h-[calc(100vh-60px)] p-[30px] mt-[60px] overflow-auto w-full">
                  <RouterView />
               </div>
            </div>
         </div>
         <ToastPortal  />
      </RequireAuth>
   </PersistLogin>
</template>
