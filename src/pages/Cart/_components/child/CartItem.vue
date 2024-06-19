<script setup lang="ts">
import { ConfirmModal, Modal } from "@/components/Modal";
import { Button } from "@/components/ui";
import useCartAction from "@/hooks/useCartAction";
import { useCartStore } from "@/stores/cart";
import { moneyFormat } from "@/utils/appHelper";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import VarianList from "./VarianList.vue";
import { CheckIcon } from "@heroicons/vue/16/solid";

type Props = {
   cartItem: cartItemDetail;
   index: number;
   isChecked: boolean;
};

const props = defineProps<Props>();

const cartStore = useCartStore();

// hooks
const { actions, isFetching } = useCartAction();

const openModal = ref(false);

const closeModal = () => (openModal.value = false);

const handleToggle = () => {
   cartStore.selectCartItem([props.cartItem.item.id]);
};

const classes = {
   imageFrame: "relative w-[70px] h-[70px] md:w-[90px] md:h-[90px] flex-shrink-0",
   variant:
      "flex flex-grow flex-col items-start md:items-center ml-[10px] space-y-[14px] md:flex-row md:space-y-0",
   checkBtn:
      "h-[24px] w-[24px] inline-flex item-center justify-center absolute rounded-[6px] left-[6px] bottom-[6px]",
};
</script>

<template>
   <div class="flex items-center">
      <div class="flex flex-grow">
         <div :class="classes.imageFrame">
            <img
               :src="
                  props.cartItem.item.product.image_url ||
                  'https://d4t06.github.io/HD-Chat/assets/search-empty-ChRLxitn.png'
               "
               class="w-full h-auto"
               alt=""
            />

            <button
               :onClick="handleToggle"
               :class="`${classes.checkBtn} ${
                  props.isChecked
                     ? 'bg-[#cd1818] text-white'
                     : 'bg-[#fff] border-[2px] border-black/60'
               }`"
            >
               <CheckIcon v-if="props.isChecked" class="w-[20px]" />
            </button>
         </div>

         <div :class="classes.variant">
            <div class="h-full">
               <h5 class="text-[18px] font-[500] mb-[14px] md:mb-[4px]">
                  {{ props.cartItem.item.product.product_name }}
               </h5>

               <VarianList
                  :index="index"
                  :isFetching="isFetching"
                  :actions="actions"
                  :cartItem="cartItem"
               />
            </div>

            <h5 class="text-[#3f3f3f] ml-auto md:mr-[50px]">
               Giá:
               <span class="text-[#cd1818] font-[600]">
                  {{ moneyFormat(props.cartItem.price) }}
               </span>
            </h5>
         </div>
      </div>

      <Button
         variant="push"
         colors="secondary"
         :disabled="false"
         :onClick="() => (openModal = true)"
         class="px-[9px] py-[3px]"
         size="clear"
      >
         <TrashIcon class="w-[22px]" />
      </Button>
   </div>

   <Modal zIndex="z-[200]" v-if="openModal" :close="closeModal">
      <template v-slot:children>
         <ConfirmModal
            :callback="
               () =>
                  actions({
                     variant: 'delete',
                     id: props.cartItem.item.id,
                     index: props.index,
                  })
            "
            :loading="isFetching"
            desc="Định xóa hả gì ?"
            :label="`Xóa '${props.cartItem.item.product}' ?`"
            :close="closeModal"
         >
            <img
               src="https://zalo-api.zadn.vn/api/emoticon/sticker/webpc?eid=46991&size=130"
               class="w-auto h-auto mx-auto"
            />
         </ConfirmModal>
      </template>
   </Modal>
</template>
