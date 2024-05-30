<script setup lang="ts">
import { AddItem, ConfirmModal, Modal } from "@/components/Modal";
import { Box, Button, OverlayCta } from "@/components/ui";
import useStorageActions from "@/hooks/useStorageActions";
import { inputClasses } from "@/utils/appHelper";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

type Props = {
   storage: ProductStorage;
   index: number;
};

const { index, storage } = defineProps<Props>();

type Modal = "edit" | "delete";

const openModal = ref<Modal | "">("");
const closeModal = () => (openModal.value = "");

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
         <p>{{ storage.storage }}</p>
         <OverlayCta>
            <Button
               variant="clear"
               size="clear"
               colors="clear"
               :class="inputClasses.overlayButton"
               :onClick="() => (openModal = 'edit')"
            >
               <PencilIcon class="w-[20px]" />
            </Button>
            <Button
               variant="clear"
               size="clear"
               colors="clear"
               :class="inputClasses.overlayButton"
               :onClick="() => (openModal = 'delete')"
            >
               <TrashIcon class="w-[20px]" />
            </Button>
         </OverlayCta>
      </template>
   </Box>

   <Modal v-if="!!openModal" :close="closeModal">
      <template v-slot:children>
         <AddItem
            v-if="openModal === 'edit'"
            :close="closeModal"
            :submit="(value) => handleStorageActions({ variant: 'edit', value })"
            :loading="isFetching"
            :initValue="storage.storage"
            title="Edit storage"
         />

         <ConfirmModal
            v-if="openModal === 'delete'"
            :close="closeModal"
            :callback="() => handleStorageActions({ variant: 'delete' })"
            :loading="isFetching"
            :title="`Delete storage ' ' :v`"
         />
      </template>
   </Modal>
</template>
@/hooks/useStorageActions