<script lang="ts" setup>
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { computed, inject, ref } from "vue";
import { generateId, inputClasses } from "@/utils/appHelper";
import { Button, Box, OverlayCta } from "@/components/ui";
import useBrandAction, { type BrandModal } from "@/hooks/useBrandAction";
import Modal, { ModalRef } from "@/components/Modal/Modal.vue";
import { AddItem, ConfirmModal } from "@/components/Modal";

const modal = ref<BrandModal>("close");
const curCategoryIndex = ref<number>();
const curBrandIndex = ref<number>();

const modalRef = ref<ModalRef>();

const openModal = (m: BrandModal) => {
   modal.value = m;
   modalRef.value?.open();
};

const closeModal = () => {
   modalRef.value?.close();
};

// hooks
const curCategory = computed(() =>
   curCategoryIndex.value === undefined
      ? undefined
      : categories.value[curCategoryIndex.value]
);
const brandsByCategory = computed(() =>
   curCategory.value ? curCategory.value.brands : []
);
const curBrand = computed(() =>
   curBrandIndex.value == undefined
      ? undefined
      : brandsByCategory.value[curBrandIndex.value]
);

const { brandActions, categories, isFetching } = useBrandAction({
   curCategoryIndex: curCategoryIndex,
   isOpenModal: modal,
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

   openModal(props.modal);
};


const handleAddBrand = async (value: string, type: "add" | "edit") => {
   if (!value.trim() || !curCategory.value) return;

   const newBrand: BrandSchema = {
      brand_name: value,
      brand_name_ascii: generateId(value),
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
            currentIndex: curBrandIndex.value,
         });

         break;
   }
};

const handleDeleteBrand = async () => {
   await brandActions({ type: "delete", curBrandIndex: curBrandIndex.value });
};

const mainClasses = inject("classes") as Record<string, string>;

const classes = {
   button:
      "p-1",
};
</script>

<template>
   <h1 :class="mainClasses.label">Brands</h1>
   <div v-if="!!categories.length" :class="mainClasses.group">
      <div class="mb-[15px] flex items-center">
         <p class="mr-[10px] hidden sm:block">Category:</p>
         <div class="bg-[#ccc] rounded-[12px]">
            <select
               :class="`${inputClasses.input} min-w-[100px]`"
               :onChange="(e) => {
                if ((e.target as HTMLInputElement).value) curCategoryIndex = +(e.target as HTMLInputElement).value
               }"
            >
               <option :value="undefined">---</option>

               <template v-for="(category, index) in categories">
                  <option v-if="category.is_show" :value="index">
                     {{ category.category_name }}
                  </option>
               </template>
            </select>
         </div>
      </div>

      <template v-if="!!curCategory">
         <div
            :class="`${mainClasses.flexContainer}  mt-[-16px] ${
               isFetching ? 'disable' : ''
            }`"
         >
            <template v-for="(brand, index) in brandsByCategory">
               <div :class="`col w-1/2 md:w-2/12 ${mainClasses.flexCol}`">
                  <Box className="bg-[#f4f6f8]">
                     <template v-slot:children>
                        <div class="">
                           <p class="font-[500] text-[#1f1f1f] text-center">
                              {{ brand.brand_name }}
                           </p>
                           <img :src="brand.image_url" alt="" />
                        </div>
                        <OverlayCta>
                           <button
                              :onClick="
                                 () =>
                                    handleOpenModal({
                                       modal: 'edit',
                                       currentIndex: index,
                                    })
                              "
                              :class="classes.button"
                           >
                              <PencilSquareIcon class="w-6" />
                           </button>
                           <button
                              :onClick="
                                 () =>
                                    handleOpenModal({
                                       modal: 'delete',
                                       currentIndex: index,
                                    })
                              "
                              :class="classes.button"
                           >
                              <TrashIcon class="w-6" />
                           </button>
                        </OverlayCta>
                     </template>
                  </Box>
               </div>
            </template>

            <div :class="`w-1/2 md:w-2/12 ${mainClasses.flexCol}`">
               <Box :onClick="() => handleOpenModal({ modal: 'add' })" />
            </div>
         </div>
      </template>
   </div>

   <Modal ref="modalRef">
      <template v-slot:children>
         <AddItem
            v-if="modal === 'add'"
            :close-modal="closeModal"
            :submit="(value) => handleAddBrand(value, 'add')"
            :loading="isFetching"
            title="Add brand"
         />

         <AddItem
            v-if="modal === 'edit' && curBrand"
            :close-modal="closeModal"
            :submit="(value) => handleAddBrand(value, 'edit')"
            :loading="isFetching"
            :initValue="curBrand.brand_name"
            :title="`Edit brand '${curBrand.brand_name}'  `"
         />

         <ConfirmModal
            v-if="modal === 'delete' && curBrand"
            :closeModal="closeModal"
            :callback="handleDeleteBrand"
            :loading="isFetching"
            :title="`Delete brand '${curBrand.brand_name}'`"
         />
      </template>
   </Modal>
</template>
