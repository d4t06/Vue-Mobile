<script setup lang="ts">
import useProduct from "@/composables/useProducts";
import { useAppStore } from "@/stores/app";
import { useProductStore } from "@/stores/product";
import type { Category } from "@/types";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

//
const curCategory = ref<Category>();

// hooks
const route = useRoute();
const appStore = useAppStore();
const productStore = useProductStore();

const { categories, status: appStatus } = storeToRefs(appStore);
const { status } = storeToRefs(productStore);

const { getProduct } = useProduct();

watch(
   [route, appStatus],
   () => {
      if (appStatus.value == "loading") return;

      // const founded = categories.value.find(
      //    (cat) => cat.category_ascii === route.params.category_ascii
      // );

      // if (founded) {
      // }
      getProduct(1, 1, { replace: true });
   },
   {
      immediate: true,
   }
);
</script>

<template>
   <p v-if="status === 'error'">Some thing went wrong</p>
   <div v-else>
      <div class="" v-if="status === 'loading'">Loading</div>
      <div class="" v-if="status === 'successful'">{{ JSON.stringify(productStore.products) }}</div>
   </div>

   {{ JSON.stringify(curCategory || {}) }}
</template>
