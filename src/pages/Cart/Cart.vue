<script setup lang="ts">
import { Button } from "@/components/ui";
import PushFrame from "@/components/ui/PushFrame.vue";
import useGetCart from "@/hooks/useGetCart";
import { useCartStore } from "@/stores/cart";
import {
   BanknotesIcon,
   CreditCardIcon,
   MapPinIcon,
   TruckIcon,
} from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import Title from "./_components/Title.vue";
import PriceGroup from "./_components/PriceGroup.vue";
import Skeleton from "@/components/Skeleton/Skeleton.vue";
import Address from "./_components/Address.vue";
import CartItemList from "./_components/CartItemList.vue";

const cartStore = useCartStore();
const { cartItems } = storeToRefs(cartStore);

const { status } = useGetCart();

const classes = {
   container: "space-y-[6px]",
};
</script>

<template>
   <template v-if="status === 'loading'">
      <div
         v-for="key in [...Array(2).keys()]"
         :key="key"
         class="mb-[30px] space-y-[16px]"
      >
         <Skeleton className="w-[200px] rounded-[6px] h-[24px] max-w-[30%]" />
         <Skeleton className="w-full rounded-[6px] h-[200px]" />
      </div>
   </template>

   <p v-if="status === 'error'">Some things went wrong</p>

   <template v-if="status === 'successful'">
      <div v-if="!cartItems.length">
         <img
            src="https://d4t06.github.io/HD-Mobile/assets/not-found-95813d48.png"
            class="mx-auto"
            alt=""
         />
         <p class="text-center">Chưa có sản phẩm</p>
      </div>

      <div v-else :class="`${false ? 'disable' : ''} space-y-[20px] md:space-y-[30px] `">
         <div :class="classes.container">
            <CartItemList />
         </div>

         <div :class="classes.container">
            <Title>
               <TruckIcon class="w-[22px] md:w-[24px]" />
               <span>Hình thức nhận hàng</span>
            </Title>

            <div
               class="flex flex-col items-start sm:flex-row space-y-[10px] sm:space-y-0 sm:items-center sm:space-x-[10px]"
            >
               <Button
                  class="text-[15px]"
                  :active="true"
                  variant="push"
                  colors="secondary"
               >
                  Giao hàng tận nơi
               </Button>
               <Button class="text-[15px]" variant="push" colors="secondary">
                  Nhận tại của hàng
               </Button>
            </div>
         </div>

         <div :class="classes.container">
            <Title>
               <MapPinIcon class="w-[22px] md:w-[24px]" />
               <span>Địa chỉ</span>
            </Title>
            <PushFrame pushAble="clear">
               <Address />
            </PushFrame>
         </div>

         <div :class="classes.container">
            <Title>
               <CreditCardIcon class="w-[22px] md:w-[24px]" />
               <span>Hình thức thanh toán</span>
            </Title>

            <div
               class="flex flex-col items-start sm:flex-row space-y-[10px] sm:space-y-0 sm:items-center sm:space-x-[10px]"
            >
               <Button
                  variant="push"
                  class="text-[15px]"
                  :active="true"
                  colors="secondary"
               >
                  <BanknotesIcon class="w-[22px] md:w-[24px] mr-[6px]" />
                  Thanh toán khi nhận hàng
               </Button>
               <Button variant="push" class="text-[15px]" colors="secondary">
                  <CreditCardIcon class="w-[22px] md:w-[24px] mr-[6px]" />
                  Chuyển khoản ngân hàng
               </Button>
            </div>
         </div>

         <PriceGroup />
      </div>
   </template>
</template>
