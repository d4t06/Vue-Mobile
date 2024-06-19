<script setup lang="ts">
import { CartAction } from "@/hooks/useCartAction";
import { MinusIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { ref, watchEffect } from "vue";

type Props = {
   actions: CartAction;
   cartItem: cartItemDetail;
   isFetching: boolean;
   index: number;
};

const props = defineProps<Props>();

const colorRef = ref();
const storageRef = ref();

type HandleCartAction = {
   cartItem: Partial<CartItemSchema>;
   change: "variant" | "amount";
};

const handleCartItemAction = async (agrs: HandleCartAction) => {
   const {
      item: { product, id, ...rest },
   } = props.cartItem;

   const schema: CartItemSchema = {
      ...rest,
      ...agrs.cartItem,
   };

   switch (agrs.change) {
      case "amount":
         return await props.actions({
            variant: "edit",
            cartItem: schema,
            change: "amount",
            index: props.index,
            id: props.cartItem.item.id,
         });

      case "variant":
         return await props.actions({
            variant: "edit",
            cartItem: schema,
            change: "whole",
            index: props.index,
            id: props.cartItem.item.id,
         });
   }
};

watchEffect(() => {
   if (storageRef.value && colorRef.value) {
      (storageRef.value as HTMLSelectElement).value = props.cartItem.item.storage_id + "";
      (colorRef.value as HTMLSelectElement).value = props.cartItem.item.color_id + "";
   }
});

const classes = {
   container: "flex flex-col space-y-[10px] md:space-y-0 md:space-x-[16px] md:flex-row ",
   variantLabel: "text-[#3f3f3f]",
   button: "hover:bg-[#e1e1e1] border-[#e1e1e1] h-full px-[6px]",

   select:
      "px-[14px] h-[32px] border border-[#e1e1e1] bg-[#fff] hover:bg-[#f1f1f1] cursor-pointer rounded-[99px] font-[500] text-[14px] text-[#333] text-[500]",
   quantityBox:
      "inline-flex h-[32px] border-[#e1e1e1] border  justify-between  overflow-hidden items-center text-[#333] rounded-[99px] bg-[#fff]",
};
</script>

<template>
   <div :class="`${classes.container} ${props.isFetching ? 'disable' : ''}`">
      <div class="space-y-[4px]">
         <p :class="classes.variantLabel">Quantity</p>
         <div :class="classes.quantityBox">
            <button
               :disabled="cartItem.item.amount === 1"
               :class="`${classes.button} border-r`"
               :onClick="
                  () =>
                     handleCartItemAction({
                        change: 'amount',
                        cartItem: {
                           amount: props.cartItem.item.amount - 1,
                        },
                     })
               "
            >
               <MinusIcon class="w-[22px]" />
            </button>
            <p class="px-[14px] font-[500] leading-[1]">{{ cartItem.item.amount }}</p>
            <button
               :class="`${classes.button} border-l`"
               :onClick="
                  () =>
                     handleCartItemAction({
                        change: 'amount',
                        cartItem: {
                           amount: props.cartItem.item.amount + 1,
                        },
                     })
               "
            >
               <PlusIcon class="w-[22px]" />
            </button>
         </div>
      </div>
      <div class="space-y-[4px]">
         <p :class="classes.variantLabel">Color</p>
         <select
            ref="colorRef"
            :onChange="(e) => handleCartItemAction({
               change: 'variant',
               cartItem: {
               color_id: +(e.target as HTMLSelectElement).value
            }})"
            :class="classes.select"
            name=""
            id=""
         >
            <option v-for="c in props.cartItem.item.product.colors" :value="c.id">
               {{ c.color_name }}
            </option>
         </select>
      </div>
      <div class="space-y-[4px]">
         <p :class="classes.variantLabel">Storage</p>

         <select
            ref="storageRef"
            :onChange="(e) => handleCartItemAction({
               change: 'variant',
                cartItem: {
               storage_id: +(e.target as HTMLSelectElement).value
            }})"
            :class="classes.select"
            name=""
            id=""
         >
            <option v-for="s in props.cartItem.item.product.storages" :value="s.id">
               {{ s.storage_name }}
            </option>
         </select>
      </div>
   </div>
</template>
