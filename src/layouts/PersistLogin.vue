<script lang="ts" setup>
import useRefreshToken from "@/composables/useRefreshToken";
import { ref, watch, watchEffect } from "vue";

const refresh = useRefreshToken();
const runEffect = ref(false);

watchEffect(() => {
   if (!runEffect.value) {
      runEffect.value = true;
      refresh();
   }
});
</script>
<template>
   <slot />
</template>
