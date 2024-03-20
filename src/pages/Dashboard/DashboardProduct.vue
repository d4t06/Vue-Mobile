<script lang="ts" setup>
import AddProduct from "@/components/Form/AddProduct.vue";
import Button from "@/components/ui/Button.vue";
import MyInput from "@/components/ui/MyInput.vue";
import Table from "@/components/ui/Table/Table.vue";
import useCategory from "@/composables/useCategory";
import useProductAction from "@/composables/useProductAction";
import useProduct from "@/composables/useProducts";
import { useProductStore } from "@/stores/product";
import { useToastStore } from "@/stores/toast";
import type { Category } from "@/types";
import { moneyFormat } from "@/utils/appHelper";
import { PlusIcon } from "@heroicons/vue/16/solid";
import { MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

type Tab = "all" | "add" | "edit";

const currentTab = ref<Tab>("all");
const currentProductIndex = ref<number>();
const curCategory = ref<Category>();

const toastStore = useToastStore();
const productStore = useProductStore();
const { products } = storeToRefs(productStore);

const { getProduct, isFetching } = useProduct();
const { categories, status } = useCategory();

watch(
   curCategory,
   () => {
      getProduct(1, 1, { replace: true });
   },
   {
      immediate: true,
   }
);

const classes = {
   searchBtn: "w-[]",
   hide: "hidden",
   productButton:
      "p-[4px] transition-transform text-[#333] bg-[#e1e1e1] hover:scale-[1.05] hover:bg-[#cd1818] hover:text-white",
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

         <!-- <template > -->
         <button
            v-for="category in categories"
            :class="`${classes.tab} ${curCategory?.category_ascii === category.category_ascii ? classes.activeTab : ''}`"
            :onClick="() => (curCategory = category)"
         >
            {{ category.category_name }}
         </button>
         <!-- </template> -->
      </div>

      <div class="mt-[30px]">
         <Table :colList="['Name', 'Giá', '']">
            <template v-for="product in products">
               <tr>
                  <td>{{ product.product_name }}</td>
                  <td>{{ moneyFormat(product.price) }}</td>
                  <td class="!text-right">
                     <Button :class="classes.productButton" variant="clear" size="clear">
                        <PencilSquareIcon class="w-[24px]" />
                     </Button>
                  </td>
               </tr>
            </template>
         </Table>
      </div>
   </div>

   <div :class="`${currentTab != 'add' ? classes.hide : ''}`">
      <AddProduct type="add" />
      <!-- <p>Add tab</p> -->
   </div>
   <div :class="`${currentTab != 'edit' ? classes.hide : ''}`">
      <p>Delete tab</p>
   </div>
</template>
