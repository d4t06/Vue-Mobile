<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { watchEffect } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

watchEffect(() => {
   setTimeout(() => {

      console.log('>>> run set auth');
      
      authStore.setAuthenticate({
         user: {
            token: "",
            name: "",
            role: "",
         },
         loading: false,
      });
   }, 3000);
}, {});

</script>
<template>
   <slot />
</template>
