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
      storingProducts(payload: Partial<ProductState>) {
         Object.assign(this, payload);
      },
   },
});
