<script setup lang="ts">
import ModalHeader from "../Modal/ModalHeader.vue";
import Modal from "../Modal/Modal.vue";
import Gallery from "../Gallery.vue";
import { computed, reactive, ref, watch } from "vue";

import MyInput from "../ui/MyInput.vue";
import Button from "../ui/Button.vue";
import Box from "../ui/Box.vue";
import { inputClasses } from "@/utils/appHelper";
import OverlayCta from "../ui/OverlayCta.vue";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

type BaseProps = {
   submit: (data: SliderImageSchema, image: ImageType) => void;
   close: () => void;
   loading: boolean;
};

type AddProps = BaseProps & {
   type: "add";
   currentSlider: Slider;
};

type EditProps = BaseProps & {
   type: "edit";
   sliderImage: SliderImage;
};

type Props = {
   props: AddProps | EditProps;
};

const p = defineProps<Props>();

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

const isSameImage = computed(
   () =>
      p.props.type === "edit" &&
      sliderImageData.image?.id === p.props.sliderImage.image_id
);

const closeModalSelf = () => (isOpenModal.value = false);

const handleSubmit = () => {
   if (!sliderImageData.image || !chosenImage.value) return;
   if (isSameImage.value) return;

   if (p.props.type === "add") {
      if (!p.props.currentSlider) return;
      sliderImageData.slider_id = p.props.currentSlider.id;
   }

   console.log("check sliderImageData", sliderImageData);

   if (sliderImageData.slider_id === null) return;

   const sliderImageSchema: SliderImageSchema = {
      image_id: sliderImageData.image.id,
      link_to: sliderImageData.link_to,
      slider_id: sliderImageData.slider_id,
   };

   p.props.submit(sliderImageSchema, chosenImage.value);
};

// run init slider data when edit
watch(
   () => 0,
   () => {
      if (p.props.type === "edit") {
         Object.assign(sliderImageData, p.props.sliderImage);
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
      <ModalHeader :close="p.props.close" :title="titleMaps[p.props.type]" />
      <div class="w-full">
         <Box v-if="sliderImageData.image?.image_url" className="pt-[25%]">
            <template v-slot:children>
               <img :src="sliderImageData.image.image_url" alt="asd" />
               <OverlayCta>
                  <button
                     :class="`${inputClasses.overlayButton} rounded-[8px]`"
                     :onClick="() => (isOpenModal = true)"
                  >
                     <ArrowPathIcon class="w-[24px]" />
                  </button>
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
            :loading="p.props.loading"
            :disabled="!sliderImageData.image || isSameImage"
         >
            {{ p.props.type === "add" ? "Add" : "Save change" }}
         </Button>
      </div>
   </div>

   <Modal zIndex="z-[199]" v-if="isOpenModal" :close="closeModalSelf">
      <template v-slot:children>
         <Gallery
            :handleChose="
               (images) => {
                  sliderImageData.image = images[0];
                  chosenImage = images[0];
               }
            "
            :close="closeModalSelf"
         />
      </template>
   </Modal>
</template>
