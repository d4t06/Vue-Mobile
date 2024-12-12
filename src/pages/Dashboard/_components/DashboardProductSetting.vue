<script setup lang="ts">
import { ConfirmModal } from "@/components/Modal";
import Modal, { ModalRef } from "@/components/Modal/Modal.vue";
import Popup from "@/components/Popup/Popup.vue";
import PopupContent from "@/components/Popup/PopupContent.vue";
import PopupTrigger, { TriggerRef } from "@/components/Popup/PopupTrigger.vue";
import PopupWrapper from "@/components/Popup/PopupWrapper.vue";
import useProductAction from "@/hooks/useProductAction";
import { Cog6ToothIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

type Props = {
   index: number;
   product: ProductList;
};

type Modal = "delete";

const props = defineProps<Props>();

const modal = ref<Modal>("delete");

// template ref
const modalRef = ref<ModalRef>();
const triggerRef = ref<TriggerRef>();

const { isFetching, productActions } = useProductAction();

const openModal = (m: Modal) => {
   modal.value = m;
   triggerRef.value?.close();
   modalRef.value?.open();
};

const closeModal = () => {
   modalRef.value?.close();
};

const handleDeleteProduct = async () => {
   await productActions({
      type: "delete",
      id: props.product.id,
   });
};
</script>

<template>
   <Popup>
      <PopupTrigger
         ref="triggerRef"
         variant="push"
         colors="secondary"
         size="clear"
         class-name="p-1"
      >
         <Cog6ToothIcon class="w-6" />
      </PopupTrigger>
      <PopupContent>
         <PopupWrapper>
            <RouterLink :to="`product/${props.product.id}`">
               <Cog6ToothIcon class="w-5" />
               <span>Go to edit</span>
            </RouterLink>

            <button @click="() => openModal('delete')">
               <TrashIcon class="w-5" />
               <span>Delete</span>
            </button>
         </PopupWrapper>
      </PopupContent>
   </Popup>

   <Modal ref="modalRef">
      <template v-slot:children>
         <ConfirmModal
            v-if="modal === 'delete'"
            :closeModal="closeModal"
            :loading="isFetching === 'delete'"
            :title="`Delete product '${props.product.product_name}' :v`"
            :callback="handleDeleteProduct"
         />
      </template>
   </Modal>
</template>
