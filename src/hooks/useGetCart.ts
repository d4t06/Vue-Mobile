import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { getLocalStorage, setLocalStorage, sleep } from "@/utils/appHelper";
import { publicRequest } from "@/utils/request";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const CART_URL = "/cart-items";

export default function useGetCart() {
   const authStore = useAuthStore();

   const { loading, user } = storeToRefs(authStore);
   const cartStore = useCartStore();

   const status = ref<"loading" | "successful" | "error">("loading");

   const getCartItems = async () => {
      try {
         const storage = getLocalStorage();
         if (import.meta.env.DEV) await sleep(500);

         const res = await publicRequest.get(`${CART_URL}/${user.value!.username}`);

         const cartItemDetails = res.data.data as cartItemDetail[];
         const cartItemId = storage["cart_item_id"];

         if (cartItemId !== undefined) {
            const index = cartItemDetails.findIndex((ci) => ci.item.id === cartItemId);

            // if have
            if (index !== -1) {
               cartStore.selectedCartItemId = [cartItemId];
               setLocalStorage("cart_item_id", "");
            }
         }

         cartStore.cartItems = cartItemDetails;
         status.value = "successful";
      } catch (error) {
         console.log({ message: error });
         status.value = "error";
      }
   };

   watch(
      [loading, user],
      () => {
         if (loading.value) return;
         if (!user.value) return;

         getCartItems();
      },
      {
         immediate: true,
      }
   );

   return { status };
}
