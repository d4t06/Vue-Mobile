<script setup lang="ts">
import { AddItem, Modal } from "@/components/Modal";
import ConfirmModal from "@/components/Modal/ConfirmModal.vue";
import { ModalRef } from "@/components/Modal/Modal.vue";
import { Box, Button, OverlayCta } from "@/components/ui";
import useColorActions from "@/hooks/useColorActions";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

type Modal = "edit" | "delete";

type Props = {
   color: ProductColor;
   index: number;
};

const { index, color } = defineProps<Props>();

const modal = ref<Modal>("edit");

const modalRef = ref<ModalRef>();
const openModal = (m: Modal) => {
   modal.value = m;
   modalRef.value?.open();
};

const closeModal = () => {
   modalRef.value?.close();
};

const { colorActions, isFetching } = useColorActions({ closeModal });

type Edit = {
   variant: "edit";
   value: string;
};

type Delete = {
   variant: "delete";
};

const handleColorActions = async (props: Edit | Delete) => {
   switch (props.variant) {
      case "edit": {
         await colorActions({ variant: "edit", id: color.id, index, value: props.value });
         break;
      }

      case "delete": {
         await colorActions({ variant: "delete", id: color.id, index });
         break;
      }
   }
};
</script>

<template>
   <Box>
      <template v-slot:children>
         <p>{{ color.color_name }}</p>
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
            :submit="(value) => handleColorActions({ variant: 'edit', value })"
            :loading="isFetching"
            :initValue="color.color_name"
            title="Edit Color"
         />

         <ConfirmModal
            v-if="modal === 'delete'"
            :closeModal="closeModal"
            :callback="() => handleColorActions({ variant: 'delete' })"
            :loading="isFetching"
            :title="`Delete '${color.color_name}' :v`"
         />
      </template>
   </Modal>
</template>
