import { defineStore } from "pinia";

type StateType = {
   productDetail: ProductDetail | null;
};

const initialState: StateType = {
   productDetail: null,
};

export const useProductDetailStore = defineStore("productDetail", {
   state: () => initialState,
   actions: {
      storingProduct(payload: ProductDetail) {
         this.productDetail = payload;
      },
      resetProduct() {
         this.productDetail = null;
      },
   },
});
