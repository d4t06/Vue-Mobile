<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import loadingGif from "@/assets/loading.gif";
import { computed } from "vue";

const { allowRoles } = defineProps<{ allowRoles: Array<string> }>();

const router = useRouter();
const authStore = useAuthStore();
const { loading, user } = storeToRefs(authStore);

const isMatchedRole = computed(() => {
   if (user.value == null || !user.value.role) return false;

   // loop all allow role check if user meet
   return allowRoles.some((role) => {
      if (!user.value) return false;
      if (!user.value.role.includes(role)) return true;
   });
});
</script>

<template>
   <div v-if="loading" class="h-screen flex items-center">
      <img class="w-[200px] mx-auto" :src="loadingGif" alt="" />
   </div>

   <!-- if user had login -->
   <template v-else-if="user">
      <slot v-if="isMatchedRole" />
      <!-- if user not admin -->
      <template v-else>{{ router.push("/forbidden") }}</template>
   </template>

   <!-- if user not login -->
   <template v-else>{{ router.push("/login") }}</template>
</template>
