<script lang="ts" setup>
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
import { inputClasses } from "@/utils/appHelper";
import { Button } from "@/components/ui";
import Modal from "@/components/Modal/Modal.vue";
import { ConfirmModal } from "@/components/Modal";
import type { PriceRangeSchema } from "@/types";
import usePriceRangeActions from "@/composables/usePriceRangeActions";
import type { PriceRangeModal } from "@/composables/usePriceRangeActions";
import AddPriceRange from "@/components/Form/AddPriceRange.vue";

const isOpenModal = ref<PriceRangeModal>("close");
const curCategoryIndex = ref<number>();

const curPriceRangeIndex = ref<number>();

// hooks
const { priceRangeActions, categories, isFetching } = usePriceRangeActions({
   curCategoryIndex: curCategoryIndex,
   isOpenModal: isOpenModal,
});

const curCategory = computed(() =>
   curCategoryIndex.value === undefined ? undefined : categories.value[curCategoryIndex.value]
);

const priceRangesByCategory = computed(() =>
   curCategory.value ? curCategory.value.price_ranges : []
);

const curPriceRange = computed(() =>
   curPriceRangeIndex.value == undefined
      ? undefined
      : priceRangesByCategory.value[curPriceRangeIndex.value]
);

type OpenModal = {
   modal: PriceRangeModal;
};

interface OpenAddModal extends OpenModal {
   modal: "add";
}
interface OpenEditOrDeleteModal extends OpenModal {
   modal: "edit" | "delete";
   currentIndex: number;
}

/**
 * or use reactive and Object assign
 */
const handleOpenModal = ({ ...props }: OpenAddModal | OpenEditOrDeleteModal) => {
   switch (props.modal) {
      case "delete":
      case "edit":
         curPriceRangeIndex.value = props.currentIndex;
         break;
   }

   isOpenModal.value = props.modal;
};

const closeModal = () => (isOpenModal.value = "close");

const handleAddBrand = async (data: PriceRangeSchema, type: "add" | "edit") => {
   if (!curCategory.value) return;

   switch (type) {
      case "add":
         await priceRangeActions({ type: "add", priceRange: data });
         break;

      case "edit":
         if (!curPriceRange.value || !curPriceRangeIndex.value) return;
         await priceRangeActions({
            type: "edit",
            priceRange: data,
            currentIndex: curPriceRangeIndex.value,
            id: curPriceRange.value.id,
         });

         break;
   }
};

const handleDeleteBrand = () => {
   if (!curPriceRange.value) return;
   priceRangeActions({ type: "delete", id: curPriceRange.value.id });
};

const classes = {
   title: "text-[26px] font-[500] mb-[16px]",
   priceRangeItem:
      "flex border mt-[8px] bg-[#f1f1f1] border-black/15 items-center px-[16px] py-[8px] rounded-[6px]",
   cta: "text-[#333] hover:text-[#cd1818]",
};
</script>

<template>
   <h1 :class="classes.title">Price ranges</h1>
   <div v-if="!!categories.length" class="bg-[#fff] rounded-[8px] p-[20px]">
      <div class="mb-[15px] flex items-center justify-between">
         <div class="flex items-center">
            <p class="mr-[10px]">Category:</p>
            <div class="bg-[#ccc] rounded-[12px]">
               <select
                  :class="`${inputClasses.input} min-w-[100px]`"
                  :onChange="(e) => {
                    if ((e.target as HTMLInputElement).value) curCategoryIndex = +(e.target as HTMLInputElement).value
                   }"
               >
                  <option :value="undefined">---</option>

                  <template v-for="(category, index) in categories">
                     <option v-if="category.is_show" :value="index">
                        {{ category.category_name }}
                     </option>
                  </template>
               </select>
            </div>
         </div>
         <Button
            :disabled="!curCategory"
            variant="push"
            :onClick="() => handleOpenModal({ modal: 'add' })"
         >
            Add price
         </Button>
      </div>

      <template v-if="!!curCategory">
         <div :class="`flex flex-wrap  -mt-[8px] space-x-[8px] ${isFetching ? 'disable' : ''}`">
            <template v-for="(priceRange, index) in priceRangesByCategory">
               <div :class="classes.priceRangeItem">
                  <p class="text-[#333]">
                     {{ priceRange.label }}
                     <span class="text-[#666]">
                        ({{ priceRange.from_price }} - {{ priceRange.to_price }})</span
                     >
                  </p>
                  <div
                     class="flex items-center space-x-[6px] ml-[10px] pl-[10px] border-l-[2px] border-[#ccc]"
                  >
                     <button
                        :class="classes.cta"
                        :onClick="() => handleOpenModal({ modal: 'edit', currentIndex: index })"
                     >
                        <PencilSquareIcon class="w-[22px]" />
                     </button>
                     <button
                        :class="classes.cta"
                        :onClick="() => handleOpenModal({ modal: 'delete', currentIndex: index })"
                     >
                        <TrashIcon class="w-[22px]" />
                     </button>
                  </div>
               </div>
            </template>
         </div>
      </template>
   </div>

   <Modal :close="closeModal" v-if="isOpenModal !== 'close'">
      <AddPriceRange
         v-if="isOpenModal === 'add' && curCategory"
         :close="closeModal"
         :submit="(data) => handleAddBrand(data, 'add')"
         :loading="isFetching"
         :categoryID="curCategory.id"
         title="Add price range"
      />

      <AddPriceRange
         v-if="isOpenModal === 'edit' && curPriceRange && curCategory"
         :close="closeModal"
         :submit="(value) => handleAddBrand(value, 'edit')"
         :loading="isFetching"
         :initValue="curPriceRange"
         :key="curPriceRange.label"
         :title="`Edit price '${curPriceRange.label}'  `"
         :categoryID="curCategory.id"
      />

      <ConfirmModal
         v-if="isOpenModal === 'delete' && curPriceRange"
         :close="closeModal"
         :callback="handleDeleteBrand"
         :loading="isFetching"
         :title="`Delete price '${curPriceRange.label}'`"
      />
   </Modal>
</template>
