<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { watch, watchEffect } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const { loading, user } = storeToRefs(authStore);

watch(
   [authStore],
   () => {
      console.log("require auth run");
   },
   {}
);

</script>
<template>
   <p>{{ loading }}</p>
   <div v-if="loading" class="h-screen flex items-center">
      <p>Loading...</p>
   </div>
   <slot v-else-if="user" />
</template>
