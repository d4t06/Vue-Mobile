<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { useProductStore } from "@/stores/product";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

//
const curCategory = ref<Category>();

// hooks
const route = useRoute();
const appStore = useAppStore();
const productStore = useProductStore();
const { categories, initLoading } = storeToRefs(appStore);
const { status } = storeToRefs(productStore);

watch(
   route,
   () => {
      if (!initLoading) return;
      const founded = categories.value.find(
         (cat) => cat.category_ascii === route.params.category_ascii
      );

      if (founded) {
      } else {
         productStore.storingProducts({ status: "error" });
      }
   },
   {
      immediate: true,
   }
);

console.log('check status', productStore.status);


</script>

<template>
   <p v-if="status === 'error'">Some thing went wrong</p>
   <div v-else>
      <div class="" v-if="status === 'loading'">Loading</div>
      <div class="" v-if="status === 'successful'">product</div>
   </div>

   {{ JSON.stringify(curCategory || {}) }}
</template>
