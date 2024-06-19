import { defineStore } from "pinia";

type StateType = {
   cartItems: cartItemDetail[];
   payMethod: "cash" | "momo";
   deliveryMethod: "at-store" | "home";
   selectedCartItemId: number[];
};

const initialState: StateType = {
   cartItems: [],
   deliveryMethod: "home",
   payMethod: "cash",
   selectedCartItemId: [],
};

export const useCartStore = defineStore("cart", {
   state: () => initialState,
   actions: {
      setCart(
         payload:
            | {
                 variant: "replace";
                 cartItems: cartItemDetail[];
              }
            | {
                 variant: "update";
                 cartItem: Partial<CartItemSchema>;
                 index: number;
                 price: number;
                 change: "whole";
              }
            | {
                 variant: "update";
                 cartItem: Partial<CartItemSchema>;
                 index: number;
                 change: "amount";
              }
            | {
                 variant: "delete";
                 index: number;
              }
      ) {
         switch (payload.variant) {
            case "replace":
               this.cartItems = payload.cartItems;
               break;
            case "update": {
               const { change, cartItem, index } = payload;

               Object.assign(this.cartItems[index].item, cartItem);

               if (change === "whole") {
                  this.cartItems[index].price = payload.price;
               }
               break;
            }
            case "delete":
               this.cartItems.splice(payload.index, 1);
               break;
         }
      },
      selectCartItem(payload: StateType["selectedCartItemId"]) {
         payload.forEach((id) => {
            const index = this.selectedCartItemId.findIndex((i) => id === i);
            if (index === -1) this.selectedCartItemId.push(id);
            else this.selectedCartItemId.splice(index, 1);
         });
      },
   },
});
