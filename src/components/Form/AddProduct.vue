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
// import { useToastStore } from "@/stores/toast";
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
   product_ascii: "",
   product_name: "",
   brand_id: 0,
   installment: false,
} as ProductSchema;

const { props } = defineProps<Props>();

const productData = reactive<ProductSchema>({ ...initProduct });
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
         product_ascii: generateId(value),
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

type OpenModal = {
   modal: ProductModal;
};

interface OpenOtherModal extends OpenModal {
   modal: "gallery";
}
interface OpenDeleteModal extends OpenModal {
   modal: "delete";
}

const handleOpenModal = ({ ...props }: OpenOtherModal | OpenDeleteModal) => {
   switch (props.modal) {
      case "gallery":
      case "delete":
         break;
   }

   isOpenModal.value = props.modal;
};

const handleCloseModal = () => (isOpenModal.value = "close");

function resetForm() {
   const { category_id, brand_id, ...rest } = initProduct;
   Object.assign(productData, rest);
}

const handleSubmit = async () => {
   switch (props.type) {
      case "add":
         await productActions({ type: "add", product: productData });
         resetForm();
         break;

      case "edit":
         await productActions({
            type: "edit",
            product: productData,
            currentIndex: props.currentIndex,
         });

         isChange.value = false;
         break;
   }
};

const handleDeleteProduct = async () => {
   if (props.type === "edit" && props.product) {
      await productActions({ type: "delete", productAscii: props.product.product_ascii });
      Object.assign(productData, initProduct);

      props.cbAfterDelete && props.cbAfterDelete();
   }
};

watch(
   props,
   () => {
      const handleInitProduct = () => {
         if (props.type === "edit") {
            const { product } = props;
            if (product) {
               const category = categories.value.find(
                  (c) => c.id === product.category_id
               );
               if (category) {
                  curCategory.value = category;
                  Object.assign(productData, props.product);
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
         {{ props.type === "add" ? "Add new product" : "Edit product" }}
      </h1>
   </div>
   <div class="flex mx-[-8px] mt-[14px]">
      <div class="w-1/3 px-[8px]">
         <template v-if="!productData.image_url">
            <Box :onClick="() => handleOpenModal({ modal: 'gallery' })" />
         </template>

         <template v-else>
            <Box>
               <template v-slot:children>
                  <img :src="productData.image_url" alt="asd" />
                  <OverlayCta>
                     <Button
                        variant="clear"
                        size="clear"
                        colors="clear"
                        :class="inputClasses.overlayButton"
                        :onClick="() => handleOpenModal({ modal: 'gallery' })"
                     >
                        <ArrowPathIcon class="w-[24px]" />
                     </Button>
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

            <template v-if="props.type === 'add'">
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
            </template>
         </div>
      </div>
   </div>

   <div class="text-center">
      <Button
         class="mt-[30px]"
         variant="push"
         :onClick="handleSubmit"
         :loading="isFetching === 'add' || isFetching === 'edit'"
         :disabled="!isChange"
      >
         {{ props.type === "add" ? "Save" : "Save change" }}
      </Button>
   </div>

   <template v-if="props.type == 'edit'">
      <h5 class="text-red-500 mt-[30px] ${classes.label} font-semibold">DANGER ZONE</h5>
      <div class="border-red-500 border rounded-[16px] p-[14px]">
         <Button
            variant="push"
            :onClick="() => props.type === 'edit' && handleOpenModal({ modal: 'delete' })"
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
            v-if="isOpenModal === 'delete' && props.type === 'edit' && props.product"
            :close="handleCloseModal"
            :callback="handleDeleteProduct"
            :loading="isFetching === 'delete'"
            :title="`Delete product ' ${props.product.product_name} ' :v`"
         />
      </template>
   </Modal>
</template>
@/hooks/useProductAction
