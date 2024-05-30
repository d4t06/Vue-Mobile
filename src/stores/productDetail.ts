import { defineStore } from "pinia";

type StateType = {
   productDetail: Product | null;
};

const initialState: StateType = {
   productDetail: null,
};

export const useProductDetailStore = defineStore("productDetail", {
   state: () => initialState,
   actions: {
      storingProduct(payload: Product) {
         this.productDetail = payload;
      },
      resetProduct() {
         this.productDetail = null;
      },
   },
});
