<script setup lang="ts">
import Gallery from "@/components/Gallery.vue";
import Modal, { ModalRef } from "@/components/Modal/Modal.vue";
import Popup from "@/components/Popup/Popup.vue";
import PopupContent from "@/components/Popup/PopupContent.vue";
import PopupTrigger from "@/components/Popup/PopupTrigger.vue";
import PopupWrapper from "@/components/Popup/PopupWrapper.vue";
import LoadingOverlay from "@/components/ui/LoadingOverlay.vue";
import { Box } from "@/components/ui";
import OverlayCta from "@/components/ui/OverlayCta.vue";
import { ArrowPathIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { inject, ref } from "vue";
import { overlayButtonClasses } from "@/components/ui/classes/overlayButton";

type Props = {
   color: ProductColor;
   colorIndex: number;
};

type Modal = "add" | "change" | "delete";

const { color, colorIndex } = defineProps<Props>();

const classes = inject("classes") as Record<string, string>;
import useProductSliderAction from "./_hooks/useProductSliderAction";

const modal = ref<Modal>("add");
const currentIndex = ref<number>();
const currentSliderImage = ref<SliderImage>();

const modalRef = ref<ModalRef>();

const { actions, isFetching } = useProductSliderAction();

const openModal = (m: Modal) => {
   modal.value = m;
   modalRef.value?.open();
};

const closeModal = () => {
   modalRef.value?.close();
};

type Add = {
   action: "add";
   images: ImageType[];
};

type Delete = {
   action: "delete";
   sliderImage: SliderImage;
};

type Edit = {
   action: "edit";
   image: ImageType;
};

const sliderActions = async (props: Add | Delete | Edit) => {
   switch (props.action) {
      case "add":
         return actions({ action: "Add", color, colorIndex, images: props.images });

      case "delete": {
         if (currentIndex.value === undefined) return;

         return actions({
            action: "Delete",
            colorIndex,
            id: props.sliderImage.id,
            index: currentIndex.value,
         });
      }

      case "edit": {
         if (currentIndex.value === undefined || !currentSliderImage.value) return;
         if (props.image.id === currentSliderImage.value.image_id) return;

         const schema: SliderImageSchema = {
            image_id: props.image.id,
            link_to: currentSliderImage.value.link_to,
            slider_id: currentSliderImage.value.slider_id,
         };

         return actions({
            action: "Edit",
            sliderImage: schema,
            index: currentIndex.value,
            colorIndex,
            image: props.image,
            id: currentSliderImage.value.id,
         });
      }
   }
};

const handleChoseImage = (images: ImageType[], modal: Modal) => {
   switch (modal) {
      case "add":
         return sliderActions({
            action: "add",
            images,
         });
      case "change":
         return sliderActions({
            action: "edit",
            image: images[0],
         });
   }
};
</script>
<template>
   <div :class="`${classes.flexContainer} items-start sm:items-center flex-col sm:flex-row`">
      <div class="w-full sm:w-2/12 text-left sm:text-center">{{ color.color_name }}</div>
      <div :class="`${classes.flexContainer} w-full sm:w-auto sm:flex-grow  mt-[-16px]`">
         <div
            v-for="(sliderImage, index) in color.product_slider.slider.slider_images"
            :class="`${classes.flexCol} w-full sm:w-1/3 `"
         >
            <Box
               :class-name="`${
                  isFetching === 'delete' && currentIndex === index ? 'disable' : ''
               }`"
               padding-top="pt-[75%]"
            >
               <template v-slot:children>
                  <img :src="sliderImage.image.image_url" alt="" />

                  <OverlayCta :child-style="false">
                     <button
                        :class="`${overlayButtonClasses} p-1`"
                        :onClick="
                           () => {
                              currentSliderImage = sliderImage;
                              currentIndex = index;

                              openModal('change');
                           }
                        "
                     >
                        <ArrowPathIcon class="w-6" />
                     </button>

                     <Popup append-to="parent">
                        <PopupTrigger
                           variant="clear"
                           size="clear"
                           colors="clear"
                           border="clear"
                           :className="`${overlayButtonClasses} p-1`"
                           :onClick="() => (currentIndex = index)"
                        >
                           <TrashIcon class="w-6" />
                        </PopupTrigger>
                        <PopupContent
                           append-to="parent"
                           class-name="bottom-full left-full"
                        >
                           <PopupWrapper>
                              <button
                                 @click="
                                    () =>
                                       sliderActions({
                                          action: 'delete',
                                          sliderImage,
                                       })
                                 "
                              >
                                 <TrashIcon class="w-5" />
                                 <span>Delete</span>
                              </button>
                              <LoadingOverlay v-if="isFetching === 'delete'" />
                           </PopupWrapper>
                        </PopupContent>
                     </Popup>
                  </OverlayCta>
               </template>
            </Box>
         </div>
         <div :class="`${classes.flexCol} w-full sm:w-1/3 `">
            <Box
               :onClick="() => openModal('add')"
               :className="`${isFetching === 'add' ? 'disable' : ''}`"
               padding-top="pt-[75%]"
            >
               <template v-if="isFetching === 'add'" v-slot:children>
                  <ArrowPathIcon class="w-[24px] animate-spin" />
               </template>
            </Box>
         </div>
      </div>
   </div>

   <Modal ref="modalRef">
      <template v-slot:children>
         <Gallery
            v-if="modal === 'add' || modal === 'change'"
            variant="multiple"
            :close="closeModal"
            :handleChose="(images) => handleChoseImage(images, modal)"
         />
      </template>
   </Modal>
</template>
