import { useProductStore } from "@/stores/product";
import type { Product } from "@/types";
import { publicRequest } from "@/utils/request";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const PRODUCT_URL = "/products";

export default function useProduct() {
   const isFetching = ref(false);

   const productStore = useProductStore();
   const { status,...rest } = storeToRefs(productStore);

   const getProduct = async (page: number, categoryID: number, option: { replace?: boolean }) => {
      try {
         productStore.storingProducts({ status: "loading" });

         const res = await publicRequest.get(PRODUCT_URL);

         const products = res.data.data as Product[];
         productStore.storingProducts({
            products,
            category_id: categoryID,
            page,
            replace: option.replace,
         });
      } catch (error) {
         productStore.storingProducts({ status: "error" });
         console.log({ message: error });
      }
   };

   return { getProduct, isFetching, ...rest, status };
}
