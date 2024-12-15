<script lang="ts" setup>
import { ref } from "vue";
import Button from "@/components/ui/Button.vue";
import MyInput from "@/components/ui/MyInput.vue";
import Table from "@/components/ui/Table/Table.vue";
import useCategory from "@/hooks/useCategory";
import AddProductBtn from "./_components/AddProductBtn.vue";
import Modal, { ModalRef } from "@/components/Modal/Modal.vue";
import AddProduct from "@/components/Form/AddProduct.vue";
import { MagnifyingGlassIcon, ArrowPathIcon, XMarkIcon } from "@heroicons/vue/16/solid";
import useGetProductDashboard from "./_hooks/useGetProductDashboard";
import useSearchProductDashboard from "./_hooks/useSearchProductDashboard";
import { PencilSquareIcon } from "@heroicons/vue/24/outline";
import DashboardProductSetting from "./_components/DashboardProductSetting.vue";

type Modal = "edit" | "delete";

const currentProduct = ref<ProductList>();
const currentProductIndex = ref<number>();

const tab = ref("");
const modal = ref<Modal>("edit");

const modalRef = ref<ModalRef>();

const openModal = (m: Modal) => {
   modal.value = m;
   modalRef.value?.open();
};

const closeModal = () => {
   modalRef.value?.close();
};

const { categories } = useCategory({ autoGetCategories: true });
const { search, value, isFetching } = useSearchProductDashboard({ tab });
const { products, status, getMore, isLast, count } = useGetProductDashboard({ tab });

const handleOpenEdit = (index: number) => {
   currentProductIndex.value = index;
   currentProduct.value = products.value[index];

   openModal("edit");
};

const classes = {
   hide: "hidden",
   tab: "border-b-[4px] border-transparent  py-[3px] px-[12px] hover:brightness-100 flex-shrink-0",
   activeTab: "!border-[#cd1818] text-[20px]",
};
</script>

<template>
   <div class="mb-5">
      <div :class="` flex justify-between`">
         <div :class="`flex space-x-1 sm:space-x-[10px] mr-5`">
            <div class="relative flex items-center">
               <MyInput
                  className="pr-8"
                  :attrs="{ placeholder: 'iPhone thirteen' }"
                  v-model="value"
               />
               <button
                  v-if="!!value"
                  @click="() => (value = '')"
                  class="absolute right-1 p-1 text-[#808080]"
               >
                  <XMarkIcon class="w-6" />
               </button>
            </div>
            <Button
               :onclick="!isFetching && !!value ? search : ''"
               variant="push"
               border="clear"
               size="clear"
               class="p-1 sm:px-3"
            >
               <ArrowPathIcon class="w-6 animate-spin" v-if="isFetching" />
               <MagnifyingGlassIcon class="w-6" v-else />
            </Button>
         </div>

         <AddProductBtn />
      </div>
   </div>
   <div :class="``">
      <div class="flex mt-[20px] border-b border-black/10">
         <button
            :onClick="() => (tab = '')"
            :class="`${classes.tab} ${!tab ? classes.activeTab : ''}`"
         >
            All
         </button>

         <slot v-for="category in categories">
            <button
               v-if="category.is_show"
               :class="`${classes.tab} ${
                  tab === category.category_name_ascii ? classes.activeTab : ''
               }`"
               :onClick="() => (tab = category.category_name_ascii)"
            >
               {{ category.category_name }}
            </button>
         </slot>
      </div>

      <div class="mt-[30px]">
         <Table
            :col-list="[
               `Result ${status === 'successful' ? '(' + count + ')' : '--'}`,
               '',
            ]"
         >
            <tr v-if="status === 'loading'">
               <td colspan="2">
                  <p class="text-center">
                     <ArrowPathIcon class="w-6 inline-block animate-spin" />
                  </p>
               </td>
            </tr>

            <template v-else-if="!!products.length">
               <template v-for="(product, index) in products">
                  <tr>
                     <td>{{ product.product_name }}</td>
                     <td class="!text-right space-x-[8px]">
                        <Button
                           variant="push"
                           colors="secondary"
                           size="clear"
                           class-name="p-1"
                           :onClick="() => handleOpenEdit(index)"
                        >
                           <PencilSquareIcon class="w-[24px]" />
                        </Button>

                        <DashboardProductSetting :index="index" :product="product" />
                     </td>
                  </tr>
               </template>
            </template>
            <tr v-else>
               <td colspan="2">
                  <p class="text-center">¯\_(ツ)_/¯</p>
               </td>
            </tr>
         </Table>

         <p class="text-center mt-[20px]">
            <Button
               v-if="status !== 'loading' && status !== 'error' && !!products.length"
               border="clear"
               :loading="status === 'more-loading'"
               variant="push"
               :onClick="getMore"
               :disabled="isLast"
            >
               More
            </Button>
         </p>
      </div>
   </div>

   <Modal ref="modalRef">
      <template v-slot:children>
         <AddProduct
            v-if="
               modal === 'edit' && !!currentProduct && currentProductIndex !== undefined
            "
            :props="{
               type: 'edit',
               closeModal: closeModal,
               product: currentProduct,
               currentIndex: currentProductIndex,
            }"
         />
      </template>
   </Modal>
</template>
