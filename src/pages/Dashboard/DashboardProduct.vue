<script lang="ts" setup>
import AddProduct from "@/components/Form/AddProduct.vue";
import Button from "@/components/ui/Button.vue";
import MyInput from "@/components/ui/MyInput.vue";
import Table from "@/components/ui/Table/Table.vue";
import useCategory from "@/composables/useCategory";
import useGetProduct from "@/composables/useGetProduct";
import { useProductStore } from "@/stores/product";
import type { Category, Product } from "@/types";
import { inputClasses, moneyFormat } from "@/utils/appHelper";
import { PlusIcon } from "@heroicons/vue/16/solid";
import { MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { reactive, ref, watch } from "vue";

type Tab = "all" | "add" | "edit";

const currentTab = ref<Tab>("all");
const currentProduct = ref<Product>();
const currentProductIndex = ref<number>();

const curCategory = ref<Category>();

const productStore = useProductStore();
const { products } = storeToRefs(productStore);

const { getProduct } = useGetProduct();
const { categories } = useCategory({ autoGetCategories: true });

const handleOpenEdit = (index: number) => {
   currentProductIndex.value = index;
   currentProduct.value = products.value[index];
   currentTab.value = "edit";
};

const handleAfterDeleteProduct = () => {
   currentTab.value == "all";

   currentProductIndex.value = undefined;
   currentProduct.value = undefined;
};

watch(
   curCategory,
   () => {
      getProduct({ categoryID: curCategory.value?.id || null, pageSize: 2 }, { replace: true });
   },
   {
      immediate: true,
   }
);

const classes = {
   hide: "hidden",
   tab: "border-b-[4px] py-[3px] px-[12px] hover:brightness-100 flex-shrink-0",
   activeTab: "border-[#cd1818] text-[20px]",
};
</script>

<template>
   <div class="flex justify-between">
      <div :class="`${currentTab != 'all' ? classes.hide : ''} flex space-x-[10px]`">
         <MyInput :attrs="{ placeholder: 'iPhone thirteen' }" class="" />
         <Button variant="push">
            <MagnifyingGlassIcon class="w-[24px]" />
         </Button>
      </div>

      <Button
         v-if="currentTab === 'all'"
         :onClick="() => (currentTab = 'add')"
         variant="push"
         class="ml-auto"
      >
         <PlusIcon class="w-[20px]" />
         Add product
      </Button>

      <Button v-else :onClick="() => (currentTab = 'all')" variant="push" class="ml-auto">
         Close
      </Button>
   </div>
   <div :class="`${currentTab != 'all' ? classes.hide : ''}`">
      <div class="flex mt-[20px]">
         <button
            :onClick="() => (curCategory = undefined)"
            :class="`${classes.tab} ${curCategory === undefined ? classes.activeTab : ''}`"
         >
            All
         </button>

         <button
            v-for="category in categories"
            :class="`${classes.tab} ${
               curCategory?.category_ascii === category.category_ascii ? classes.activeTab : ''
            }`"
            :onClick="() => (curCategory = category)"
         >
            {{ category.category_name }}
         </button>
      </div>

      <div class="mt-[30px]">
         <Table :colList="['Name', 'Giá', '']">
            <template v-for="(product, index) in products">
               <tr>
                  <td>{{ product.product_name }}</td>
                  <td>{{ moneyFormat(product.price) }}</td>
                  <td class="!text-right">
                     <Button
                        :onClick="() => handleOpenEdit(index)"
                        :class="inputClasses.overlayButton"
                        variant="clear"
                        size="clear"
                        colors="clear"
                     >
                        <PencilSquareIcon class="w-[24px]" />
                     </Button>
                  </td>
               </tr>
            </template>
         </Table>
      </div>
   </div>

   <div :class="`${currentTab === 'add' ? '' : classes.hide}`">
      <AddProduct type="add" />
   </div>
   <div :class="`${currentTab == 'edit' ? '' : classes.hide}`">
      <AddProduct
         v-if="currentProduct != null"
         type="edit"
         :currentIndex="currentProductIndex"
         :product="currentProduct"
         :cbAfterDelete="handleAfterDeleteProduct"
      />
   </div>
</template>
