<script setup lang="ts">
import type { Product } from "@/types";
import { moneyFormat } from "@/utils/appHelper";

type Props = {
   product: Product;
};

const { product } = defineProps<Props>();
</script>

<template>
   <div class="product-item">
      <RouterLink :to="``" class="product-item-frame">
         <img class="product-item-image" :src="product.image_url" />
      </RouterLink>

      <div class="product-item-body">
         <h4 class="product-item_name">{{ product.product_name }}</h4>

         <div class="product-item_price">
            <h1 class="product-item_price--current">
               {{ moneyFormat(product.price) }}
            </h1>
         </div>
      </div>
   </div>
</template>
<style lang="scss">
@import url(./ProductItem.Module.scss);
</style>