<script lang="ts" setup>
import ToastPortal from "@/components/ToastPortal.vue";
import PersistLogin from "./PersistLogin.vue";
import RequireAuth from "./RequireAuth.vue";
import DashboardHeader from "./_components/DashboardHeader.vue";
import Sidebar from "./_components/Sidebar/Sidebar.vue";
import UploadImagePortal from "@/components/UploadImagePortal.vue";
</script>

<template>
   <PersistLogin>
      <RequireAuth :allow-roles="['ADMIN']">
         <div class="flex h-screen overflow-hidden">
            <Sidebar />
            <div class="bg-[#fff] relative w-full">
               <DashboardHeader />
               <div
                  class="dash-content h-[calc(100vh-60px)] p-[30px] mt-[60px] overflow-auto w-full"
               >
                  <RouterView />
               </div>
            </div>
         </div>
         <ToastPortal />
         <UploadImagePortal />
      </RequireAuth>
   </PersistLogin>
</template>
