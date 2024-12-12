<script setup lang="ts">
import AddSliderImage from "@/components/Form/AddSliderImage.vue";
import Gallery from "@/components/Gallery.vue";
import { ConfirmModal, Modal } from "@/components/Modal";
import { ModalRef } from "@/components/Modal/Modal.vue";
import { Box, OverlayCta } from "@/components/ui";
import useSliderActions from "@/hooks/useSliderActions";
import { ArrowPathIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

type Props = {
   categoryIndex: number;
   category: Category;
};

type Modal = "edit" | "add" | "delete";

const mainProps = defineProps<Props>();

const modal = ref<Modal>("add");
const currentSliderImageIndex = ref<number>();
const currentSliderImage = ref<SliderImage>();

const modalRef = ref<ModalRef>();

const openModal = (m: Modal) => {
   modal.value = m;
   modalRef.value?.open();
};

const closeModal = () => {
   modalRef.value?.close();
};

// hooks
const { isFetching, actions } = useSliderActions();

type Edit = {
   type: "Edit";
   image: ImageType;
   schema: SliderImageSchema;
};

type Add = {
   type: "Add";
   images: ImageType[];
};

type Delete = {
   type: "Delete";
};

const handleSliderActions = async (props: Add | Edit | Delete) => {
   switch (props.type) {
      case "Edit": {
         const { schema, image } = props;

         if (!currentSliderImage.value || currentSliderImageIndex.value === undefined)
            return;

         await actions({
            type: "edit",
            index: currentSliderImageIndex.value,
            sliderImage: schema,
            categoryIndex: mainProps.categoryIndex,
            image,
            id: currentSliderImage.value.id,
         });
         break;
      }

      case "Add":
         await actions({
            type: "add",
            categoryIndex: mainProps.categoryIndex,
            images: props.images,
            sliderId: mainProps.category.category_slider.slider_id,
         });

         break;

      case "Delete": {
         if (!currentSliderImage.value || currentSliderImageIndex.value === undefined)
            return;

         await actions({
            type: "delete",
            categoryIndex: mainProps.categoryIndex,
            sliderImageId: currentSliderImage.value.id,
            index: currentSliderImageIndex.value,
         });
         break;
      }
   }

   closeModal();
};
</script>

<template>
   <div class="p-[16px] border border-black/15 rounded-[16px] mb-[30px]">
      <h5 class="text-[18px] mb-[10px]">{{ category.category_name }}</h5>
      <div class="flex flex-wrap mx-[-8px] mt-[-8px]">
         <template
            v-for="(sliderImage, index) in category.category_slider.slider.slider_images"
         >
            <div class="w-1/2 px-[8px] flex-shrink-0 mt-[8px]">
               <Box padding-top="pt-[25%]" pushAble="clear">
                  <template v-slot:children>
                     <img :src="sliderImage.image.image_url || ''" alt="asd" />
                     <OverlayCta>
                        <button
                           class="p-1"
                           :onClick="
                              () => {
                                 currentSliderImageIndex = index;
                                 currentSliderImage = sliderImage;
                                 openModal('edit');
                              }
                           "
                        >
                           <ArrowPathIcon class="w-[24px]" />
                        </button>

                        <button
                           class="p-1"
                           :onClick="
                              () => {
                                 currentSliderImageIndex = index;
                                 openModal('delete');
                              }
                           "
                        >
                           <TrashIcon class="w-[24px]" />
                        </button>
                     </OverlayCta>
                  </template>
               </Box>
            </div>
         </template>

         <div class="w-1/2 px-[8px] flex-shrink-0 mt-[8px]">
            <Box
               padding-top="pt-[25%]"
               :onClick="
                  () => {
                     currentSliderImageIndex = undefined;
                     openModal('add');
                  }
               "
            >
               <template v-slot:children v-if="isFetching && !openModal">
                  <ArrowPathIcon class="w-[24px] animate-spin" />
               </template>
            </Box>
         </div>
      </div>
   </div>

   <Modal ref="modalRef">
      <template v-slot:children>
         <Gallery
            variant="multiple"
            v-if="modal === 'add'"
            :close="closeModal"
            :handleChose="(images) => handleSliderActions({ type: 'Add', images })"
         />

         <AddSliderImage
            v-if="currentSliderImage && modal === 'edit'"
            :props="{
               type: 'edit',
               closeModal: closeModal,
               loading: isFetching,
               submit: (schema, image) =>
                  handleSliderActions({ type: 'Edit', image, schema }),
               sliderImage: currentSliderImage,
            }"
         />

         <ConfirmModal
            v-if="modal === 'delete'"
            :close-modal="closeModal"
            :callback="() => handleSliderActions({ type: 'Delete' })"
            :loading="isFetching"
            :title="`Delete  :v`"
         />
      </template>
   </Modal>
</template>
