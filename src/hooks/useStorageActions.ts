import { useProductDetailStore } from "@/stores/productDetail";
import { useToastStore } from "@/stores/toast";
import { generateId, sleep } from "@/utils/appHelper";
import { privateRequest } from "@/utils/request";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const MANAGE_STORAGE_URL = "/product-management/storages";

type Props = {
   closeModal: () => void;
};

export default function useStorageActions({ closeModal }: Props) {
   const toastStore = useToastStore();

   const p = useProductDetailStore();
   const { productDetail } = storeToRefs(p);

   const isFetching = ref(false);

   type AddStorage = {
      variant: "add";
      value: string;
   };

   type EditStorage = {
      variant: "edit";
      value: string;
      id: number;
      index: number;
   };

   type DeleteStorage = {
      variant: "delete";
      id: number;
      index: number;
   };

   const storageActions = async (props: AddStorage | EditStorage | DeleteStorage) => {
      try {
         if (!productDetail.value) return;
         isFetching.value = true;
         if (import.meta.env.DEV) await sleep(500);

         switch (props.variant) {
            case "add":
               const storage_name: ProductStorageSchema = {
                  product_id: productDetail.value.id,
                  storage_name: props.value,
                  storage_name_ascii: generateId(props.value),
               };

               const res = await privateRequest.post(
                  `${MANAGE_STORAGE_URL}`,
                  storage_name
               );

               const data = res.data.data as {
                  storage: ProductStorage;
                  combines: ProductCombine[];
               };

               productDetail.value.storages.push(data.storage);
               productDetail.value.combines.push(...data.combines);

               break;

            case "edit": {
               const { id, index, value } = props;

               const storage_name: ProductStorageSchema = {
                  product_id: productDetail.value.id,
                  storage_name: value,
                  storage_name_ascii: generateId(value),
               };

               await privateRequest.put(`${MANAGE_STORAGE_URL}/${id}`, storage_name);

               Object.assign(productDetail.value.storages[index], storage_name);
               break;
            }

            case "delete": {
               const { id, index } = props;
               await privateRequest.delete(`${MANAGE_STORAGE_URL}/${id}`);

               productDetail.value.storages.splice(index, 1);
            }
         }
      } catch (error) {
         console.log({ message: error });
         closeModal();
         toastStore.setErrorToast("");
      } finally {
         isFetching.value = false;
         closeModal();
      }
   };

   return { isFetching, storageActions };
}
