import type { Product } from "@/types";
import { defineStore } from "pinia";

type ProductState = {
   status: "" | "loading" | "more-loading" | "successful" | "error";
   categoryID: number | null;
   page: number;
   products: Product[];
   count: number;
   pageSize: number;
   isLast: boolean;
};

const initialProductState: ProductState = {
   status: "loading",
   products: [],
   count: 0,
   page: 0,
   pageSize: 6,
   categoryID: null,
   isLast: false,
};

export const useProductStore = defineStore("product", {
   state: () => ({
      ...initialProductState,
   }),
   actions: {
      storingProducts(payload: Partial<ProductState> & { replace?: boolean }) {
         if (payload.replace) Object.assign(this, payload);
         else payload.products = [...this.products, ...(payload.products || [])];
         Object.assign(this, payload);
      },
   },
});
