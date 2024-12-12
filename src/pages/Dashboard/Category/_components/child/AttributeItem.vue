<script setup lang="ts">
import DragAbleItem from "@/components/DragAbleItem.vue";
import { AddItem, ConfirmModal, Modal } from "@/components/Modal";
import { Button } from "@/components/ui";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
import { HandleAttributeActions } from "../Attribute.vue";

type Props = {
   attributeId: number;
   curCategory: Category;
   index: number;
   handleDragEnd: () => void;
   actions: HandleAttributeActions;
   isFetching: boolean;
};

const { attributeId, curCategory, index, handleDragEnd, actions, isFetching } =
   defineProps<Props>();

type Modal = "edit" | "delete";
const openModal = ref<Modal | "">("");

const foundedAttribute = computed(() => {
   let actuallyIndex: number | undefined;
   const attribute = curCategory.attributes.find((attr, index) => {
      if (attr.id === attributeId) {
         actuallyIndex = index;
         return true;
      }
      return false;
   });

   return { actuallyIndex: actuallyIndex, attribute };
});

const closeModal = () => (openModal.value = "");

const handleDeleteAttribute = async ({ id }: { id: number }) => {
   if (foundedAttribute.value.actuallyIndex === undefined) return;

   await actions({ variant: "delete", id, index: foundedAttribute.value.actuallyIndex });
   closeModal();
};

const handleEditAttribute = async ({ id, value }: { id: number; value: string }) => {
   if (foundedAttribute.value.actuallyIndex === undefined) return;

   await actions({
      variant: "edit",
      id,
      index: foundedAttribute.value.actuallyIndex,
      value,
   });
   closeModal();
};

const classes = {
   container:
      "px-[16px] py-[8px] rounded-[8px] bg-[#f4f6f8] select-none border-[2px] border-black/15",
   ctaContainer:
      "flex items-center space-x-[6px] ml-[10px]  pl-[10px] border-l-[1px] border-black/15",
   button: "text-[#3f3f3f] hover:text-[#cd1818] hover:scale-[1.1]",
};
</script>
<template>
   <p v-if="!foundedAttribute.attribute || foundedAttribute.actuallyIndex == undefined">
      attribute not found
   </p>

   <template v-else>
      <DragAbleItem
         :index="index"
         :handleDragEnd="handleDragEnd"
         :className="classes.container"
      >
         <div class="flex items-center">
            <span>{{ foundedAttribute.attribute.attribute_name }}</span>
            <div :class="classes.ctaContainer">
               <button :class="classes.button">
                  <PencilSquareIcon :onClick="() => (openModal = 'edit')" class="w-5" />
               </button>
               <button :class="classes.button">
                  <TrashIcon :onClick="() => (openModal = 'delete')" class="w-5" />
               </button>
            </div>
         </div>
      </DragAbleItem>

      <Modal v-if="!!openModal" :close="closeModal">
         <template v-slot:children>
            <AddItem
               v-if="openModal === 'edit'"
               :close="closeModal"
               :title="`Edit attribute '${foundedAttribute.attribute.attribute_name}'`"
               :initValue="foundedAttribute.attribute!.attribute_name"
               :submit="
                  (value) =>
                     handleEditAttribute({id: foundedAttribute.attribute!.id, value}
                     )
               "
               :loading="isFetching"
            />
            <ConfirmModal
               v-if="openModal === 'delete'"
               :close-modal="closeModal"
               :loading="isFetching"
               :title="`Delete attribute '${foundedAttribute.attribute.attribute_name}'`"
               :callback="() =>handleDeleteAttribute({id: foundedAttribute.attribute!.id})"
            />
         </template>
      </Modal>
   </template>
</template>
