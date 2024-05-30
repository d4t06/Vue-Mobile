<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import Button from "./ui/Button.vue";
import { formatSize } from "@/utils/appHelper";

import { ArrowPathIcon, ArrowUpTrayIcon } from "@heroicons/vue/24/outline";
import GalleryItem from "./GalleryItem.vue";
import useImageAction from "@/hooks/useUploadImage";
import Skeleton from "./Skeleton/Skeleton.vue";

type Props = {
   handleChose: (images: ImageType[]) => void;
   close: () => void;
   variant?: "one" | "multiple";
};

const { close, handleChose, variant } = withDefaults(defineProps<Props>(), {
   variant: "one",
});

const chosenImage = ref<ImageType>();
const selectImages = ref<ImageType[]>([]);

const {
   getImages,
   isRemaining,
   isLast,
   page,
   images,
   tempImages,
   status,
   isFetching,
   deleteImage,
} = useImageAction();

const ableToChosenImage = computed(() => status.value === "success" && chosenImage.value);

const handleSelectImage = (image: ImageType) => {
   console.log("select image");

   switch (variant) {
      case "one":
         selectImages.value = [image];

         break;
      case "multiple":
         const newSelectImages = [...selectImages.value];

         const index = newSelectImages.findIndex((i) => i.id === image.id);
         if (index === -1) {
            newSelectImages.push(image);
         } else newSelectImages.splice(index, 1);

         selectImages.value = newSelectImages;
   }
};

const handleSubmit = async () => {
   if (!chosenImage.value) return;

   switch (variant) {
      case "one":
         handleChose([chosenImage.value]);
         break;
      case "multiple":
         handleChose(selectImages.value);
         break;
   }
   close();
};

const handleDeleteImage = async () => {
   if (!chosenImage.value) return;
   await deleteImage(chosenImage.value.public_id);
};

const handleGetMore = () => {
   getImages(page.value + 1);
};

watch(
   () => 0,
   () => {
      getImages(0);
   },
   {
      immediate: true,
   }
);

// console.log("chekc is lsat", isLast.value);

const classes = {
   container: "w-[90vw] bg-white h-[80vh] overflow-hidden",
   imageContainer: "relative pt-[100%]",
   imageFrame:
      "absolute flex  w-full items-center justify-center bg-[#f1f1f1] inset-0 rounded-[8px] border-[2px] border-[#ccc] hover:border-[#cd1818] overflow-hidden",
   galleryTop:
      "h-[40px] pt-[2px] flex justify-between items-center border-b border-[#ccc] mb-[10px] pb-[10px]",
   galleryBody: "flex mx-[-10px]",
   bodyLeft:
      "h-[calc(80vh-60px-2px)] w-2/3 no-scrollbar px-[10px] overflow-x-hidden overflow-y-auto",
   bodyRight: "px-[10px] w-1/3 overflow-hidden border-l-[2px] space-y-[14px]",
};
</script>

<template>
   <div :class="classes.container">
      <div :class="classes.galleryTop">
         <div :class="'flex items-center'">
            <h1 class="text-[22px] font-[500]">Gallery</h1>
            <Button
               variant="push"
               colors="secondary"
               :class="`ml-[10px]  ${
                  status === 'loading' ? 'opacity-60 pointer-events-none' : ''
               }`"
            >
               <label :class="`flex  cursor-pointer`" htmlFor="image-upload">
                  <ArrowUpTrayIcon class="w-[22px] mr-[4px]" />
                  Upload
               </label>
            </Button>
         </div>

         <Button variant="push" :disabled="!ableToChosenImage" :onClick="handleSubmit">
            Select
         </Button>
      </div>
      <div :class="classes.galleryBody">
         <div :class="classes.bodyLeft">
            <p v-if="status === 'error'">Some thing went wrong</p>
            <template v-else>
               <div class="flex flex-wrap mt-[-8px]">
                  <!-- render temporary image -->
                  <template v-for="tempImage in tempImages">
                     <GalleryItem
                        :props="{
                           variant: 'loading',
                           imageUrl: tempImage.image_url,
                        }"
                     >
                        <ArrowPathIcon
                           class="animate-spin absolute z-10 duration-1000 text-[#000] w-[30px]"
                        />
                     </GalleryItem>
                  </template>
                  <!-- render current images -->
                  <template v-for="image in images">
                     <GalleryItem
                        v-if="variant === 'one'"
                        :props="{
                           variant: 'one',
                           imageUrl: image.image_url,
                           active: chosenImage?.id === image.id,
                           onClick: () => (chosenImage = image),
                        }"
                     />

                     <GalleryItem
                        v-if="variant === 'multiple'"
                        :props="{
                           variant: 'multiple',
                           imageUrl: image.image_url,
                           active: chosenImage?.id === image.id,
                           chose: () => (chosenImage = image),
                           select: () => handleSelectImage(image),
                           index: selectImages.indexOf(image) + 1,
                        }"
                     />
                  </template>

                  <template v-if="status == 'loading'">
                     <div
                        v-for="_key in [...Array(18).keys()]"
                        class="w-1/6 px-[4px] mt-[8px]"
                     >
                        <Skeleton className="pt-[100%]" />
                     </div>
                  </template>
               </div>
            </template>

            <div v-if="images.length && isRemaining" class="text-center mt-[14px]">
               <Button :disabled="isLast" :onClick="handleGetMore" variant="push">
                  More
               </Button>
            </div>
         </div>
         <div :class="classes.bodyRight">
            <template v-if="chosenImage">
               <ul class="space-y-[14px]">
                  <li>
                     <h2 class="break-words">{{ chosenImage.name }}</h2>
                  </li>
                  <li>
                     <span class="font-[500] mr-[10px]">Image path:</span>

                     <a
                        class="hover:underline text-[14px]"
                        target="blank"
                        :href="chosenImage.image_url"
                     >
                        {{ chosenImage.image_url }}
                     </a>
                  </li>
                  <li>
                     <span class="font-[500] mr-[10px]">Size:</span>
                     <span class="text-[14px]">
                        {{ formatSize(chosenImage.size) }}
                     </span>
                  </li>
               </ul>
               <Button
                  variant="push"
                  colors="secondary"
                  :loading="isFetching"
                  :onClick="handleDeleteImage"
               >
                  Delete
               </Button>
            </template>
         </div>
      </div>
   </div>
</template>
@/hooks/useUploadImage
