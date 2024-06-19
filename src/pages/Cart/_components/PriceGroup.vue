<script setup lang="ts">
import { Button } from "@/components/ui";
import { useCartStore } from "@/stores/cart";
import { moneyFormat } from "@/utils/appHelper";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const classes = {
   h5: "text-[14px] md:text-[16px] text-[#3f3f3f] font-[500]",
};


const cartStore = useCartStore();
const { cartItems, selectedCartItemId } = storeToRefs(cartStore);

const totalPrice = computed(() => {
      return cartItems.value.reduce((prev, cur) => {
         if (selectedCartItemId.value.includes(cur.item.id))
            return (prev += cur.item.amount * cur.price);
         return prev;
      }, 0);
   });



</script>

<template>
   <div
      class="fixed bg-white bottom-0 left-0 right-0 border-t-[1px] py-[10px] md:p-[16px]"
   >
      <div class="max-w-[800px] px-[10px] mx-auto">
         <div class="flex flex-col md:flex-row items-start mx-[-8px]">
            <div class="w-full md:w-1/2 px-[8px]">
               <div class="flex items-center leading-[30px]">
                  <p :class="classes.h5">Tổng tiền:</p>
                  <p :class="`${classes.h5} ml-auto text-black`">
                     {{ moneyFormat(totalPrice) }}
                  </p>
               </div>

               <div class="flex items-center leading-[30px]">
                  <p :class="classes.h5">Giảm giá voucher:</p>
                  <p :class="`${classes.h5} ml-auto`">- 0đ</p>
               </div>
            </div>
            <div class="w-full md:w-1/2 px-[8px]">
               <div class="flex items-center leading-[30px]">
                  <p :class="classes.h5">Cần thanh toán:</p>
                  <p class="text-[20px] text-[#cd1818] font-[600] ml-auto">
                     {{ moneyFormat(totalPrice) }}
                  </p>
               </div>
               <Button
                  variant="push"
                  :loading="false"
                  :disabled="false"
                  border="clear"
                  :onClick="() => {}"
                  className="w-full mt-[10px]"
               >
                  Thanh toán
               </Button>
            </div>
         </div>
      </div>
   </div>
</template>
