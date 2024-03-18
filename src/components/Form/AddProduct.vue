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
import { reactive, ref } from "vue";
import Gallery from "../Gallery.vue";
import Button from "@/components/ui/Button.vue";

const PRODUCT_URL = "/products";

type AddProduct = {
   type: "Add";
};

type EditProduct = {
   type: "Edit";
   product: Product;
};
// union type
type Props = AddProduct | EditProduct;

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
      case "Add":
         return initProduct;
      case "Edit":
         return props.product;
   }
};

const { ...props } = defineProps<Props>();

const productData = reactive<ProductSchema>(handleInitProduct(props));
const isOpenModal = ref(false);
const curCategory = ref<Category>();

const isFetching = ref(false);
// const nameRef = ref<HTMLInputElement | null>(null);

const appStore = useAppStore();
const { categories } = storeToRefs(appStore);

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

const handleSubmit = async () => {
   try {
      switch (props.type) {
         case "Add":
            console.log(">>> Add product");
            return;
         case "Edit":
            console.log(">>> Edit product");
      }
   } catch (error) {}
};
</script>

<template>
   <div class="flex items-center space-x-[8px]">
      <PencilSquareIcon class="w-[24px]" />
      <h1 class="text-[26px] font-[500]">Add new product</h1>
   </div>
   <div class="flex mx-[-8px] mt-[14px]">
      <div class="w-1/3 px-[8px]">
         <Box v-if="!productData.image_url" :onClick="() => (isOpenModal = true)" />

         <Box v-else>
            <img :src="productData.image_url" alt="asd" />
            <OverlayCta>
               <Button :onClick="() => (isOpenModal = true)">
                  <ArrowPathIcon class="w-[24px]" />
               </Button>
            </OverlayCta>
         </Box>
      </div>

      <div class="flex-1">
         <div class="space-y-[14px] px-[8px]">
            <div class="space-y-[4px]">
               <label htmlFor=""> Tên sản phẩm </label>
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
                  <option v-for="cat in categories" :value="cat.id">
                     {{ cat.category_name }}
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

   <Modal v-if="isOpenModal" :close="() => (isOpenModal = false)">
      <Gallery />
   </Modal>
</template>
