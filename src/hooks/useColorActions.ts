import { useProductDetailStore } from "@/stores/productDetail";
import { useToastStore } from "@/stores/toast";
import { generateId, sleep } from "@/utils/appHelper";
import { privateRequest } from "@/utils/request";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const MANAGE_COLOR_URL = "/product-management/colors";

type Props = {
   closeModal: () => void;
};

export default function useColorActions({ closeModal }: Props) {
   const toastStore = useToastStore();

   const p = useProductDetailStore();
   const { productDetail } = storeToRefs(p);

   const isFetching = ref(false);

   type AddColor = {
      variant: "add";
      value: string;
   };

   type EditColor = {
      variant: "edit";
      id: number;
      index: number;
      value: string;
   };

   type DeleteColor = {
      variant: "delete";
      id: number;
      index: number;
   };

   const colorActions = async (props: AddColor | EditColor | DeleteColor) => {
      try {
         if (!productDetail.value) return;
         isFetching.value = true;
         if (import.meta.env.DEV) await sleep(500);

         switch (props.variant) {
            case "add": {
               const color: ProductColorSchema = {
                  product_id: productDetail.value.id,
                  color_name: props.value,
                  color_name_ascii: generateId(props.value),
               };
               const res = await privateRequest.post(`${MANAGE_COLOR_URL}`, color);

               const data = res.data.data as {
                  color: ProductColor;
                  combines: ProductCombine[];
               };

               productDetail.value.colors.push(data.color);
               productDetail.value.combines.push(...data.combines);

               break;
            }
            case "edit": {
               const { value, id, index } = props;
               const color: ProductColorSchema = {
                  product_id: productDetail.value.id,
                  color_name: value,
                  color_name_ascii: generateId(value),
               };

               await privateRequest.put(`${MANAGE_COLOR_URL}/${id}`, color);

               Object.assign(productDetail.value.colors[index], color);
               break;
            }
            case "delete": {
               const { id, index } = props;
               await privateRequest.delete(`${MANAGE_COLOR_URL}/${id}`);

               productDetail.value.colors.splice(index, 1);
               break;
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

   return { isFetching, colorActions };
}
