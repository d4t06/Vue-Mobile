<script setup lang="ts">
import Slider from "@/components/Slider.vue";
import { Button } from "@/components/ui";
import { moneyFormat } from "@/utils/appHelper";
import { computed, ref, toRef } from "vue";
import useGetDefaultCombine from "../_hooks/useGetDefaultCombine";
import Skeleton from "@/components/Skeleton/Skeleton.vue";
import DetailTopSkeleton from "@/components/Skeleton/DetailTopSkeleton.vue";
import PushFrame from "@/components/ui/PushFrame.vue";
import useCartAction from "@/hooks/useCartAction";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { Modal, ModalHeader } from "@/components/Modal";
import StorageItem from "./child/StorageItem.vue";

type Props = {
   loading: boolean;
   product: ProductDetail | null;
};

const props = defineProps<Props>();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const storage = ref<ProductStorage>();
const color = ref<ProductColor>();
const openModal = ref(false);

const productRef = toRef(props, "product");

// hooks
const { actions, isFetching } = useCartAction();
useGetDefaultCombine({ color, product: productRef, storage });

const currentSliderImages = computed(() => {
   if (!color.value) return [];

   return color.value.product_slider.slider.slider_images;
});

const curCombine = computed(() => {
   if (!color.value || !storage.value || !props.product) return;

   return props.product.combines.find(
      (c) => c.color_id === color.value!.id && c.storage_id === storage.value!.id
   );
});

const closeModal = () => (openModal.value = false);

const findDefaultCombineOfStorage = (storage: ProductStorage) => {
   if (!props.product) return;

   return props.product.combines.find((c) => c.id === storage.default_combine.combine_id);
};

const handleChoseStorage = (s: ProductStorage) => {
   if (!props.product) return;

   const defaultCombine = findDefaultCombineOfStorage(s);
   const c = props.product.colors.find((c) => c.id === defaultCombine?.color_id);

   storage.value = s;
   if (c) color.value = c;
};

const handleAddCartItem = async () => {
   if (!user.value) return (openModal.value = true);

   if (!color.value || !storage.value || !user.value || !props.product) return;

   const schema: CartItemSchema = {
      amount: 1,
      color_id: color.value.id,
      product_id: props.product.id,
      username: user.value.username,
      storage_id: storage.value.id,
   };

   await actions({ variant: "add", cartItem: schema });
};

const classes = {
   proName: "text-[26px] font-[500] leading-[1.2]",
   label: "text-[18px] text-[#3f3f3f] leading-[1.2]",
   variantButton: "h-[56px]",
   price: "text-[30px] md:text-[34px] text-[#cd1818] font-[600] leading-[1.4]",
};
</script>
<template>
   {{ console.log("check current combine", curCombine) }}
   <div class="md:flex md:mx-[-12px]">
      <div class="md:w-7/12 md:px-[12px]">
         <template v-if="props.loading">
            <Skeleton className="pt-[50%] w-full" />
         </template>
         <Slider v-else className="pt-[50%]" :sliderImages="currentSliderImages" />
      </div>

      <div class="mt-[40px] md:mt-0 md:w-5/12 md:px-[12px]">
         <template v-if="props.loading">
            <DetailTopSkeleton />
         </template>

         <template v-else-if="props.product">
            <h1 :class="classes.proName">{{ props.product.product_name }}</h1>

            <PushFrame push-able="clear" class-name="mt-[20px]">
               <div class="space-y-[14px]">
                  <div class="">
                     <h5 :class="classes.label">Storage</h5>
                     <div class="flex flex-wrap mx-[-4px]">
                        <div
                           v-for="s in props.product.storages"
                           class="w-1/2 md:w-1/3 px-[4px] mt-[8px]"
                        >
                           <StorageItem
                              :storage="s"
                              :active="s.id === storage?.id"
                              :handleChoseStorage="handleChoseStorage"
                              :defaultCombine="findDefaultCombineOfStorage(s)"
                           />
                        </div>
                     </div>
                  </div>

                  <div class="">
                     <h5 :class="classes.label">Color</h5>
                     <div class="flex flex-wrap mx-[-4px]">
                        <div
                           v-for="c in props.product.colors"
                           class="w-1/2 md:w-1/3 px-[4px] mt-[8px]"
                        >
                           <Button
                              :className="`w-full ${classes.variantButton}`"
                              :active="c.id === color?.id"
                              :onClick="() => (c.id !== color?.id ? (color = c) : {})"
                              variant="push"
                              colors="secondary"
                           >
                              {{ c.color_name }}
                           </Button>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="mt-[20px]">
                  <h5 :class="classes.label">Price</h5>
                  <h1 :class="classes.price">
                     {{ curCombine?.price ? moneyFormat(curCombine.price) : "Contact" }}
                  </h1>
               </div>
            </PushFrame>
            <Button
               :loading="isFetching"
               :onClick="handleAddCartItem"
               className="h-[40px] font-[500] mt-[20px]"
               variant="push"
               border="clear"
               size="full"
            >
               BUY NOW
            </Button>
         </template>
      </div>
   </div>

   <Modal zIndex="z-[199]" v-if="openModal" :close="closeModal">
      <template v-slot:children>
         <div class="w-[300px] max-w-[80vw]">
            <ModalHeader title="" :close="closeModal" />
            <img
               class="mx-auto"
               src="https://zalo-api.zadn.vn/api/emoticon/sticker/webpc?eid=46989&size=130"
               alt=""
            />
            <p class="text-center mt-[10px]">Login to buy product !!!</p>
         </div>
      </template>
   </Modal>
</template>
