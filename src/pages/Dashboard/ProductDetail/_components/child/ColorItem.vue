<script setup lang="ts">
import { AddItem, Modal } from "@/components/Modal";
import { Box, Button, OverlayCta } from "@/components/ui";
import useColorActions from "@/hooks/useColorActions";
import { inputClasses } from "@/utils/appHelper";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

type Modal = "edit" | "delete";

type Props = {
   color: ProductColor;
   index: number;
};

const { index, color } = defineProps<Props>();

const openModal = ref<Modal | "">("");
const closeModal = () => (openModal.value = "");

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
         <p>{{ color.color }}</p>
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
            :submit="(value) => handleColorActions({ variant: 'edit', value })"
            :loading="isFetching"
            :initValue="color.color"
            title="Edit Color"
         />

         <ConfirmModal
            v-if="openModal === 'delete'"
            :close="closeModal"
            :callback="() => handleColorActions({ variant: 'delete' })"
            :loading="isFetching"
            :title="`Delete color ' ' :v`"
         />
      </template>
   </Modal>
</template>
@/hooks/useColorActions