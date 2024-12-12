<script setup lang="ts">
import { AddItem, ConfirmModal, Modal } from "@/components/Modal";
import { ModalRef } from "@/components/Modal/Modal.vue";
import { Box, Button, OverlayCta } from "@/components/ui";
import useStorageActions from "@/hooks/useStorageActions";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

type Props = {
   storage: ProductStorage;
   index: number;
};

const { index, storage } = defineProps<Props>();

type Modal = "edit" | "delete";

const modal = ref<Modal>("edit");

const modalRef = ref<ModalRef>();
const openModal = (m: Modal) => {
   modal.value = m;
   modalRef.value?.open();
};

const closeModal = () => {
   modalRef.value?.close();
};

// hooks
const { isFetching, storageActions } = useStorageActions({ closeModal });

type Edit = {
   variant: "edit";
   value: string;
};

type Delete = {
   variant: "delete";
};

const handleStorageActions = async (props: Delete | Edit) => {
   switch (props.variant) {
      case "edit":
         await storageActions({
            variant: "edit",
            id: storage.id,
            index,
            value: props.value,
         });

         break;
      case "delete":
         await storageActions({
            variant: "delete",
            index,
            id: storage.id,
         });

         break;
   }
};
</script>

<template>
   <Box>
      <template v-slot:children>
         <p>{{ storage.storage_name }}</p>
         <OverlayCta>
            <button class="p-1" :onClick="() => openModal('edit')">
               <PencilIcon class="w-6" />
            </button>
            <button class="p-1" :onClick="() => openModal('delete')">
               <TrashIcon class="w-6" />
            </button>
         </OverlayCta>
      </template>
   </Box>

   <Modal ref="modalRef">
      <template v-slot:children>
         <AddItem
            v-if="modal === 'edit'"
            :close-modal="closeModal"
            :submit="(value) => handleStorageActions({ variant: 'edit', value })"
            :loading="isFetching"
            :initValue="storage.storage_name"
            title="Edit storage"
         />

         <ConfirmModal
            v-if="modal === 'delete'"
            :close-modal="closeModal"
            :callback="() => handleStorageActions({ variant: 'delete' })"
            :loading="isFetching"
            :title="`Delete ' ${storage.storage_name} ' :v`"
         />
      </template>
   </Modal>
</template>
