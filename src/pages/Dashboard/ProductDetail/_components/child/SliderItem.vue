<script setup lang="ts">
import Gallery from "@/components/Gallery.vue";
import ConfirmModal from "@/components/Modal/ConfirmModal.vue";
import Modal from "@/components/Modal/Modal.vue";
import { Box, Button } from "@/components/ui";
import OverlayCta from "@/components/ui/OverlayCta.vue";
import { useProductDetailStore } from "@/stores/productDetail";
import { useToastStore } from "@/stores/toast";
import { inputClasses, sleep } from "@/utils/appHelper";
import { privateRequest } from "@/utils/request";
import { ArrowPathIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { inject, ref } from "vue";

const SLIDER_IMAGE_URL = "/sliders/images";

type Props = {
   color: ProductColor;
   index: number;
};

type Modal = "add" | "change" | "delete";

const { color, index } = defineProps<Props>();

const classes = inject("classes") as Record<string, string>;
const toastStore = useToastStore();
const p = useProductDetailStore();
const { productDetail } = storeToRefs(p);

const openModal = ref<Modal | "">("");
const isFetching = ref<"add" | "delete" | "update" | "">("");
const currentIndex = ref<number | null>(null);

// hooks
// const { isFetching, sliderActions } = useSliderActions({ close: closeModal });

const closeModal = () => (openModal.value = "");

type AddImages = {
   variant: "add";
   images: ImageType[];
};

type DeleteImages = {
   variant: "delete";
   sliderImage: SliderImage;
   index: number;
};

const sliderActions = async (props: AddImages | DeleteImages) => {
   try {
      if (!productDetail.value) return;

      switch (props.variant) {
         case "add":
            const sliderImageSchemas = props.images.map(
               (image) =>
                  ({
                     image_id: image.id,
                     slider_id: color.product_slider.slider_id,
                     link_to: "",
                  } as SliderImageSchema)
            );

            isFetching.value = "add";

            if (import.meta.env.DEV) await sleep(1000);

            const res = await privateRequest.post(
               `${SLIDER_IMAGE_URL}`,
               sliderImageSchemas
            );
            const newSliderImages = res.data.data as SliderImage[];

            productDetail.value.colors[index].product_slider.slider.slider_images.push(
               ...newSliderImages
            );

            toastStore.setSuccessToast("Add slider images successful");
            break;

         case "delete": {
            isFetching.value = "delete";
            currentIndex.value === props.index;

            console.log("delete check index", props.index);

            if (import.meta.env.DEV) await sleep(1000);

            await privateRequest.delete(`${SLIDER_IMAGE_URL}/${props.sliderImage.id}`);

            productDetail.value.colors[index].product_slider.slider.slider_images.splice(
               props.index,
               1
            );

            toastStore.setSuccessToast("Delete slider image successful");
         }
      }
   } catch (error) {
      console.log({ message: error });

      toastStore.setErrorToast("");
   } finally {
      isFetching.value = "";
   }
};
</script>
<template>
   <div :class="`${classes.flexContainer} items-center`">
      <div class="w-2/12 text-center">{{ color.color_name }}</div>
      <div :class="`${classes.flexContainer} flex-grow mt-[-16px]`">
         <div
            v-for="(sliderImage, sliderIndex) in color.product_slider.slider
               .slider_images"
            :class="`${classes.flexCol} w-1/3 `"
         >
            <Box
               :className="`pt-[75%] ${
                  isFetching === 'delete' && currentIndex === sliderIndex ? 'disable' : ''
               }`"
            >
               <template v-slot:children>
                  <img :src="sliderImage.image.image_url" alt="" />
                  <OverlayCta>
                     <button
                        :class="inputClasses.overlayButton"
                        :onClick="() => {}"
                     >
                        <ArrowPathIcon class="w-[24px]" />
                     </button>
                     <button
                        :class="inputClasses.overlayButton"
                        :onClick="
                           () =>
                              sliderActions({
                                 variant: 'delete',
                                 sliderImage,
                                 index: sliderIndex,
                              })
                        "
                     >
                        <TrashIcon class="w-[24px]" />
                     </button>
                  </OverlayCta>
               </template>
            </Box>
         </div>
         <div :class="`${classes.flexCol} w-1/3 `">
            <Box
               :onClick="() => (openModal = 'add')"
               :className="`pt-[75%] ${isFetching === 'add' ? 'disable' : ''}`"
            >
               <template v-if="isFetching === 'add'" v-slot:children>
                  <ArrowPathIcon class="w-[24px] animate-spin" />
               </template>
            </Box>
         </div>
      </div>
   </div>

   <Modal v-if="!!openModal" :close="closeModal">
      <template v-slot:children>
         <Gallery
            variant="multiple"
            :close="closeModal"
            :handleChose="(images) => sliderActions({ variant: 'add', images })"
         />

         <ConfirmModal
            v-if="openModal === 'delete'"
            :close="closeModal"
            :callback="() => {}"
            :loading="false"
            :title="`Delete  :v`"
         />
      </template>
   </Modal>
</template>
