<script lang="ts" setup>
import { CodeBracketIcon, PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { generateId } from "@/utils/appHelper";
import { computed, inject, ref } from "vue";

import { Button, Box, OverlayCta } from "@/components/ui";
import { AddItem, ConfirmModal, Modal } from "@/components/Modal";
import useCategory from "@/hooks/useCategory";
import JsonInput from "@/components/Modal/JsonInput.vue";
import useImportCategory from "@/hooks/useImportCategory";
import { ModalRef } from "@/components/Modal/Modal.vue";

type Modal = "close" | "edit" | "add" | "delete" | "import";

const modal = ref<Modal>("close");
const curCategoryIndex = ref<number>();
const modalRef = ref<ModalRef>();

const { addOrEditCategory, categories, deleteCategory, isFetching } = useCategory();

const { status, submit } = useImportCategory();

const openModal = (m: Modal) => {
   modal.value = m;
   modalRef.value?.open();
};

const closeModal = () => {
   modalRef.value?.close();
};

const curCategory = computed(() =>
   curCategoryIndex.value === undefined
      ? undefined
      : categories.value[curCategoryIndex.value]
);

const handleAddCategory = async (value: string, type: "Add" | "Edit") => {
   if (!value.trim()) {
      return;
   }

   const newCategory: CategorySchema = {
      category_name: value,
      category_name_ascii: generateId(value),
      attribute_order: "",
      is_show: 1,
   };

   switch (type) {
      case "Add":
         await addOrEditCategory({ type: "add", category: newCategory });
         break;

      case "Edit":
         if (curCategoryIndex.value === undefined) return;
         newCategory.attribute_order =
            categories.value[curCategoryIndex.value].attribute_order;

         await addOrEditCategory({
            type: "edit",
            category: newCategory,
            currentIndex: curCategoryIndex.value,
         });

         break;
   }

   modal.value = "close";
};

const handleDeleteCategory = async () => {
   await deleteCategory(curCategoryIndex.value);
   modal.value = "close";
};

type OpenModal = {
   modal: Modal;
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
         curCategoryIndex.value = props.currentIndex;
         break;
   }

   openModal(props.modal);
};

const mainClasses = inject("classes") as Record<string, string>;
</script>
<template>
   <div class="flex justify-between">
      <h1 :class="mainClasses.label">All Category</h1>

      <Button
         :onClick="() => (modal = 'import')"
         variant="push"
         border="clear"
         class="ml-auto"
      >
         <CodeBracketIcon class="w-6 mr-1" />
         Import
      </Button>
   </div>
   <div :class="`${mainClasses.group}`">
      <div :class="`${mainClasses.flexContainer} mt-[-16px]`">
         <template v-for="(category, index) in categories">
            <div v-if="!!category.is_show" :class="`w-1/6 ${mainClasses.flexCol}`">
               <Box className="bg-[#f4f6f8]">
                  <template v-slot:children>
                     <span class="font-[500] text-[#1f1f1f]">
                        {{ category.category_name }}</span
                     >
                     <OverlayCta>
                        <button
                           :onClick="
                              () =>
                                 handleOpenModal({
                                    currentIndex: index,
                                    modal: 'edit',
                                 })
                           "
                           :class="'p-1'"
                        >
                           <PencilSquareIcon class="w-[24px]" />
                        </button>
                        <button
                           :onClick="
                              () =>
                                 handleOpenModal({
                                    currentIndex: index,
                                    modal: 'delete',
                                 })
                           "
                           :class="'p-1'"
                        >
                           <TrashIcon class="w-[24px]" />
                        </button>
                     </OverlayCta>
                  </template>
               </Box>
            </div>
         </template>

         <div :class="`w-1/6 ${mainClasses.flexCol}`">
            <Box :onClick="() => handleOpenModal({ modal: 'add' })" />
         </div>
      </div>
   </div>

   <Modal ref="modalRef" :on-close="() => (status = 'input')">
      <template v-slot:children>
         <AddItem
            v-if="modal === 'add'"
            :closeModal="closeModal"
            :submit="(value) => handleAddCategory(value, 'Add')"
            :loading="isFetching"
            title="Add category"
         />

         <AddItem
            v-if="modal === 'edit' && curCategory"
            :closeModal="closeModal"
            :submit="(value) => handleAddCategory(value, 'Edit')"
            :loading="isFetching"
            :initValue="curCategory.category_name"
            :title="`Edit category '${curCategory.category_name}'  `"
         />

         <ConfirmModal
            v-if="modal === 'delete' && curCategory"
            :closeModal="closeModal"
            :callback="handleDeleteCategory"
            :loading="isFetching"
            :title="`Delete category '${curCategory.category_name}'`"
         />

         <JsonInput
            v-if="modal === 'import'"
            title="Import Category"
            :close-modal="closeModal"
            :submit="submit"
            :status="status"
         />
      </template>
   </Modal>
</template>
