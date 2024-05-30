<script lang="ts" setup>
import ConfirmModal from "@/components/Modal/ConfirmModal.vue";
import Modal from "@/components/Modal/Modal.vue";
import { Box, Button, OverlayCta } from "@/components/ui";
import useCategory from "@/hooks/useCategory";
import { inputClasses } from "@/utils/appHelper";
import { ArrowPathIcon, TrashIcon } from "@heroicons/vue/24/outline";
import useSliderActions from "@/hooks/useSliderActions";
import { reactive, ref } from "vue";

import AddSliderImage from "@/components/Form/AddSliderImage.vue";

const { categories, status } = useCategory({ autoGetCategories: true });

type Modal = "add" | "edit" | "delete" | "close";
// const currentSlider = ref<Slider>();
// const currentSliderIndex = ref<number>();
// const currentSliderImage = ref<SliderImage>();
// const currentSliderImageIndex = ref<number>();

const currentData = reactive<{
   currentSlider: Slider | null;
   currentSliderIndex: number | null;
   currentSliderImage: SliderImage | null;
   currentSliderImageIndex: number | null;
}>({
   currentSlider: null,
   currentSliderImage: null,
   currentSliderImageIndex: null,
   currentSliderIndex: null,
});

const isOpenModal = ref<Modal>("close");

const handleCloseModal = () => (isOpenModal.value = "close");

// hooks
const { isFetching, sliderActions } = useSliderActions({ close: handleCloseModal });

type OpenModal = {
   modal: Modal;
};

interface OpenAddModal extends OpenModal {
   modal: "add";
   currentSlider: Slider;
   currentSliderIndex: number;
}

interface OpenEditModal extends OpenModal {
   modal: "edit";
   currentSlider: Slider;
   currentSliderIndex: number;
   currentSliderImage: SliderImage;
   currentSliderImageIndex: number;
}

interface OpenDeleteModal extends OpenModal {
   modal: "delete";
   currentSlider: Slider;
   currentSliderIndex: number;
   currentSliderImage: SliderImage;
   currentSliderImageIndex: number;
}

const handleOpenModal = (props: OpenAddModal | OpenEditModal | OpenDeleteModal) => {
   const { modal, ...rest } = props;

   console.log("open modal check res", rest);

   Object.assign(currentData, rest);

   // switch (props.modal) {
   //    case "add":
   //       currentSlider.value = props.slider;
   //       break;
   //    case "edit":
   //       Object.assign(currentData, props);
   //       break;
   //    case "delete":
   //       const { currentSliderImageIndex: _sliderImageIndex, slider: _slider } = props;
   //       currentSlider.value = _slider;
   //       currentSliderImageIndex.value = _index;
   //       break;
   // }

   isOpenModal.value = props.modal;
};

interface AddSliderImage extends OpenModal {
   modal: "add";
   sliderImage: SliderImageSchema;
   image: ImageType;
}

interface EditSliderImage extends OpenModal {
   modal: "edit";
   sliderImage: SliderImageSchema;
   image: ImageType;
}

interface DeleteSliderImage extends OpenModal {
   modal: "delete";
}

type UseSliderActions = AddSliderImage | EditSliderImage | DeleteSliderImage;

const handleUseSliderActions = async (props: UseSliderActions) => {
   switch (props.modal) {
      case "add":
         if (currentData.currentSliderIndex === null) return;

         await sliderActions({
            type: "add-image",
            sliderImage: props.sliderImage,
            sliderIndex: currentData.currentSliderIndex,
            image: props.image,
         });
         break;
      case "edit":
         if (
            currentData.currentSliderImageIndex === null ||
            currentData?.currentSlider === null
         )
            return;
         await sliderActions({
            type: "edit-image",
            sliderImage: props.sliderImage,
            sliderIndex: currentData.currentSliderImageIndex,
            sliderImageID: currentData.currentSlider.id,
            image: props.image,
         });
         break;

      case "delete":
         if (
            currentData?.currentSliderImage === null ||
            currentData.currentSliderIndex === null
         )
            return;
         await sliderActions({
            type: "delete-image",
            sliderImageID: currentData.currentSliderImage.id,
            sliderIndex: currentData.currentSliderIndex,
         });
   }
};
</script>
<template>
   <template v-if="status === 'loading'">
      <ArrowPathIcon class="w-[24px] animate-spin" />
   </template>
   <template v-else>
      <h1 class="text-[24px] font-[500] mb-[16px]">Banner</h1>

      <p v-if="status === 'error'">Some thing went wrong</p>
      <template v-else v-for="(category, currentSliderIndex) in categories">
         <div class="p-[16px] bg-white rounded-[16px] mb-[30px]">
            <h5 class="text-[18px] mb-[10px]">{{ category.category_name }}</h5>
            <div class="flex flex-wrap mx-[-8px] mt-[-8px]">
               <template
                  v-for="(currentSliderImage, index) in category.category_slider.slider
                     .slider_images"
               >
                  <div class="w-1/2 px-[8px] flex-shrink-0 mt-[8px]">
                     <Box className="pt-[25%]">
                        <template v-slot:children>
                           <img
                              :src="currentSliderImage.image.image_url || ''"
                              alt="asd"
                           />
                           <OverlayCta>
                              <Button
                                 variant="clear"
                                 size="clear"
                                 colors="clear"
                                 :class="inputClasses.overlayButton"
                                 :onClick="
                                    () =>
                                       handleOpenModal({
                                          modal: 'edit',
                                          currentSliderImageIndex: index,
                                          currentSlider: category.category_slider.slider,
                                          currentSliderImage: currentSliderImage,
                                          currentSliderIndex: currentSliderIndex,
                                       })
                                 "
                              >
                                 <ArrowPathIcon class="w-[24px]" />
                              </Button>

                              <Button
                                 variant="clear"
                                 size="clear"
                                 colors="clear"
                                 :class="inputClasses.overlayButton"
                                 :onClick="
                                    () =>
                                       handleOpenModal({
                                          modal: 'delete',
                                          currentSliderImage: currentSliderImage,
                                          currentSliderImageIndex: index,
                                          currentSlider: category.category_slider.slider,
                                          currentSliderIndex: currentSliderIndex,
                                       })
                                 "
                              >
                                 <TrashIcon class="w-[24px]" />
                              </Button>
                           </OverlayCta>
                        </template>
                     </Box>
                  </div>
               </template>

               <div class="w-1/2 px-[8px] flex-shrink-0 mt-[8px]">
                  <Box
                     className="pt-[25%]"
                     :onClick="
                        () =>
                           handleOpenModal({
                              modal: 'add',
                              currentSlider: category.category_slider.slider,
                              currentSliderIndex: currentSliderIndex,
                           })
                     "
                  />
               </div>
            </div>
         </div>
      </template>
   </template>

   <Modal v-if="isOpenModal !== 'close'" :close="handleCloseModal">
      <template v-slot:children>
         <AddSliderImage
            v-if="currentData.currentSlider && isOpenModal === 'add'"
            type="add"
            :close="handleCloseModal"
            :isLoading="isFetching == 'add-image'"
            :currentSlider="currentData.currentSlider"
            :submit="
               (sliderImageSchema, image) =>
                  handleUseSliderActions({
                     modal: 'add',
                     sliderImage: sliderImageSchema,
                     image,
                  })
            "
         />

         <AddSliderImage
            v-if="currentData.currentSliderImage && isOpenModal === 'edit'"
            type="edit"
            :close="handleCloseModal"
            :isLoading="isFetching == 'add-image'"
            :submit="
               (sliderImageSchema, image) =>
                  handleUseSliderActions({
                     modal: 'edit',
                     sliderImage: sliderImageSchema,
                     image,
                  })
            "
            :currentSliderImage="currentData.currentSliderImage"
         />

         <ConfirmModal
            v-if="isOpenModal === 'delete'"
            :close="handleCloseModal"
            :callback="() => handleUseSliderActions({ modal: 'delete' })"
            :loading="isFetching === 'delete-image'"
            :title="`Delete  :v`"
         />
      </template>
   </Modal>
</template>
@/hooks/useCategory@/hooks/useSliderActions