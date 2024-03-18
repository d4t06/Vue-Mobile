import { useProductStore } from "@/stores/product";
import { publicRequest } from "@/utils/request";
import { ref } from "vue";

const PRODUCT_URL = "/products";

export default function useProduct() {
   const isFetching = ref(false);

   const productStore = useProductStore();

   const getProduct = async (page: number, categoryID: number) => {
      try {
         productStore.storingProducts({ status: "loading" });

         const res = await publicRequest.get(PRODUCT_URL);

         const products = res.data.data as Product[];
         productStore.storingProducts({ products, category_id: categoryID, page });
      } catch (error) {
         productStore.storingProducts({ status: "error" });
         console.log({ message: error });
      }
   };

   return { getProduct };
}
