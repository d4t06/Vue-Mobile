import { useProductDetailStore } from "@/stores/productDetail";
import { useToastStore } from "@/stores/toast";
import { generateId } from "@/utils/appHelper";
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

         switch (props.variant) {
            case "add":
               const storage: ProductStorageSchema = {
                  product_ascii: productDetail.value.product_ascii,
                  storage: props.value,
                  storage_ascii: generateId(props.value),
               };

               const res = await privateRequest.post(`${MANAGE_STORAGE_URL}`, storage);

               const data = res.data.data as {
                  storage: ProductStorage;
                  combines: ProductCombine[];
               };

               productDetail.value.storages.push(data.storage);
               productDetail.value.combines.push(...data.combines);

               break;

            case "edit": {
               const { id, index, value } = props;

               const storage: ProductStorageSchema = {
                  product_ascii: productDetail.value.product_ascii,
                  storage: value,
                  storage_ascii: generateId(value),
               };

               await privateRequest.put(`${MANAGE_STORAGE_URL}/${id}`, storage);

               Object.assign(productDetail.value.storages[index], storage);
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
