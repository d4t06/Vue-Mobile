<script lang="ts" setup>
import Modal, { ModalRef } from "@/components/Modal/Modal.vue";
import Box from "@/components/ui/Box.vue";
import MyInput from "@/components/ui/MyInput.vue";
import OverlayCta from "@/components/ui/OverlayCta.vue";
import { useAppStore } from "@/stores/app";
import { inputClasses } from "@/utils/appHelper";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import Gallery from "../Gallery.vue";
import useProductAction, { type ProductModal } from "@/hooks/useProductAction";
import Button from "@/components/ui/Button.vue";
import ModalHeader from "../Modal/ModalHeader.vue";

type BaseProps = {
   closeModal: () => void;
};

type AddProduct = BaseProps & {
   type: "add";
};

type EditProduct = BaseProps & {
   type: "edit";
   product: ProductList;
   currentIndex: number;
};

type Props = {
   props: AddProduct | EditProduct;
};

const initProduct = {
   image_url: "",
   product_name: "",
   product_name_ascii: "test",
} as ProductSchema;

const groupProps = defineProps<Props>();

const productData = reactive<ProductSchema>(initProduct);
const modal = ref<ProductModal>("close");
// const curCategory = ref<Category>();

const isChange = ref(false);

const appStore = useAppStore();
const { categories } = storeToRefs(appStore);
const { isFetching, productActions } = useProductAction();
const modalRef = ref<ModalRef>();

const curCategory = computed(() => {
   return categories.value.find((c) => c.id === productData.category_id);
});

const brandsByCategory = computed(() =>
   curCategory.value ? curCategory.value.brands : [],
);

const openModal = (m: ProductModal) => {
   modal.value = m;
   modalRef.value?.open();
};

const closeModal = () => {
   modalRef.value?.close();
};

// const handleInput = (field: keyof typeof productData, value: any) => {
//    // also set product_name_ascii
//    if (field === "product_name") {
//       Object.assign(productData, {
//          [field]: value,
//          product_name_ascii: generateId(value),
//       });

//       isChange.value = true;
//       return;
//    }

//    if (field === "category_id") {
//       const founded = categories.value.find((cat) => cat.id === value);

//       if (!founded) return;
//       curCategory.value = founded;
//    }
//    isChange.value = true;
//    Object.assign(productData, { [field]: value });
// };

function resetForm() {
   const { category_id, brand_id, ...rest } = initProduct;
   Object.assign(productData, rest);
}

const handleSubmit = async () => {
   if (
      productData.brand_id === undefined ||
      productData.category_id === undefined ||
      !productData.product_name
   )
      return;

   switch (groupProps.props.type) {
      case "add":
         await productActions({ type: "add", product: productData });
         resetForm();
         break;

      case "edit":
         await productActions({
            type: "edit",
            product: productData,
            index: groupProps.props.currentIndex,
            id: groupProps.props.product.id,
         });

         isChange.value = false;
         break;
   }
};

watch(
   [groupProps],
   () => {
      const handleInitProduct = () => {
         if (groupProps.props.type === "edit") {
            if (!groupProps.props.product) return;

            Object.assign(productData, groupProps.props.product);
         }
      };

      handleInitProduct();
   },
   { immediate: true, flush: "post" },
);
</script>

<template>
   <div class="w-[700px] max-w-[85vw]">
      <ModalHeader
         :close-modal="groupProps.props.closeModal"
         :title="groupProps.props.type === 'add' ? 'Add new product' : 'Edit product'"
      />

      <div class="max-h-[50vh] overflow-auto flex flex-col sm:flex-row -mx-2 mt-3">
         <div class="mx-auto w-2/3 sm:w-1/3 px-2">
            <template v-if="!productData.image_url">
               <Box :onClick="() => openModal('gallery')" />
            </template>

            <template v-else>
               <Box>
                  <template v-slot:children>
                     <img :src="productData.image_url" alt="asd" />
                     <OverlayCta>
                        <button class="p-1" @click="() => openModal('gallery')">
                           <ArrowPathIcon class="w-6" />
                        </button>
                     </OverlayCta>
                  </template>
               </Box>
            </template>
         </div>

         <div class="mt-5 flex-1">
            <div class="space-y-3 px-2">
               <div class="space-y-1">
                  <label class="font-[500] text-[#1f1f1f]" htmlFor="name">
                     Product name</label
                  >
                  <MyInput v-model="productData.product_name" />
               </div>

               <template v-if="groupProps.props.type === 'add'">
                  <div class="space-y-1">
                     <label class="font-[500] text-[#1f1f1f]" htmlFor="category"
                        >Category</label
                     >
                     <select
                        v-model="productData.category_id"
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

               <div :class="`space-y-1 ${!curCategory ? 'disable' : ''}`">
                  <label class="font-[500] text-[#1f1f1f]" htmlFor="brand">Brand </label>
                  <select
                     v-model="productData.brand_id"
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

      <div class="text-right mt-5">
         <Button
            variant="push"
            border="clear"
            :onClick="handleSubmit"
            :loading="isFetching === 'add' || isFetching === 'edit'"
         >
            {{ groupProps.props.type === "add" ? "Save" : "Save" }}
         </Button>
      </div>
   </div>

   <Modal ref="modalRef">
      <template v-slot:children>
         <Gallery
            v-if="modal === 'gallery'"
            :variant="'one'"
            :close="closeModal"
            :handleChose="(value) => (productData['image_url'] = value[0].image_url)"
         />
      </template>
   </Modal>
</template>
