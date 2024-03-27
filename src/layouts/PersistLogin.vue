<script lang="ts" setup>
import useRefreshToken from "@/composables/useRefreshToken";
import { useAuthStore } from "@/stores/auth";
import { ref, watch } from "vue";

const refresh = useRefreshToken();
const authStore = useAuthStore();

const runEffect = ref(false);
const runCallBack = ref(false);

watch(
   authStore,
   () => {
      const verifyRefreshToken = async () => {
         try {
            runCallBack.value = true;
            await refresh();
         } catch (error) {
            console.error(error);
         } finally {
            authStore.setAuthenticate({ loading: false });
         }
      };

      if (!runEffect.value && !authStore.user) {
         runEffect.value = true;
         verifyRefreshToken();
      }
   },
   {
      immediate: true,
   }
);
</script>
<template>
   <slot />
</template>
