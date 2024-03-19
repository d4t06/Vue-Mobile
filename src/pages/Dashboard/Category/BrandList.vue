<script lang="ts" setup>
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
import { generateId, inputClasses } from "@/utils/appHelper";
import { Button, Box, OverlayCta } from "@/components/ui";
import useBrandAction, { type BrandModal } from "@/composables/useBrandAction";
import Modal from "@/components/Modal/Modal.vue";
import { AddItem, ConfirmModal } from "@/components/Modal";
import type { BrandSchema } from "@/types";

const isOpenModal = ref<BrandModal>("close");
const curCategoryIndex = ref<number>();
const curBrandIndex = ref<number>();

// hooks
const curCategory = computed(() =>
   curCategoryIndex.value === undefined ? undefined : categories.value[curCategoryIndex.value]
);
const brandsByCategory = computed(() => (curCategory.value ? curCategory.value.brands : []));
const curBrand = computed(() =>
   curBrandIndex.value == undefined ? undefined : brandsByCategory.value[curBrandIndex.value]
);

const { brandActions, categories, isFetching } = useBrandAction({
   curCategoryIndex: curCategoryIndex,
   isOpenModal: isOpenModal,
});

type OpenModal = {
   modal: BrandModal;
};

interface OpenAddModal extends OpenModal {
   modal: "add";
}
interface OpenEditOrDeleteModal extends OpenModal {
   modal: "edit" | "delete";
   currentIndex: number;
}

const handleOpenModal = ({ ...props }: OpenAddModal | OpenEditOrDeleteModal) => {
   switch (props.modal) {
      case "delete":
      case "edit":
         curBrandIndex.value = props.currentIndex;
         break;
   }

   isOpenModal.value = props.modal;
};

const closeModal = () => (isOpenModal.value = "close");

const handleAddBrand = async (value: string, type: "add" | "edit") => {
   if (!value.trim() || !curCategory.value) return;

   const newBrand: BrandSchema = {
      brand_name: value,
      brand_ascii: generateId(value),
      category_id: curCategory.value.id,
      image_url: "",
   };

   switch (type) {
      case "add":
         await brandActions({ type: "add", brand: newBrand });
         break;

      case "edit":
         await brandActions({
            type: "edit",
            brand: newBrand,
            currentIndex: curCategoryIndex.value,
         });

         break;
   }
};

const handleDeleteBrand = async () => {
   await brandActions({ type: "delete", curBrandIndex: curBrandIndex.value });
};

const classes = {
   title: "text-[26px] font-[500] mb-[16px]",
   button:
      "text-[#333] rounded-[50%] bg-[#ccc] p-[4px] hover:text-white hover:bg-[#cd1818] hover:scale-[1.1] transition-transform",
};
</script>

<template>
   <h1 :class="classes.title">Brands</h1>
   <div v-if="!!categories.length" class="bg-[#fff] rounded-[8px] p-[20px]">
      <div class="mb-[15px] flex items-center">
         <p class="mr-[10px]">Category:</p>
         <div class="bg-[#ccc] rounded-[12px]">
            <select
               :class="`${inputClasses.input} min-w-[100px]`"
               :onChange="(e) => {
                if ((e.target as HTMLInputElement).value) curCategoryIndex = +(e.target as HTMLInputElement).value
               }"
            >
               <option :value="undefined">---</option>

               <template v-for="(category, index) in categories">
                  <option :value="index">
                     {{ category.category_name }}
                  </option>
               </template>
            </select>
         </div>
      </div>

      <template v-if="!!curCategory">
         <div :class="`flex flex-wrap -mx-[8px] -mt-[8px]  ${isFetching ? 'disable' : ''}`">
            <template v-for="(brand, index) in brandsByCategory">
               <div class="col w-2/12 px-[8px] mt-[8px]">
                  <Box class="bg-[#f1f1f1]">
                     <template v-slot:children>
                        <div class="">
                           <p class="text-[14px] text-center">{{ brand.brand_name }}</p>
                           <img :src="brand.image_url" alt="" />
                        </div>
                        <OverlayCta>
                           <Button
                              :onClick="
                                 () => handleOpenModal({ modal: 'edit', currentIndex: index })
                              "
                              :class="classes.button"
                              variant="clear"
                              size="clear"
                           >
                              <PencilSquareIcon class="w-[22px]" />
                           </Button>
                           <Button
                              :onClick="
                                 () => handleOpenModal({ modal: 'delete', currentIndex: index })
                              "
                              :class="classes.button"
                              variant="clear"
                              size="clear"
                           >
                              <TrashIcon class="w-[22px]" />
                           </Button>
                        </OverlayCta>
                     </template>
                  </Box>
               </div>
            </template>

            <div :class="`col w-2/12 px-[8px] mt-[8px] `">
               <Box :onClick="() => handleOpenModal({ modal: 'add' })" />
            </div>
         </div>
      </template>
   </div>

   <Modal :close="closeModal" v-if="isOpenModal !== 'close'">
      <AddItem
         v-if="isOpenModal === 'add'"
         :close="closeModal"
         :submit="(value) => handleAddBrand(value, 'add')"
         :loading="isFetching"
         title="Add brand"
      />

      <AddItem
         v-if="isOpenModal === 'edit' && curBrand"
         :close="closeModal"
         :submit="(value) => handleAddBrand(value, 'edit')"
         :loading="isFetching"
         :initValue="curBrand.brand_name"
         :title="`Edit brand '${curBrand.brand_name}'  `"
      />

      <ConfirmModal
         v-if="isOpenModal === 'delete' && curBrand"
         :close="closeModal"
         :callback="handleDeleteBrand"
         :loading="isFetching"
         :title="`Delete brand '${curBrand.brand_name}'`"
      />
   </Modal>
</template>
