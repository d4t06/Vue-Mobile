import { ref, type Ref } from "vue";
import usePrivateRequest from "./usePrivateRequest";
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";
import { sleep } from "@/utils/appHelper";
import { useProductStore } from "@/stores/product";

const PRODUCT_URL = "/products";

export type ProductModal = "gallery" | "delete" | "close";

type Props = {
   isOpenModal?: Ref<ProductModal>;
};

export default function useProductAction({ isOpenModal }: Props) {
   const isFetching = ref<"add" | "edit" | "delete" | "">("");

   const productStore = useProductStore();
   const toastStore = useToastStore();

   const { products } = storeToRefs(productStore);

   const privateRequest = usePrivateRequest();

   type AddProduct = {
      type: "add";
      product: ProductSchema;
   };

   type EditProduct = {
      type: "edit";
      product: ProductSchema;
      id: number;
      index: number;
   };

   type DeleteProduct = {
      type: "delete";
      id: number;
   };

   type Params = AddProduct | EditProduct | DeleteProduct;

   const productActions = async ({ ...props }: Params) => {
      try {
         switch (props.type) {
            case "add":
               isFetching.value = "add";
               if (import.meta.env.DEV) await sleep(500);

               const res = await privateRequest.post(`${PRODUCT_URL}`, props.product);
               const newProduct = res.data.data as ProductList;

               products.value.push(newProduct);

               break;

            case "edit": {
               const { product, index, id } = props;
               isFetching.value = "edit";
               if (import.meta.env.DEV) await sleep(500);

               await privateRequest.put(`${PRODUCT_URL}/${id}`, product);

               Object.assign(products.value[index], product);

               break;
            }

            case "delete":
               const { id } = props;
               isFetching.value = "delete";
               if (import.meta.env.DEV) await sleep(500);

               // api
               await privateRequest.delete(`${PRODUCT_URL}/${id}`);
               // local update
               const newProducts = products.value.filter((p) => p.id !== id);
               products.value = newProducts;
         }

         toastStore.setSuccessToast(`${props.type} product successful`);
      } catch (error) {
         console.log({ message: error });
         toastStore.setErrorToast(`${props.type} product fail`);
      } finally {
         isFetching.value = "";
         isOpenModal ? (isOpenModal.value = "close") : {};
      }
   };

   return { isFetching, productActions };
}
