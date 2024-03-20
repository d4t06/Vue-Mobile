<script lang="ts" setup>
import { ref, watch, type Prop, computed } from "vue";
import Button from "./ui/Button.vue";
import GallerySkeleton from "./Skeleton/GallerySkeleton.vue";
import type { ImageType } from "@/types";
import { formatSize } from "@/utils/appHelper";

import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import GalleryItem from "./GalleryItem.vue";
import useImageAction from "@/composables/useUploadImage";
import Skeleton from "./Skeleton/Skeleton.vue";

type Props = {
   handleChose: (image_url: string) => void;
   close: () => void;
};

const { close, handleChose } = defineProps<Props>();

const chosenImage = ref<ImageType>();

const { getImages, isRemaining, images, tempImages, status, isFetching, deleteImage } = useImageAction();

const ableToChosenImage = computed(() => status.value === "success" && chosenImage.value);

const handleSubmit = async () => {
   if (!chosenImage.value) return;
   handleChose(chosenImage.value.image_url);
   close();
};

const handleDeleteImage = async () => {
   if (!chosenImage.value) return;
   await deleteImage(chosenImage.value.public_id);
};

watch(
   getImages,
   () => {
      getImages(1);
   },
   {
      immediate: true,
   }
);

const classes = {
   container: "w-[90vw] bg-white h-[80vh] overflow-hidden",
   imageContainer: "relative pt-[100%]",
   imageFrame:
      "absolute flex  w-full items-center justify-center bg-[#f1f1f1] inset-0 rounded-[8px] border-[2px] border-[#ccc] hover:border-[#cd1818] overflow-hidden",
   galleryTop:
      "h-[40px] flex justify-between items-center border-b border-[#ccc] mb-[10px] pb-[10px]",
   galleryBody: "flex mx-[-10px]",
   bodyLeft: "h-[calc(80vh-60px)] w-2/3 no-scrollbar px-[10px] overflow-x-hidden overflow-y-auto",
   bodyRight: "px-[10px] w-1/3 overflow-hidden border-l-[2px] space-y-[14px]",
};
</script>

<template>
   <div :class="classes.container">
      <div :class="classes.galleryTop">
         <div :class="'flex items-center'">
            <h1 class="text-[22px] font-[500]">Gallery</h1>
            <Button class="ml-[10px] !p-0">
               <label
                  :class="`px-[20px] py-[4px] cursor-pointer inline-block ${
                     status === 'loading' ? 'opacity-60 pointer-events-none' : ''
                  }`"
                  htmlFor="image-upload"
               >
                  Upload
               </label>
            </Button>
         </div>

         <Button :disabled="!ableToChosenImage" :onClick="handleSubmit" variant="primary">
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
                     <GalleryItem :imageUrl="tempImage.image_url">
                        <ArrowPathIcon
                           class="animate-spin absolute z-10 duration-1000 text-[#000] w-[30px]"
                        />
                     </GalleryItem>
                  </template>
                  <!-- render current images -->
                  <template v-for="image in images">
                     <GalleryItem
                        :imageUrl="image.image_url"
                        :onClick="() => (chosenImage = image)"
                        :active="chosenImage?.id === image.id"
                     />
                  </template>

                  <template v-if="status == 'loading'">
                     <div v-for="key in [...Array(18).keys()]" class="w-1/6 px-[4px] mt-[8px]">
                        <Skeleton className="pt-[100%]" />
                     </div>
                  </template>
               </div>
            </template>

            <div v-if="images.length && isRemaining" class="text-center mt-[14px]">
               <Button :onClick="() => {}" variant="push"> More </Button>
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
               <Button variant="push" :loading="isFetching" :onClick="handleDeleteImage">
                  Delete
               </Button>
            </template>
         </div>
      </div>
   </div>
</template>
