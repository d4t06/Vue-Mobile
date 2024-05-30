<script setup lang="ts">
import { Modal, ModalHeader } from "@/components/Modal";
import { Button } from "@/components/ui";
import MyInput from "@/components/ui/MyInput.vue";
import { useProductDetailStore } from "@/stores/productDetail";
import { useToastStore } from "@/stores/toast";
import { moneyFormat, sleep } from "@/utils/appHelper";
import { privateRequest } from "@/utils/request";
import { PencilSquareIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { InputHTMLAttributes, computed, ref } from "vue";

const COMBINE_URL = "/product-management/combines";
const DEFAULT_COMBINE_URL = "/product-management/default-combines";
const DEFAULT_STORAGE_URL = "/product-management/default-storages";

type Props = {
   color: ProductColor;
   storage: ProductStorage;
   storageIndex: number;
};

const { color, storage, storageIndex } = defineProps<Props>();
const p = useProductDetailStore();
const { productDetail } = storeToRefs(p);
const toastStore = useToastStore();

const isFetching = ref(false);
const openModal = ref(false);

const price = ref(0);
const quantity = ref(0);

const foundedCombineIndex = computed(() =>
   productDetail.value
      ? productDetail.value.combines.findIndex(
           (c) => c.color_id === color.id && c.storage_id === storage.id
        )
      : -1
);
const foundedCombine = computed(() => {
   if (!productDetail.value) return null;

   return foundedCombineIndex.value === -1
      ? null
      : productDetail.value.combines[foundedCombineIndex.value];
});

const isDefaultCombine = computed(() => {
   if (!productDetail.value || !foundedCombine.value) return false;

   const isDefaultStorage = productDetail.value.default_storage.storage_id === storage.id;
   const isDefaultCombineOfStorage =
      storage.default_combine.combine_id === foundedCombine.value.id;

   return isDefaultStorage && isDefaultCombineOfStorage;
});

const closeModal = () => {
   price.value = 0;
   quantity.value = 0;
   isFetching.value = false;
   openModal.value = false;
};

const handleOpenModal = () => {
   if (!foundedCombine.value) return;

   price.value = foundedCombine.value?.price;
   quantity.value = foundedCombine.value?.quantity;
   openModal.value = true;
};

const priceInputAttrs: InputHTMLAttributes = {
   onFocus: (e) =>
      ((e.target as HTMLInputElement).value = price.value ? price.value + "" : ""),
   onBlur: (e) => ((e.target as HTMLInputElement).value = moneyFormat(price.value || "")),
};

const findLowestCombineIdByStorage = (newCombine: ProductCombine) => {
   if (!productDetail.value) throw new Error("");

   let MAX_VAL = 999999999;
   let lowestPriceCombineId = newCombine.id;

   productDetail.value.combines.forEach((c) => {
      const sameStorage = c.storage_id === storage.id;

      if (sameStorage) {
         const isNewCombine = c.id === newCombine.id;
         const isLowerPrice = isNewCombine
            ? newCombine.price < MAX_VAL
            : c.price < MAX_VAL;

         if (isLowerPrice) {
            MAX_VAL = isNewCombine ? newCombine.price : c.price;
            lowestPriceCombineId = c.id;
         }
      }
   });

   const newDefaultCombine: DefaultStorageCombine = {
      storage_id: storage.id,
      combine_id: lowestPriceCombineId,
   };

   return { newDefaultCombine, lowestPrice: MAX_VAL };
};

const findLowestProductStorage = (lowestPriceOfStorage: number) => {
   if (!productDetail.value) throw new Error("");

   let MAX_VAL = lowestPriceOfStorage;
   let lowestPriceStorageId = storage.id;

   productDetail.value.storages.forEach((s) => {
      const otherStorage = s.id !== storage.id;

      if (otherStorage) {
         if (s.default_combine.combine_id) {
            const defaultCombineOfStorage = productDetail.value!.combines.find(
               (c) => c.id === s.default_combine.combine_id
            );

            if (!defaultCombineOfStorage) throw new Error("");
            if (defaultCombineOfStorage.price < MAX_VAL) {
               lowestPriceStorageId = defaultCombineOfStorage.storage_id;
            }
         }
      }
   });

   const newDefaultStorage: DefaultStorage = {
      product_ascii: productDetail.value.product_ascii,
      storage_id: lowestPriceStorageId,
   };

   return newDefaultStorage;
};

const handleUpdateCombine = async () => {
   if (!foundedCombine.value || !price.value || !productDetail.value)
      return toastStore.setErrorToast("");

   try {
      isFetching.value = true;
      if (import.meta.env.DEV) await sleep(1000);

      const newCombine = { ...foundedCombine.value };
      newCombine.price = price.value;
      newCombine.quantity = quantity.value;

      // local logic check
      const { newDefaultCombine, lowestPrice } = findLowestCombineIdByStorage(newCombine);
      const newDefaultStorage = findLowestProductStorage(lowestPrice);

      // update combine
      await privateRequest.put(`${COMBINE_URL}/${newCombine.id}`, newCombine);

      // update lowest combines of storage if it had changed
      const isHasNewDefaultCombine =
         newDefaultCombine.combine_id !== storage.default_combine.combine_id;
      if (isHasNewDefaultCombine) {
         await privateRequest.put(
            `${DEFAULT_COMBINE_URL}/${storage.id}`,
            newDefaultCombine
         );
         productDetail.value.storages[storageIndex].default_combine = newDefaultCombine;
      }

      // update storage of product if it had changed
      const isHasNewDefaultStorage =
         productDetail.value.default_storage.storage_id !== newDefaultStorage.storage_id;
      if (isHasNewDefaultStorage) {
         await privateRequest.put(`${DEFAULT_STORAGE_URL}`, newDefaultStorage);
         productDetail.value.default_storage = newDefaultStorage;
      }

      productDetail.value.combines[foundedCombineIndex.value] = newCombine;
      toastStore.setSuccessToast("Update combine successful");
   } catch (error) {
      console.log({ message: error });
      toastStore.setErrorToast("");
   } finally {
      closeModal();
   }
};
</script>
<template>
   <template
      v-if="!foundedCombine || foundedCombineIndex === null || foundedCombineIndex === -1"
   >
      <p class="text-center">Some thing went wrong</p>
   </template>

   <tr v-else>
      <td>
         <span class="font-[500] text-[#cd1818]"> {{ storage.storage }}</span>
         {{ ` / ${color.color} ${isDefaultCombine ? "(default)" : ""}` }}
      </td>
      <td>{{ foundedCombine.quantity }}</td>
      <td>{{ moneyFormat(foundedCombine.price) }}</td>
      <td class="!text-right">
         <Button
            :onClick="handleOpenModal"
            :class="`px-[14px]`"
            variant="push"
            colors="secondary"
         >
            <PencilSquareIcon class="w-[20px] mr-[6px]" />
            Change
         </Button>
      </td>
   </tr>

   <Modal v-if="openModal" :close="closeModal">
      <template v-slot:children>
         <div class="w-[300px] bg-[#fff]">
            <ModalHeader
               :close="closeModal"
               :title="`Edit '${storage.storage} / ${color.color}'`"
            />
            <form class="space-y-[14px]" @submit.prevent="handleUpdateCombine">
               <div class="space-y-[6px]">
                  <label for="">Quantity</label>
                  <MyInput
                     ref="childRef"
                     :attrs="{ placeholder: 'Quantity...',
                  onChange: (e) => quantity = +(e.target as HTMLInputElement).value,
                  value: quantity || '', }"
                  />
               </div>

               <div class="space-y-[6px]">
                  <label for="">Price</label>

                  <MyInput
                     ref="childRef"
                     :attrs="{ placeholder: 'Price...',
                  onChange: (e) => price = +(e.target as HTMLInputElement).value,
                  value: price || '', ...priceInputAttrs }"
                  />
               </div>

               <p class="text-right mt-[20px]">
                  <Button className="leading-[24px]" :loading="isFetching" type="submit">
                     Save
                  </Button>
               </p>
            </form>
         </div>
      </template>
   </Modal>
</template>
