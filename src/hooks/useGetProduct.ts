import { useProductStore } from "@/stores/product";
import { useSortStore, type SortStoreType } from "@/stores/sort";

import { sleep } from "@/utils/appHelper";
import { publicRequest } from "@/utils/request";
import { useFiltersStore } from "@/stores/filter";

export default function useGetProduct() {
   const productStore = useProductStore();
   const filterStore = useFiltersStore();
   const sortStore = useSortStore();

   const PRODUCT_URL = "/products/search";

   type PageParams = {
      page: number;
      size: number;
      // sort: [SortStoreType["column"], SortStoreType["type"]] | null;
      sort: string | null;
   };

   type Filter = {
      category_id: number | null;
      brand_id: number[] | null;
      price: number[] | null;
   };

   type ProductResponse = Filter & {
      count: number;
      category_id: number | null;
      brand_id: number[] | null;
      is_last: boolean;
      products: ProductList[];
      page: number;
      size: number;
      column: SortStoreType["column"] | null;
      type: SortStoreType["type"] | null;
   };

   type Params = Omit<ProductResponse, "is_last" | "products" | "count">;

   const getProduct = async (
      params: Partial<Params>,
      option?: { replace?: boolean; more?: boolean }
   ) => {
      try {
         if (option?.more) productStore.storingProducts({ status: "more-loading" });
         else productStore.storingProducts({ status: "loading" });

         const getProductFilter: Filter = {
            brand_id: filterStore.brands.length ? filterStore.brands.map((b) => b.id) : null,
            category_id: params.category_id || productStore.categoryID || null,
            price: filterStore.price
               ? [filterStore.price.from_price, filterStore.price.to_price]
               : null,
         };

         const getProductParams: PageParams = {
            page: params.page || 0,
            size: 2,

            sort: sortStore.column ? `${sortStore.column +","+ sortStore.type}` : null,
         };

         if (import.meta.env.DEV) await sleep(1000);
         const res = await publicRequest.post(PRODUCT_URL, getProductFilter, {
            params: getProductParams,
            paramsSerializer: {
               indexes: false,
            },
         });

         const data = res.data.data as ProductResponse;
         productStore.storingProducts({
            status: "successful",
            replace: option?.replace ?? false,
            products: data.products,
            // if don't pass category_id, default use store category_id
            categoryID: params.category_id || productStore.categoryID || null,
            page: data.page,
            count: data.count,
            isLast: data.is_last,
            brandID: data.brand_id,
            column: data.column,
            type: data.type,
            price: data.price,
            pageSize: data.size,
         });
      } catch (error) {
         productStore.storingProducts({ status: "error" });
         console.log({ message: error });
      }
   };

   return { getProduct };
}
