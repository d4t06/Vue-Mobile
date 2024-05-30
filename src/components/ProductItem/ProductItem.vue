<script setup lang="ts">
import { moneyFormat } from "@/utils/appHelper";
import { ref, watchEffect } from "vue";
import { Button } from "../ui";

type Props = {
   product: ProductList;
};

const { product } = defineProps<Props>();

const findDefaultStorage = (): ProductStorageDetail | undefined => {
   return product.storages.find(
      (storage) => storage.id === product.default_storage.storage_id
   );
};

const storage = ref<ProductStorageDetail | undefined>();

watchEffect(() => {
   storage.value = findDefaultStorage();
});
</script>

<template>
   <div class="product-item">
      <RouterLink :to="`product/${product.product_ascii}`" class="product-item-frame">
         <img class="product-item-image" :src="product.image_url" />
      </RouterLink>

      <div class="product-item-body">
         <h4 class="product-item_name">{{ product.product_name }}</h4>

         <div class="flex flex-wrap mx-[-4px] mt-[6px]">
            <div v-for="s in product.storages" class="w-1/2 px-[4px] mt-[8px]">
               <Button
                  :className="`storage-item w-full`"
                  :active="s.id === storage?.id"
                  :onClick="() => (s.id !== storage?.id ? (storage = s) : {})"
                  variant="push"
                  colors="secondary"
               >
                  {{ s.storage }}
               </Button>
            </div>
         </div>

         <div class="product-item_price">
            <h1 class="product-item_price--current">
               {{
                  storage?.default_combine.combine
                     ? moneyFormat(storage?.default_combine.combine.price)
                     : "Contact"
               }}
            </h1>
         </div>
      </div>
   </div>
</template>
<style lang="scss">
@import url(./ProductItem.Module.scss);
</style>
