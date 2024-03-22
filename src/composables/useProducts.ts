import { useProductStore } from "@/stores/product";
import type { SortStoreType } from "@/stores/sort";
import type { Product } from "@/types";
import { sleep } from "@/utils/appHelper";
import { publicRequest } from "@/utils/request";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const PRODUCT_URL = "/products";

type ProductResponse = {
   page: number;
   count: number;
   categoryID: number;
   BrandID: string[];
   sort: string[];
   isLast: boolean;
   products: Product[];
};

type Params = {
   categoryID: number;
   brandID: number[];
   page: number;
   column: SortStoreType["column"];
   type: SortStoreType["type"];
};

export default function useProduct() {
   const productStore = useProductStore();
   const { status, ...rest } = storeToRefs(productStore);

   const isFetching = computed(() => status.value === "loading" || status.value === "more-loading");

   const getProduct = async (params: Partial<Params>, option?: { replace?: boolean }) => {
      try {
         productStore.storingProducts({ status: "loading" });

         if (import.meta.env.DEV) await sleep(1000);

         const res = await publicRequest.get(PRODUCT_URL, {
            params,
            paramsSerializer: {
               indexes: null, // no brackets at all
            },
         });

         const productResponse = res.data.data as ProductResponse;
         productStore.storingProducts({
            status: "successful",
            categoryID: params?.categoryID || null,
            page: params.page || 0,
            count: productResponse.count,
            isLast: productResponse.isLast,
            products: productResponse.products,
            replace: option?.replace ?? false,
         });
      } catch (error) {
         productStore.storingProducts({ status: "error" });
         console.log({ message: error });
      }
   };

   return { getProduct, status, isFetching, ...rest };
}
