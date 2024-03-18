<script lang="ts" setup>
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { generateId } from "@/utils/appHelper";
import { computed, ref } from "vue";
import type { CategorySchema } from "@/types";
import { Button, Box, OverlayCta } from "@/components/ui";
import { AddItem, ConfirmModal, Modal } from "@/components/Modal";
import useCategory from "@/composables/useCategory";

type Modal = "close" | "edit" | "add" | "delete";

const isOpenModal = ref<Modal>("close");
const curCategoryIndex = ref<number>();

const appStore = useAppStore();
const { categories } = storeToRefs(appStore);
const { addOrEditCategory, deleteCategory, isFetching } = useCategory();

const curCategory = computed(() =>
   curCategoryIndex.value === undefined ? undefined : categories.value[curCategoryIndex.value]
);

const closeModal = () => (isOpenModal.value = "close");

const handleAddCategory = async (value: string, type: "Add" | "Edit") => {
   if (!value.trim()) {
      return;
   }

   const newCategory: CategorySchema = {
      category_name: value,
      category_ascii: generateId(value),
      hidden: false,
   };

   switch (type) {
      case "Add":
         await addOrEditCategory({ type: "add", category: newCategory });
         break;

      case "Edit":
         await addOrEditCategory({
            type: "edit",
            category: newCategory,
            currentIndex: curCategoryIndex.value,
         });

         break;
   }

   isOpenModal.value = "close";
};

const handleDeleteCategory = async () => {
   await deleteCategory(curCategoryIndex.value);
   isOpenModal.value = "close";
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

   isOpenModal.value = props.modal;
};

const classes = {
   button:
      "text-[#333] rounded-[50%] bg-[#ccc] p-[4px] hover:text-white hover:bg-[#cd1818] hover:scale-[1.1] transition-transform",
};
</script>
<template>
   <h1 class="text-[26px] font-[500] mb-[16px]">All Category</h1>

   <div class="flex flex-wrap -mx-[8px] -mt-[8px]">
      <template v-for="(category, index) in categories">
         <div class="w-1/6 px-[8px] mt-[8px]">
            <Box>
               <template v-slot:children>
                  {{ category.category_name }}
                  <OverlayCta>
                     <Button
                        :onClick="() => handleOpenModal({ currentIndex: index, modal: 'edit' })"
                        :className="classes.button"
                        variant="clear"
                        size="clear"
                     >
                        <PencilSquareIcon class="w-[22px]" />
                     </Button>
                     <Button
                        :onClick="() => handleOpenModal({ currentIndex: index, modal: 'delete' })"
                        :className="classes.button"
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

      <div class="w-1/6 mt-[8px] px-[8px]">
         <Box :onClick="() => handleOpenModal({ modal: 'add' })" />
      </div>
   </div>

   <Modal :close="closeModal" v-if="isOpenModal !== 'close'">
      <AddItem
         v-if="isOpenModal === 'add'"
         :close="closeModal"
         :submit="(value) => handleAddCategory(value, 'Add')"
         :loading="isFetching"
         title="Add category"
      />

      <AddItem
         v-if="isOpenModal === 'edit' && curCategory"
         :close="closeModal"
         :submit="(value) => handleAddCategory(value, 'Add')"
         :loading="isFetching"
         :initValue="curCategory.category_name"
         :title="`Edit category '${curCategory.category_name}'  `"
      />

      <ConfirmModal
         v-if="isOpenModal === 'delete' && curCategory"
         :close="closeModal"
         :callback="handleDeleteCategory"
         :loading="isFetching"
         :title="`Delete category '${curCategory.category_name}'`"
      />
   </Modal>
</template>
