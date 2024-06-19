<script lang="ts" setup>
import AddProduct from "@/components/Form/AddProduct.vue";
import Button from "@/components/ui/Button.vue";
import MyInput from "@/components/ui/MyInput.vue";
import Table from "@/components/ui/Table/Table.vue";
import useCategory from "@/hooks/useCategory";
import useGetProduct from "@/hooks/useGetProduct";
import useProduct from "@/hooks/useProducts";
import router from "@/router";

import { inputClasses } from "@/utils/appHelper";
import { PlusIcon } from "@heroicons/vue/16/solid";
import {
   ArrowPathIcon,
   Cog6ToothIcon,
   MagnifyingGlassIcon,
   PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import { ref, watch } from "vue";

type Tab = "all" | "add" | "edit";

const { products, status, page, isLast } = useProduct();

const currentTab = ref<Tab>("all");
const currentProduct = ref<ProductList>();
const currentProductIndex = ref<number>();

const curCategory = ref<Category>();

const { getProduct } = useGetProduct();
const { categories } = useCategory({ autoGetCategories: true });

const handleGetMore = () => {
   getProduct({ page: page.value + 1 }, { more: true });
};

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
      getProduct({ category_id: curCategory.value?.id, size: 2 }, { replace: true });
   },
   {
      immediate: true,
   }
);

const classes = {
   hide: "hidden",
   tab: "border-b-[4px] border-transparent  py-[3px] px-[12px] hover:brightness-100 flex-shrink-0",
   activeTab: "!border-[#cd1818] text-[20px]",
};
</script>

<template>
   <div class="flex justify-between">
      <div :class="`${currentTab != 'all' ? classes.hide : ''} flex space-x-[10px]`">
         <MyInput :attrs="{ placeholder: 'iPhone thirteen' }" class="" />
         <Button variant="push" border="clear">
            <MagnifyingGlassIcon class="w-[24px]" />
         </Button>
      </div>

      <Button
         v-if="currentTab === 'all'"
         :onClick="() => (currentTab = 'add')"
         variant="push"
         border="clear"
         class="ml-auto"
      >
         <PlusIcon class="w-[20px] mr-[4px]" />
         Add product
      </Button>

      <Button
         v-else
         colors="secondary"
         :onClick="() => (currentTab = 'all')"
         variant="push"
         class="ml-auto"
      >
         Close
      </Button>
   </div>
   <div :class="`${currentTab != 'all' ? classes.hide : ''}`">
      <div class="flex mt-[20px] border-b border-black/10">
         <button
            :onClick="() => (curCategory = undefined)"
            :class="`${classes.tab} ${
               curCategory === undefined ? classes.activeTab : ''
            }`"
         >
            All
         </button>

         <slot v-for="category in categories">
            <button
               v-if="category.is_show"
               :class="`${classes.tab} ${
                  curCategory?.id === category.id ? classes.activeTab : ''
               }`"
               :onClick="() => (curCategory = category)"
            >
               {{ category.category_name }}
            </button>
         </slot>
      </div>

      <div class="mt-[30px]">
         <ArrowPathIcon v-if="status === 'loading'" class="w-[24px] animate-spin" />

         <template v-else>
            <Table v-if="!!products.length" :col-list="['Name', 'Price', '']">
               <template v-for="(product, index) in products">
                  <tr>
                     <td>{{ product.product_name }}</td>
                     <td>---</td>
                     <td class="!text-right space-x-[8px]">
                        <button
                           :onClick="() => handleOpenEdit(index)"
                           :class="`${inputClasses.overlayButton}`"
                        >
                           <PencilSquareIcon class="w-[24px]" />
                        </button>
                        <button
                           class="rounded-[8px]"
                           :onClick="
                              () => router.push(`product/${product.id}`)
                           "
                           :class="`${inputClasses.overlayButton}`"
                        >
                           <Cog6ToothIcon class="w-[24px]" />
                        </button>
                     </td>
                  </tr>
               </template>
            </Table>
            <p v-else class="text-center">¯\_(ツ)_/¯</p>
         </template>

         <p class="text-center mt-[20px]">
            <Button
               v-if="status !== 'loading' && status !== 'error'"
               border="clear"
               :loading="status === 'more-loading'"
               variant="push"
               :onClick="handleGetMore"
               :disabled="isLast"
            >
               More
            </Button>
         </p>
      </div>
   </div>

   <div :class="`${currentTab === 'add' ? '' : classes.hide}`">
      <AddProduct :props="{ type: 'add' }" />
   </div>
   <div :class="`${currentTab == 'edit' ? '' : classes.hide}`">
      <AddProduct
         v-if="currentProduct != null && currentProductIndex != undefined"
         :props="{
            type: 'edit',
            product: currentProduct,
            currentIndex: currentProductIndex,
            cbAfterDelete: handleAfterDeleteProduct,
         }"
      />
   </div>
</template>
