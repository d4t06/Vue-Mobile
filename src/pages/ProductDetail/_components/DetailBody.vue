<script setup lang="ts">
import { inject } from "vue";
import AttributeItem from "./child/AttributeItem.vue";
import Skeleton from "@/components/Skeleton/Skeleton.vue";
import DescSection from "./child/DescSection.vue";
import PushFrame from "@/components/ui/PushFrame.vue";

type Props = {
   loading: boolean;
   product: ProductDetail | null;
};

const props = defineProps<Props>();

const parentClasses = inject("classes") as Record<string, string>;

const classes = {
   specImage: "h-auto w-full mx-auto",
};
</script>
<template>
   <div class="md:flex md:mx-[-12px] mt-[40px]">
      <div class="md:w-8/12 md:px-[12px]">
         <h2 :class="parentClasses.title">Feature</h2>
         <DescSection :loading="props.loading" :product="product" />
      </div>

      <div class="md:w-4/12 md:px-[12px] mt-[30px] md:mt-0">
         <div class="sm:sticky top-[10px]">
            <h2 :class="parentClasses.title">Specification</h2>

            <template v-if="props.loading">
               <Skeleton className="pt-[100%] !rounded-[14px] mb-[20px]" />
               <Skeleton
                  v-for="key in [...Array(4).keys()]"
                  :key="key"
                  className="w-full h-[34px] !rounded-[6px] mb-[10px]"
               />
            </template>

            <PushFrame v-else-if="product" className="spec">
               <div class="p-[20px]">
                  <img
                     v-if="props.product?.image_url"
                     :class="classes.specImage"
                     :src="props.product?.image_url"
                  />
                  <img
                     v-else
                     class="m-auto"
                     :src="'https://d4t06.github.io/HD-Chat/assets/search-empty-ChRLxitn.png'"
                  />
               </div>
               <table class="w-full mt-[20px]">
                  <tbody>
                     <AttributeItem
                        v-for="id in product.category.attribute_order.split('_')"
                        :attributeId="+id"
                        :product="product"
                     />
                  </tbody>
               </table>
            </PushFrame>
         </div>
      </div>
   </div>
</template>
