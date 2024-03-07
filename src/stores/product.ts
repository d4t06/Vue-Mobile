import { defineStore } from "pinia";

type ProductState = {
   status: "" | "loading" | "more-loading" | "successful" | "error";
   category_id: number | undefined;
   page: number;
   products: Product[];
   count: number;
   pageSize: number;
   variants_data: (ProductStorage & { product_name_ascii: string })[];
};

const initialProductState: ProductState = {
   status: "loading",
   products: [],
   count: 0,
   pageSize: 0,
   variants_data: [],
   category_id: undefined,
   page: 1,
};

export const useAppStore = defineStore("product", () => {
   return { initialProductState };
});
