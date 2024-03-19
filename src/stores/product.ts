import type { Product } from "@/types";
import { defineStore } from "pinia";

type ProductState = {
   status: "" | "loading" | "more-loading" | "successful" | "error";
   category_id: number;
   page: number;
   products: Product[];
   count: number;
   pageSize: number;
};

const initialProductState: ProductState = {
   status: "loading",
   products: [],
   count: 0,
   pageSize: 0,
   category_id: 0,
   page: 1,
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
