<script lang="ts" setup>
import useCategory from "@/composables/useCategory";
import { computed } from "vue";
import { useRoute } from "vue-router";
import BrandItem from "./BrandItem.vue";
import { useFiltersStore } from "@/stores/filter";
import { storeToRefs } from "pinia";
import SelectedItem from "./SelectedItem.vue";

const { categories, status } = useCategory();
const filterStore = useFiltersStore();

const { filters, sort } = storeToRefs(filterStore);

const route = useRoute();

const isFilter = computed(() => !!filters.value.brands.length && !!filters.value.price);

const brandsByCategory = computed(() => {
   if (status.value !== "successful") return [];

   const categoryAscii = route.params.categoryAscii;
   if (!categoryAscii) return [];

   const curCategory = categories.value.find((c) => c.category_ascii === categoryAscii);
   return curCategory ? curCategory.brands : [];
});
</script>

<template>
   <div class="container">
      <div class="brand-list">
         <template v-if="isFilter">
            <SelectedItem v-for="brand in filters.brands" :brand="brand" />
         </template>
         <template v-else>
            <BrandItem v-for="brand in brandsByCategory" :brand="brand" />
         </template>
      </div>
   </div>
</template>

<style scoped lang="scss">
@import "./BrandList.module.scss";
</style>
