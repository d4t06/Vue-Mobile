<script setup lang="ts">
import PushFrame from "@/components/ui/PushFrame.vue";
import Title from "./Title.vue";
import { useCartStore } from "@/stores/cart";
import { storeToRefs } from "pinia";
import CartItem from "./child/CartItem.vue";
import { ShoppingBagIcon } from "@heroicons/vue/24/outline";

const cartStore = useCartStore();
const { cartItems, selectedCartItemId } = storeToRefs(cartStore);
</script>

<template>
   <Title>
      <ShoppingBagIcon class="w-[22px] md:w-[24px]" />
      <span>Tất cả sản phẩm ({{ cartItems.length }})</span>
   </Title>
   <PushFrame pushAble="clear">
      <div :class="`space-y-[20px] ${false ? 'disable' : ''}`">
         <CartItem
            v-for="(c, index) in cartItems"
            :isChecked="selectedCartItemId.includes(c.item.id)"
            :cartItem="c"
            :index="index"
         />
      </div>
   </PushFrame>
</template>
