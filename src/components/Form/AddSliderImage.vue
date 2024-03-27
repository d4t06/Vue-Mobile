<script setup lang="ts">
import ModalHeader from "../Modal/ModalHeader.vue";
import Modal from "../Modal/Modal.vue";
import Gallery from "../Gallery.vue";
import { reactive, ref, watch } from "vue";
import type { ImageType, Slider, SliderImage, SliderImageSchema } from "@/types";
import { useImageStore } from "@/stores/image";
import MyInput from "../ui/MyInput.vue";
import Button from "../ui/Button.vue";
import Box from "../ui/Box.vue";
import { inputClasses } from "@/utils/appHelper";
import OverlayCta from "../ui/OverlayCta.vue";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

type BaseProps = {
   submit: (data: SliderImageSchema, image: ImageType) => void;
   close: () => void;
   isLoading: boolean;
};

type AddProps = BaseProps & {
   type: "add";
   currentSlider?: Slider;
};

type EditProps = BaseProps & {
   type: "edit";
   sliderImage?: SliderImage;
};

type Props = AddProps | EditProps;

const props = defineProps<Props>();

const isOpenModal = ref(false);

const chosenImage = ref<ImageType>();
const sliderImageData = reactive<{
   image: ImageType | null;
   link_to: string;
   slider_id: number | null;
}>({
   image: null,
   link_to: "",
   slider_id: null,
});

const imageStore = useImageStore();

const closeModalSelf = () => (isOpenModal.value = false);

const handleChoseImage = (imageUrl: string) => {
   const image = imageStore.images.find((i) => i.image_url === imageUrl);
   if (!image) return console.log(">>> image not found");
   else {
      sliderImageData.image = image;
      chosenImage.value = image;
   }
};

const handleSubmit = () => {
   if (!sliderImageData.image || !chosenImage.value) return;

   switch (props.type) {
      case "add":
         if (!props.currentSlider) return;
         sliderImageData.slider_id = props.currentSlider.id;
      case "edit":
         if (sliderImageData.slider_id === null) return;

         const sliderImageSchema: SliderImageSchema = {
            image_id: sliderImageData.image.id,
            link_to: sliderImageData.link_to,
            slider_id: sliderImageData.slider_id,
         };

         props.submit(sliderImageSchema, chosenImage.value);
   }
};

// run init slider data when edit
watch(
   () => 0,
   () => {
      if (props.type === "edit") {
         Object.assign(sliderImageData, props.sliderImage);
      }
   },
   { immediate: true }
);

const titleMaps = {
   add: "Add slider image",
   edit: "Edit slider image",
};
</script>
<template>
   <div class="w-[700px] max-w-[80vw]">
      <ModalHeader :close="close" :title="titleMaps[props.type]" />
      <div class="w-full">
         <Box v-if="sliderImageData.image?.image_url" className="pt-[25%]">
            <template v-slot:children>
               <img :src="sliderImageData.image.image_url" alt="asd" />
               <OverlayCta>
                  <Button
                     variant="clear"
                     size="clear"
                     colors="clear"
                     :class="inputClasses.overlayButton"
                     :onClick="() => (isOpenModal = true)"
                  >
                     <ArrowPathIcon class="w-[24px]" />
                  </Button>
               </OverlayCta>
            </template>
         </Box>
         <Box v-else className="pt-[25%]" :onClick="() => (isOpenModal = true)" />
      </div>

      <MyInput
         class="mt-[20px]"
         :attrs="{ value: sliderImageData.link_to, placeholder: 'Link to some thing' }"
         @input="sliderImageData.link_to"
      />

      <div class="text-right">
         <Button
            class="mt-[30px]"
            variant="push"
            :onClick="handleSubmit"
            :loading="isLoading"
            :disabled="!sliderImageData.image"
         >
            {{ props.type === "add" ? "Add" : "Save change" }}
         </Button>
      </div>
   </div>

   <Modal v-if="isOpenModal" :close="closeModalSelf">
      <Gallery :handleChose="(value) => handleChoseImage(value)" :close="closeModalSelf" />
   </Modal>
</template>
