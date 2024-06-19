import { useCartStore } from "@/stores/cart";
import { setLocalStorage, sleep } from "@/utils/appHelper";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import usePrivateRequest from "./usePrivateRequest";

const CART_ITEM_URL = "/cart-items";

export default function useCartAction() {
   const cartStore = useCartStore();

   const { cartItems } = storeToRefs(cartStore);

   const isFetching = ref(false);

   const privateRequest = usePrivateRequest();

   const router = useRouter();

   type Add = {
      variant: "add";
      cartItem: CartItemSchema;
   };

   type Edit = {
      variant: "edit";
      cartItem: CartItemSchema;
      id: number;
      index: number;
      change: "amount" | "whole";
   };

   type Delete = {
      variant: "delete";
      id: number;
      index: number;
   };

   const actions = async (props: Add | Edit | Delete) => {
      try {
         // console.log('check actions', props);

         isFetching.value = true;
         if (import.meta.env.DEV) await sleep(500);

         switch (props.variant) {
            case "add":
               const res = await privateRequest.post(`${CART_ITEM_URL}`, props.cartItem);

               setLocalStorage("cart_item_id", res.data.data);

               router.push("/cart");

               break;
            case "edit": {
               const { cartItem, change, id, index } = props;
               const res = await privateRequest.put(`${CART_ITEM_URL}/${id}`, cartItem);

               const price = res.data.data;

               if (change === "amount")
                  cartStore.setCart({
                     variant: "update",
                     change: "amount",
                     cartItem,
                     index,
                  });

               if (change === "whole") {
                  const foundedCartItemIndex = cartItems.value.findIndex(
                     (c) =>
                        c.item.product_id === cartItem.product_id &&
                        c.item.color_id === cartItem.color_id &&
                        c.item.storage_id === cartItem.storage_id
                  );

                  // update before
                  cartStore.setCart({
                     cartItem,
                     variant: "update",
                     change: "whole",
                     index,
                     price,
                  });

                  // if have have cart item
                  if (foundedCartItemIndex !== -1) {
                     const foundedCartItem = cartItems.value[foundedCartItemIndex].item;
                     await privateRequest.delete(
                        `${CART_ITEM_URL}/${foundedCartItem.id}`
                     );

                     cartStore.setCart({
                        variant: "delete",
                        index: foundedCartItemIndex,
                     });
                  }
               }

               break;
            }
            case "delete": {
               const { index, id } = props;
               await privateRequest.delete(`${CART_ITEM_URL}/${id}`);
               cartStore.setCart({ variant: "delete", index });

               break;
            }
         }
      } catch (error) {
         console.log({ message: error });
      } finally {
         isFetching.value = false;
      }
   };

   return {
      isFetching,
      actions,
   };
}

export type CartAction = ReturnType<typeof useCartAction>["actions"];
