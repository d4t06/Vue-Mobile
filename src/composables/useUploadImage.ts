import { useImageStore } from "@/stores/image";
import type { ImageType } from "@/types";
import { generateId, initImageObject, sleep } from "@/utils/appHelper";
import { storeToRefs } from "pinia";
import usePrivateRequest from "./usePrivateRequest";
import { useToastStore } from "@/stores/toast";
import { computed, ref } from "vue";

const IMAGE_URL = "/images";
type Status = "loading" | "error" | "success" | "uploading";

export default function useImageAction() {
   const imageStore = useImageStore();
   const { tempImages, images, count, page, pageSize, isLast } = storeToRefs(imageStore);
   const toastStore = useToastStore();

   const isFetching = ref(false);
   const status = ref<Status>("loading");

   const privateRequest = usePrivateRequest();

   const isRemaining = computed(() =>
      images.value.length ? count.value - page.value * pageSize.value > 0 : false
   );

   type getImagesRes = {
      page: number;
      images: ImageType[];
      pageSize: number;
      count: number;
      isLast: boolean;
   };

   const getImages = async (page: number = 1) => {
      try {
         if (images.value.length || !!tempImages.value.length) {
            status.value = "success";
            return;
         }

         status.value = "loading";

         const res = await privateRequest.get(`${IMAGE_URL}?page=${page}`);
         const data = res.data.data as getImagesRes;

         const newImages = [...images.value, ...data.images];

         if (import.meta.env.DEV) await sleep(2000);

         imageStore.storeImages({
            count: data.count,
            pageSize: data.pageSize,
            page: data.page,
            images: newImages,
            isLast: data.isLast,
         });

         status.value = "success";
      } catch (error) {
         console.log({ message: error });
         status.value = "error";
      }
   };
   const deleteImage = async (publicID: string) => {
      try {
         isFetching.value = true;
         const controller = new AbortController();

         await privateRequest.delete(`${IMAGE_URL}?publicID=${encodeURIComponent(publicID)}`);

         const newImages = images.value.filter((image) => image.public_id !== publicID);

         images.value = newImages;

         toastStore.setSuccessToast("Delete image successful");

         return () => {
            controller.abort();
         };
      } catch (error) {
         toastStore.setErrorToast("Delete image fail");
         console.log({ message: error });
      } finally {
         isFetching.value = false;
      }
   };

   const inputChangeHandler = async (e: Event) => {
      try {
         status.value = "uploading";

         const inputEle = e.target as HTMLInputElement & { files: FileList };
         const fileLists = inputEle.files;

         // init tempImage
         const processImageList: ImageType[] = [];
         const fileNeedToUploadIndexes: number[] = [];

         const checkDuplicateImage = (ob: ImageType) => {
            return processImageList.some(
               (image) => image.name === ob.name && image.size == ob.size
            );
         };

         let i = 0;
         for (const file of fileLists) {
            const imageObject: ImageType = initImageObject({
               name: generateId(file.name),
               image_url: URL.createObjectURL(file),
               size: file.size,
            });

            if (checkDuplicateImage(imageObject)) {
               URL.revokeObjectURL(imageObject.image_url);

               i++;
               continue;
            }

            processImageList.push(imageObject);
            fileNeedToUploadIndexes.push(i);

            Object.assign(file, {
               for_image_index: processImageList.length - 1,
            });

            i++;
         }

         console.log("handle input change", processImageList);

         // update tempImage
         tempImages.value = processImageList;

         for (const val of fileNeedToUploadIndexes.reverse()) {
            const file = fileLists[val] as File & { for_image_index: number };

            const formData = new FormData();
            formData.append("image", file);

            const controller = new AbortController();

            const res = await privateRequest.post(IMAGE_URL, formData, {
               headers: { "Content-Type": "multipart/form-data" },
               signal: controller.signal,
            });

            const newImage = res.data.data as ImageType;
            tempImages.value.pop();

            const newImages = [newImage, ...images.value];
            images.value = newImages;
         }
         toastStore.setSuccessToast("Upload images successful");
         status.value = "success";
      } catch (error) {
         console.log(error);
         toastStore.setErrorToast("Upload images failed");
         tempImages.value = [];
      }
   };

   return {
      isRemaining,
      isFetching,
      status,
      images,
      page,
      isLast,
      tempImages,
      inputChangeHandler,
      getImages,
      deleteImage,
   };
}
