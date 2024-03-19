<script lang="ts" setup>
import { useImageStore } from "@/stores/image";
import { storeToRefs } from "pinia";
import { computed, ref, watchEffect } from "vue";
import Button from "./ui/Button.vue";
import GallerySkeleton from "./Skeleton/GallerySkeleton.vue";
import type { ImageType } from "@/types";
import { formatSize } from "@/utils/appHelper";
import { publicRequest } from "@/utils/request";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import GalleryItem from "./GalleryItem.vue";

const IMAGE_URL = "/images";

type Status = "loading" | "error" | "success";
type getImagesRes = {
   page: number;
   images: ImageType[];
   pageSize: number;
   count: number;
};

const status = ref<Status>("loading");
const isFetching = ref(false);
const chosenImage = ref<ImageType>();

const imageStore = useImageStore();
const { count, images, page, pageSize, tempImages } = storeToRefs(imageStore);

const isRemaining = computed(() => count.value - page.value * pageSize.value > 0);
const ableToChosenImage = status.value === "success" && chosenImage.value;

const handleSubmit = async () => {};

const getImages = async (page: number = 1) => {
   try {
      const res = await publicRequest.get(`${IMAGE_URL}?page=${page}`);
      const data = res.data as getImagesRes;

      const newImages = [...images.value, ...data.images];
      imageStore.storeImages({
         count: data.count,
         pageSize: data.pageSize,
         page: data.page,
         images: newImages,
      });
   } catch (error) {
      console.log({ message: error });
   }
};

const handleDeleteImage = async () => {};

watchEffect(
   () => {
      if (!images.value.length) {
         getImages(1);
      }
   },
   {
      flush: "post",
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
                  htmlFor="image_upload"
               >
                  Upload
               </label>
            </Button>
         </div>

         <Button :disabled="!ableToChosenImage" :onClick="handleSubmit" variant="primary">
            Chọn
         </Button>
      </div>
      <div :class="classes.galleryBody">
         <div :class="classes.bodyLeft">
            <div class="flex flex-wrap mt-[-8px]">
               <p v-if="status === 'error'">Some thing went wrong</p>

               <tempImages v-else>
                  <!-- render temporary image -->
                  <GalleryItem v-for="tempImage in tempImages" :imageUrl="tempImage.image_url">
                     <ArrowPathIcon
                        class="animate-spin absolute duration-1000 text-[#000] w-[30px]"
                     />
                  </GalleryItem>
                  <!-- render current images -->
                  <GalleryItem
                     v-for="image in images"
                     :imageUrl="image.image_url"
                     :onClick="() => (chosenImage = image)"
                     :active="chosenImage?.id === image.id"
                  />
                  <!-- <div v-for="image in images" class="px-[4px] relative w-1/6 mt-[8px]">
                     <div class="{classes.imageContainer}">
                        <div
                           :onClick="() => (chosenImage = image)"
                           :class="`${classes.imageFrame}
                        ${chosenImage?.id === image.id ? 'border-[#cd1818]' : '''}`"
                        >
                           <img class="w-full h-auto" :src="image.image_url" alt="img" />
                        </div>
                     </div>
                  </div> -->
               </tempImages>

               <GallerySkeleton v-if="status == 'loading'" />
            </div>

            <div v-if="images.length && isRemaining" class="text-center mt-[14px]">
               <Button :onClick="() => {}" variant="push"> More </Button>
            </div>
         </div>
         <div :class="classes.bodyRight">
            <template v-if="chosenImage">
               <h2 class="break-words">{active.name}</h2>
               <ul>
                  <li>
                     <h4 class="font-semibold">Image path:</h4>

                     <a class="hover:underline" target="blank" href="{active.image_url}">
                        {{ chosenImage.image_url }}
                     </a>
                  </li>
                  <li>
                     <h4 class="font-semibold">Size:</h4>
                     {{ formatSize(chosenImage.size) }}
                  </li>
               </ul>
               <Button variant="push" :loading="isFetching" :onClick="handleDeleteImage">
                  Xóa
               </Button>
            </template>
         </div>
      </div>
   </div>
</template>
