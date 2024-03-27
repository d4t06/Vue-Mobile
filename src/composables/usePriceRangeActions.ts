import { useAppStore } from "@/stores/app";
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";
import { computed, ref, type Ref } from "vue";
import usePrivateRequest from "./usePrivateRequest";
import type { PriceRange, PriceRangeSchema } from "@/types";
import { sleep } from "@/utils/appHelper";

const PRICE_RANGE_URL = "/price_ranges";

export type PriceRangeModal = "close" | "edit" | "add" | "delete";

type Props = {
   isOpenModal: Ref<PriceRangeModal>;
   curCategoryIndex: Ref<number | undefined>;
};

export default function usePriceRangeActions({ curCategoryIndex, isOpenModal }: Props) {
   const isFetching = ref(false);

   const appStore = useAppStore();
   const toastStore = useToastStore();
   const { categories } = storeToRefs(appStore);

   const privateRequest = usePrivateRequest();
   const currentCategory = computed(() =>
      curCategoryIndex.value === undefined ? undefined : categories.value[curCategoryIndex.value]
   );

   type AddPriceRange = {
      type: "add";
      priceRange: PriceRangeSchema;
   };

   type EditPriceRange = {
      type: "edit";
      priceRange: PriceRangeSchema;
      id: number;
      currentIndex: number;
   };

   type DeletePriceRange = {
      type: "delete";
      id: number;
   };

   type Params = AddPriceRange | EditPriceRange | DeletePriceRange;

   const priceRangeActions = async ({ ...props }: Params) => {
      try {
         switch (props.type) {
            case "add":
               if (!currentCategory.value) throw new Error("Current category not found");

               isFetching.value = true;

               const res = await privateRequest.post(`${PRICE_RANGE_URL}`, props.priceRange);

               const newPriceRange = res.data.data as PriceRange;

               if (import.meta.env.DEV) await sleep(2000);

               currentCategory.value.price_ranges.push(newPriceRange);

               break;

            case "edit":
               if (!currentCategory.value) throw new Error("Current not found");

               const { priceRange: updatePriceRange, currentIndex, id } = props;

               if (currentIndex === undefined) throw new Error("Missing current index");

               isFetching.value = true;
               // api
               await privateRequest.put(`${PRICE_RANGE_URL}/${id}`, updatePriceRange);

               if (import.meta.env.DEV) await sleep(2000);
               Object.assign(currentCategory.value.price_ranges[currentIndex], updatePriceRange);

               break;

            case "delete":
               const { id: _id } = props;
               if (!currentCategory.value) throw new Error("Current category not found");

               isFetching.value = true;

               // api
               await privateRequest.delete(`${PRICE_RANGE_URL}/${_id}`);
               // local update
               if (import.meta.env.DEV) await sleep(2000);
               const newBrands = currentCategory.value.price_ranges.filter((b) => b.id !== _id);
               currentCategory.value.price_ranges = newBrands;
         }
         toastStore.setSuccessToast(`${props.type} brand successful`);
      } catch (error) {
         console.log({ message: error });
         toastStore.setErrorToast(`${props.type} brand fail`);
      } finally {
         isFetching.value = false;
         isOpenModal.value = "close";
      }
   };

   return { priceRangeActions, categories, isFetching };
}
