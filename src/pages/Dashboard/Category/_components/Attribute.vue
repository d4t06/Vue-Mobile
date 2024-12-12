<script setup lang="ts">
import { AddItem, Modal } from "@/components/Modal";
import { Button } from "@/components/ui";
import useAttributeActions from "@/hooks/useAttributeActions";
import { useAppStore } from "@/stores/app";
import { generateId, inputClasses } from "@/utils/appHelper";
import { storeToRefs } from "pinia";
import { computed, inject, ref } from "vue";
import AttributeItem from "./child/AttributeItem.vue";
import { ModalRef } from "@/components/Modal/Modal.vue";
import { PlusIcon } from "@heroicons/vue/16/solid";
import dragProvider from "@/hooks/useDragItem";

type Modal = "add";

const { endIndex } = dragProvider();

const appStore = useAppStore();
const { categories } = storeToRefs(appStore);

const curCategoryIndex = ref<number | null>(null);
const modal = ref<Modal>("add");

const modalRef = ref<ModalRef>();

const openModal = (m: Modal) => {
   modal.value = m;
   modalRef.value?.open();
};

const closeModal = () => {
   modalRef.value?.close();
};

// hooks
const { attributeActions, sortAttribute, curCategory, isFetching } = useAttributeActions({
   curCategoryIndex: curCategoryIndex,
   closeModal,
});

const attributeIdOrder = computed(() =>
   curCategory.value && curCategory.value.attribute_order
      ? curCategory.value.attribute_order.split("_")
      : []
);

const handleSortAttribute = (startIndex: number) => {
   sortAttribute(startIndex, endIndex.value);
};

type Add = {
   variant: "add";
   value: string;
};

type Edit = {
   variant: "edit";
   index: number;
   id: number;
   value: string;
};

type Delete = {
   variant: "delete";
   index: number;
   id: number;
};

const handleAttributeActions = async (props: Add | Edit | Delete) => {
   if (curCategory.value === null) return;

   const newAttribute: CategoryAttributeSchema = {
      attribute_name: "",
      attribute_name_ascii: "",
      category_id: curCategory.value.id,
   };

   switch (props.variant) {
      case "add":
      case "edit":
         Object.assign(newAttribute, {
            attribute_name: props.value,
            attribute_name_ascii: generateId(props.value),
         } as Partial<CategoryAttributeSchema>);
   }

   switch (props.variant) {
      case "add":
         return await attributeActions({ variant: "add", attribute: newAttribute });
      case "edit": {
         const { id, index } = props;
         return await attributeActions({
            variant: "edit",
            attribute: newAttribute,
            id,
            index,
         });
      }

      case "delete": {
         const { id, index } = props;
         return await attributeActions({ variant: "delete", id, index });
      }
   }
};

export type HandleAttributeActions = typeof handleAttributeActions;

const classes = inject("classes") as Record<string, string>;
</script>

<template>
   <h1 :class="classes.label">Attributes</h1>
   <div v-if="!!categories.length" :class="classes.group">
      <div class="mb-[15px] flex items-center justify-between">
         <div class="flex items-center">
            <p class="mr-[10px]">Category:</p>
            <div class="bg-[#ccc] rounded-[12px]">
               <select
                  :class="`${inputClasses.input} min-w-[100px]`"
                  v-model="curCategoryIndex"
               >
                  <option value="">---</option>

                  <template v-for="(category, index) in categories">
                     <option v-if="category.is_show" :value="index">
                        {{ category.category_name }}
                     </option>
                  </template>
               </select>
            </div>
         </div>
         <Button
            :disabled="curCategoryIndex === null"
            variant="push"
            :onClick="() => openModal('add')"
         >
            <PlusIcon class="w-5 mr-1" />
            Add attribute
         </Button>
      </div>
      <template v-if="curCategory">
         <div
            :class="`flex flex-wrap mt-[14px] gap-[10px] ${isFetching ? 'disable' : ''}`"
         >
            <AttributeItem
               v-for="(attrId, index) in attributeIdOrder"
               :key="attrId + index"
               :index="index"
               :attributeId="+attrId"
               :curCategory="curCategory"
               :handleDragEnd="() => handleSortAttribute(index)"
               :actions="handleAttributeActions"
               :isFetching="isFetching"
            />
         </div>
      </template>
   </div>

   <Modal ref="modalRef">
      <template v-slot:children>
         <AddItem
            v-if="modal === 'add'"
            :close="closeModal"
            :title="'Add attribute_name'"
            :submit="(value) => handleAttributeActions({ variant: 'add', value })"
            :loading="isFetching"
         />
      </template>
   </Modal>
</template>
