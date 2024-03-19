<script lang="ts" setup>
import Modal from "@/components/Modal/Modal.vue";
import Box from "@/components/ui/Box.vue";
import MyInput from "@/components/ui/MyInput.vue";
import OverlayCta from "@/components/ui/OverlayCta.vue";
import { useAppStore } from "@/stores/app";
import type { Category, Product, ProductSchema } from "@/types";
import { generateId, inputClasses } from "@/utils/appHelper";
import { ArrowPathIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";
import Gallery from "../Gallery.vue";
import Button from "@/components/ui/Button.vue";
import useProductAction, { type ProductModal } from "@/composables/useProductAction";

type AddProduct = {
   type: "add";
};

// type EditProduct = {
//    type: "edit";
//    product: Product;
//    currentIndex: number;
// };

type Props = AddProduct;

const initProduct = {
   category_id: 0,
   image_url: "",
   product_ascii: "",
   product_name: "",
   brand_id: 0,
   installment: false,
   price: 0,
} as ProductSchema;

const handleInitProduct = (props: Props) => {
   switch (props.type) {
      case "add":
         return initProduct;
      // case "edit":
      //    return props.product;
   }
};

const { ...props } = defineProps<Props>();

const productData = reactive<ProductSchema>(handleInitProduct(props));
const isOpenModal = ref<ProductModal>("close");
const curCategory = ref<Category>();
const curProductID = ref<number>();

const appStore = useAppStore();
const { categories } = storeToRefs(appStore);
const { isFetching, productActions } = useProductAction({ isOpenModal });

const brandsByCategory = computed(() => (curCategory.value ? curCategory.value.brands : []));

const handleInput = (field: keyof typeof productData, value: any) => {
   // also set product_name_ascii
   if (field === "product_name") {
      Object.assign(productData, {
         ...productData,
         [field]: value,
         product_ascii: generateId(value),
      });
   }

   if (field === "category_id") {
      const founded = categories.value.find((cat) => cat.id === value);

      if (!founded) return;
      curCategory.value = founded;
   }

   Object.assign(productData, { ...productData, [field]: value });
};

type OpenModal = {
   modal: ProductModal;
};

interface OpenOtherModal extends OpenModal {
   modal: "gallery";
}
interface OpenDeleteModal extends OpenModal {
   modal: "delete";
   id: number;
}

const handleOpenModal = ({ ...props }: OpenOtherModal | OpenDeleteModal) => {
   switch (props.modal) {
      case "gallery":
         break;

      case "delete":
         curProductID.value = props.id;
   }

   isOpenModal.value = props.modal;
};

const handleSubmit = async () => {
   switch (props.type) {
      case "add":
         await productActions({ type: "add", product: productData });
         Object.assign(productData, initProduct);
         break;

      // case "edit":
      //    const { currentIndex } = props;
      //    await productActions({ type: "edit", product: productData, currentIndex });
      //    break;
   }
};

const handleDeleteProduct = async (id: number) => {
   await productActions({ type: "delete", productID: id });
};
</script>

<template>
   <div class="flex items-center space-x-[8px]">
      <PencilSquareIcon class="w-[24px]" />
      <h1 class="text-[26px] font-[500]">Add new product</h1>
   </div>
   <div class="flex mx-[-8px] mt-[14px]">
      <div class="w-1/3 px-[8px]">
         <Box
            v-if="!productData.image_url"
            :onClick="() => handleOpenModal({ modal: 'gallery' })"
         />

         <Box v-else>
            <img :src="productData.image_url" alt="asd" />
            <OverlayCta>
               <Button :onClick="() => handleOpenModal({ modal: 'gallery' })">
                  <ArrowPathIcon class="w-[24px]" />
               </Button>
            </OverlayCta>
         </Box>
      </div>

      <div class="flex-1">
         <div class="space-y-[14px] px-[8px]">
            <div class="space-y-[4px]">
               <label htmlFor=""> Product name </label>
               <MyInput
                  name="name"
                  :value="productData.product_name"
                  :onChange="(e: any) => handleInput('product_name', e.target.value)"
               />
            </div>

            <div class="space-y-[4px]">
               <label htmlFor="">Category</label>
               <select
                  name="category"
                  :value="productData.category_id"
                  :onChange="(e: any) => handleInput('category_id', +e.target.value)"
                  :class="inputClasses.input"
               >
                  <option :value="undefined">- - -</option>
                  <option v-for="cat in categories" :value="cat.id">
                     {{ cat.category_name }}
                  </option>
               </select>
            </div>

            <div class="space-y-[4px]">
               <label htmlFor="">Brand</label>
               <select
                  name="brand"
                  :value="productData.brand_id"
                  :onChange="(e: any) => handleInput('brand_id', +e.target.value)"
                  :class="inputClasses.input"
               >
                  <option :value="undefined">- - -</option>
                  <option v-for="brand in brandsByCategory" :value="brand.id">
                     {{ brand.brand_name }}
                  </option>
               </select>
            </div>

            <div class="space-y-[4px]">
               <label htmlFor="">Price</label>
               <MyInput
                  name="price"
                  :value="productData.price"
                  :onChange="(e: any) => handleInput('price', e.target.value)"
                  placeholder=""
               />
            </div>
         </div>
      </div>
   </div>

   <div class="text-center">
      <Button
         class="mt-[30px]"
         variant="push"
         :onClick="handleSubmit"
         :loading="isFetching"
         :disabled="false"
      >
         Save
      </Button>
   </div>

   <!-- <template v-if="props.type == 'edit'">
      <h5 class="text-red-500 mt-[30px] ${classes.label} font-semibold">DANGER ZONE</h5>
      <div class="border-red-500 border rounded-[16px] p-[14px]">
         <Button
            :onClick="
               () =>
                  props.type === 'edit' &&
                  handleOpenModal({ modal: 'delete', id: props.product.id })
            "
         >
            Delete Product
         </Button>
      </div>
   </template> -->

   <Modal v-if="isOpenModal !== 'close'" :close="() => (isOpenModal = 'close')">
      <Gallery />
   </Modal>
</template>
