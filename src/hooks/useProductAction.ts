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
      currentIndex: number | undefined;
   };

   type DeleteProduct = {
      type: "delete";
      productAscii: string;
   };

   type Params = AddProduct | EditProduct | DeleteProduct;

   const productActions = async ({ ...props }: Params) => {
      try {
         switch (props.type) {
            case "add":
               isFetching.value = "add";

               const res = await privateRequest.post(`${PRODUCT_URL}`, props.product);

               const newProduct = res.data.data as ProductList;

               if (import.meta.env.DEV) await sleep(500);

               products.value.push(newProduct);

               break;

            case "edit":
               const { product: updateProduct, currentIndex } = props;

               if (currentIndex === undefined) throw new Error("Missing current index");

               const oldProduct = products.value[currentIndex];

               isFetching.value = "delete";

               // api
               await privateRequest.put(`${PRODUCT_URL}/${oldProduct.id}`, updateProduct);

               if (import.meta.env.DEV) await sleep(500);
               Object.assign(products.value[currentIndex], updateProduct);

               break;

            case "delete":
               const { productAscii } = props;

               isFetching.value = "delete";

               // api
               await privateRequest.delete(`${PRODUCT_URL}/${productAscii}`);
               // local update
               if (import.meta.env.DEV) await sleep(500);
               const newProducts = products.value.filter(
                  (p) => p.product_ascii !== productAscii
               );
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
