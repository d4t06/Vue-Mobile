<script lang="ts" setup>
import Modal from "@/components/Modal/Modal.vue";
import Box from "@/components/ui/Box.vue";
import MyInput from "@/components/ui/MyInput.vue";
import OverlayCta from "@/components/ui/OverlayCta.vue";
import { useAppStore } from "@/stores/app";

import { generateId, inputClasses } from "@/utils/appHelper";
import { ArrowPathIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import Gallery from "../Gallery.vue";
import Button from "@/components/ui/Button.vue";
import useProductAction, { type ProductModal } from "@/hooks/useProductAction";
import ConfirmModal from "../Modal/ConfirmModal.vue";

type AddProduct = {
   type: "add";
};

type EditProduct = {
   type: "edit";
   product: ProductList;
   currentIndex: number;
   cbAfterDelete: () => void;
};

type Props = {
   props: AddProduct | EditProduct;
};

const initProduct = {
   category_id: 0,
   image_url: "",
   product_name_ascii: "",
   product_name: "",
   brand_id: 0,
   installment: false,
} as ProductSchema;

const p = defineProps<Props>();

const productData = reactive<ProductSchema>(initProduct);
const isOpenModal = ref<ProductModal>("close");
const curCategory = ref<Category>();

const isChange = ref(false);

const appStore = useAppStore();
const { categories } = storeToRefs(appStore);
const { isFetching, productActions } = useProductAction({ isOpenModal });

const brandsByCategory = computed(() =>
   curCategory.value ? curCategory.value.brands : []
);

const handleInput = (field: keyof typeof productData, value: any) => {
   // also set product_name_ascii
   if (field === "product_name") {
      Object.assign(productData, {
         [field]: value,
         product_name_ascii: generateId(value),
      });

      isChange.value = true;
      return;
   }

   if (field === "category_id") {
      const founded = categories.value.find((cat) => cat.id === value);

      if (!founded) return;
      curCategory.value = founded;
   }
   isChange.value = true;
   Object.assign(productData, { [field]: value });
};

const handleCloseModal = () => (isOpenModal.value = "close");

function resetForm() {
   const { category_id, brand_id, ...rest } = initProduct;
   Object.assign(productData, rest);
}

const handleSubmit = async () => {
   switch (p.props.type) {
      case "add":
         await productActions({ type: "add", product: productData });
         resetForm();
         break;

      case "edit":
         await productActions({
            type: "edit",
            product: productData,
            index: p.props.currentIndex,
            id: p.props.product.id,
         });

         isChange.value = false;
         break;
   }
};

const handleDeleteProduct = async () => {
   if (p.props.type === "edit" && p.props.product) {
      await productActions({
         type: "delete",
         id: p.props.product.id,
      });
      Object.assign(productData, initProduct);

      p.props.cbAfterDelete && p.props.cbAfterDelete();
   }
};

watch(
   [() => p.props],
   () => {
      const handleInitProduct = () => {
         if (p.props.type === "edit") {
            const { product } = p.props;
            if (product) {
               const category = categories.value.find(
                  (c) => c.id === product.category_id
               );
               if (category) {
                  curCategory.value = category;
                  Object.assign(productData, p.props.product);
               }
            }
         }
      };

      handleInitProduct();
   },
   { immediate: true }
);
</script>

<template>
   <div class="flex items-center space-x-[8px] text-[#1f1f1f]">
      <PencilSquareIcon class="w-[24px]" />
      <h1 class="text-[24px] font-[500]">
         {{ p.props.type === "add" ? "Add new product" : "Edit product" }}
      </h1>
   </div>
   <div class="flex mx-[-8px] mt-[14px]">
      <div class="w-1/3 px-[8px]">
         <template v-if="!productData.image_url">
            <Box :onClick="() => (isOpenModal = 'gallery')" />
         </template>

         <template v-else>
            <Box>
               <template v-slot:children>
                  <img :src="productData.image_url" alt="asd" />
                  <OverlayCta>
                     <button
                        :class="inputClasses.overlayButton"
                        :onClick="() => (isOpenModal = 'gallery')"
                     >
                        <ArrowPathIcon class="w-[24px]" />
                     </button>
                  </OverlayCta>
               </template>
            </Box>
         </template>
      </div>

      <div class="flex-1">
         <div class="space-y-[14px] px-[8px]">
            <div class="space-y-[4px]">
               <label class="font-[500] text-[#1f1f1f]" htmlFor="name">
                  Product name</label
               >
               <MyInput
                  @input="(e) => handleInput('product_name', e.target.value)"
                  :attrs="{ value: productData.product_name }"
               />
            </div>

            <template v-if="p.props.type === 'add'">
               <div class="space-y-[4px]">
                  <label class="font-[500] text-[#1f1f1f]" htmlFor="category"
                     >Category</label
                  >
                  <select
                     @input="(e: any) => handleInput('category_id', +e.target.value)"
                     :value="productData.category_id"
                     :class="inputClasses.input"
                     name="category"
                  >
                     <option :value="undefined">- - -</option>
                     <template v-for="cat in categories">
                        <option v-if="cat.is_show" :value="cat.id">
                           {{ cat.category_name }}
                        </option>
                     </template>
                  </select>
               </div>
            </template>

            <div :class="`space-y-[4px] ${!curCategory && 'disable'}`">
               <label class="font-[500] text-[#1f1f1f]" htmlFor="brand">Brand</label>
               <select
                  @input="(e: any) => handleInput('brand_id', +e.target.value)"
                  :value="productData.brand_id"
                  :class="inputClasses.input"
                  name="brand"
               >
                  <option :value="undefined">- - -</option>
                  <option v-for="brand in brandsByCategory" :value="brand.id">
                     {{ brand.brand_name }}
                  </option>
               </select>
            </div>
         </div>
      </div>
   </div>

   <div class="text-center">
      <Button
         class="mt-[30px]"
         variant="push"
         border="clear"
         :onClick="handleSubmit"
         :loading="isFetching === 'add' || isFetching === 'edit'"
         :disabled="!isChange"
      >
         {{ p.props.type === "add" ? "Save" : "Save change" }}
      </Button>
   </div>

   <template v-if="p.props.type == 'edit'">
      <h5 class="text-red-500 mt-[30px] ${classes.label} font-semibold">DANGER ZONE</h5>
      <div class="border-red-500 border rounded-[16px] p-[14px]">
         <Button
            border="clear"
            variant="push"
            :onClick="() => (p.props.type === 'edit' ? (isOpenModal = 'delete') : {})"
         >
            Delete Product
         </Button>
      </div>
   </template>

   <Modal v-if="isOpenModal !== 'close'" :close="handleCloseModal">
      <template v-slot:children>
         <Gallery
            v-if="isOpenModal === 'gallery'"
            :variant="'one'"
            :close="handleCloseModal"
            :handleChose="(value) => handleInput('image_url', value[0].image_url)"
         />
         <ConfirmModal
            v-if="isOpenModal === 'delete' && p.props.type === 'edit' && p.props.product"
            :close="handleCloseModal"
            :callback="handleDeleteProduct"
            :loading="isFetching === 'delete'"
            :title="`Delete product ' ${p.props.product.product_name} ' :v`"
         />
      </template>
   </Modal>
</template>
@/hooks/useProductAction
