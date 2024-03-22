import { useProductStore } from "@/stores/product";
import { useSortStore, type SortStoreType } from "@/stores/sort";
import type { Product } from "@/types";
import { sleep } from "@/utils/appHelper";
import { publicRequest } from "@/utils/request";
import { useFiltersStore } from "@/stores/filter";
import useCurrentCategory from "./useCurrentCategory";

export default function useGetProduct() {
   const productStore = useProductStore();
   const filterStore = useFiltersStore();
   const sortStore = useSortStore();

   const { getCurCategory } = useCurrentCategory();

   const PRODUCT_URL = "/products";

   type ProductResponse = {
      page: number;
      count: number;
      categoryID: number | null;
      isLast: boolean;
      products: Product[];
      brandID: number[] | null;
      column: SortStoreType["column"] | null;
      type: SortStoreType["type"] | null;
      price: number[] | null;
      pageSize: number;
   };

   type Params = Omit<ProductResponse, "isLast" | "products" | "count">;

   const getProduct = async (
      params: Partial<Params>,
      option?: { replace?: boolean; more?: boolean }
   ) => {
      try {
         if (option?.more) productStore.storingProducts({ status: "more-loading" });
         else productStore.storingProducts({ status: "loading" });

         const getProductParams: Params = {
            brandID: filterStore.brands.map((b) => b.id),
            categoryID: productStore.categoryID,
            page: params.page || 0,
            pageSize: 1,
            price: filterStore.price ? [filterStore.price.from, filterStore.price.to] : null,
            column: sortStore.column,
            type: sortStore.type,
            ...params,
         };

         if (import.meta.env.DEV) await sleep(1000);
         const res = await publicRequest.get(PRODUCT_URL, {
            params: getProductParams,
            paramsSerializer: {
               indexes: null, // no brackets at all
            },
         });

         const data = res.data.data as ProductResponse;
         productStore.storingProducts({
            status: "successful",
            replace: option?.replace ?? false,
            products: data.products,
            categoryID: getCurCategory()?.id ?? null,
            page: data.page,
            count: data.count,
            isLast: data.isLast,
            brandID: data.brandID,
            column: data.column,
            type: data.type,
            price: data.price,
            pageSize: data.pageSize,
         });
      } catch (error) {
         productStore.storingProducts({ status: "error" });
         console.log({ message: error });
      }
   };

   return { getProduct };
}
