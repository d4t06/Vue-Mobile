import { useProductStore } from "@/stores/product";
import type { SortStoreType } from "@/stores/sort";
import type { Product } from "@/types";
import { storeToRefs } from "pinia";
import { computed } from "vue";

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

export default function useProduct() {
   const productStore = useProductStore();
   const { status, ...rest } = storeToRefs(productStore);

   const isFetching = computed(() => status.value === "loading" || status.value === "more-loading");

   return { status, isFetching, ...rest };
}
