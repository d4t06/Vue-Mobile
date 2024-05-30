import { useProductDetailStore } from "@/stores/productDetail";
import { useToastStore } from "@/stores/toast";
import { sleep } from "@/utils/appHelper";
import { privateRequest } from "@/utils/request";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const PRODUCT_ATTRIBUTE_URL = "/product-management/attributes";

type Props = {
   closeModal: () => {};
};

export default function useSpecActions({ closeModal }: Props) {
   const toastStore = useToastStore();
   const p = useProductDetailStore();
   const { productDetail } = storeToRefs(p);

   const isFetching = ref(false);

   type Add = {
      variant: "add";
      productAttribute: ProductAttributeSchema;
   };

   type Edit = {
      variant: "edit";
      productAttribute: ProductAttributeSchema;
      id: number;
      index: number;
   };

   const specActions = async (props: Add | Edit) => {
      try {
         if (!productDetail.value) return;

         isFetching.value = true;
         if (import.meta.env.DEV) await sleep(500);

         switch (props.variant) {
            case "add": {
               const res = await privateRequest.post(
                  PRODUCT_ATTRIBUTE_URL,
                  props.productAttribute
               );

               productDetail.value.attributes.push(res.data.data);
               break;
            }

            case "edit": {
               const { index, id, productAttribute } = props;

               const res = await privateRequest.put(
                  `${PRODUCT_ATTRIBUTE_URL}/${id}`,
                  productAttribute
               );

               productDetail.value.attributes[index] = res.data.data;
               break;
            }
         }
      } catch (error) {
         console.log({ message: error });
         toastStore.setErrorToast("");
      } finally {
         isFetching.value = false;
         closeModal();
      }
   };

   return { isFetching, specActions };
}
