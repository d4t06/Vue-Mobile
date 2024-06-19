<script setup lang="ts">
import { AddItemTextArea, Modal } from "@/components/Modal";
import { Button } from "@/components/ui";
import useSpecActions from "@/hooks/useSpecActions";
import { useProductDetailStore } from "@/stores/productDetail";
import { PencilSquareIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

type Props = {
   orderId: number;
};

const { orderId } = defineProps<Props>();

const p = useProductDetailStore();
const { productDetail } = storeToRefs(p);

const openModal = ref(false);
const closeModal = () => (openModal.value = false);

// hooks
const { isFetching, specActions } = useSpecActions({ closeModal });

const foundedCatAttribute = computed(() =>
   productDetail.value?.category.attributes.find((attr) => attr.id === orderId)
);

const foundedAttribute = computed(() => {
   if (!productDetail.value || !foundedCatAttribute.value)
      return { actuallyIndex: undefined, attribute: undefined };

   let actuallyIndex: number | undefined;
   const attribute = productDetail.value.attributes.find((attr, index) => {
      if (attr.category_attribute_id === orderId) {
         actuallyIndex = index;
         return true;
      }
      return false;
   });

   return { actuallyIndex: actuallyIndex, attribute };
});

const handleSpecActions = async (value: string) => {
   if (!productDetail.value || !foundedCatAttribute.value) return;

   const productAttribute: ProductAttributeSchema = {
      category_attribute_id: orderId,
      product_id: productDetail.value.id,
      value: value,
   };

   if (foundedAttribute.value.attribute) {
      if (foundedAttribute.value.actuallyIndex === undefined)
         return console.log("product attribute not found");

      return await specActions({
         variant: "edit",
         id: foundedAttribute.value.attribute.id,
         index: foundedAttribute.value.actuallyIndex,
         productAttribute: productAttribute,
      });
   }

   return specActions({ variant: "add", productAttribute });
};
</script>
<template>
   <template v-if="foundedCatAttribute">
      <tr class="hover:bg-[#f1f1f1]">
         <td>
            {{ foundedCatAttribute.attribute_name }}
         </td>
         <td>
            <p class="mr-[20px] whitespace-break-spaces">
               {{ foundedAttribute.attribute?.value || "..." }}
            </p>
         </td>
         <td class="text-right">
            <Button variant="push" colors="secondary" :onClick="() => (openModal = true)">
               <PencilSquareIcon class="w-[22px] mr-[6px]" />
               Change
            </Button>
         </td>
      </tr>

      <Modal v-if="openModal" :close="closeModal">
         <template v-slot:children>
            <AddItemTextArea
               :close="closeModal"
               :loading="isFetching"
               :title="`Edit '${foundedCatAttribute.attribute_name}''`"
               :initValue="foundedAttribute.attribute?.value || ''"
               :submit="(value) => handleSpecActions(value)"
            />
         </template>
      </Modal>
   </template>
</template>
