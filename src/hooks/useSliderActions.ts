import { ref } from "vue";
import usePrivateRequest from "./usePrivateRequest";
import { useAppStore } from "@/stores/app";
import { useToastStore } from "@/stores/toast";
import { sleep } from "@/utils/appHelper";

const SLIDER_IMAGE_URL = "/sliders/images";

type Add = {
   type: "add";
   sliderId: number;
   categoryIndex: number;
   images: ImageType[];
};

type Edit = {
   type: "edit";
   categoryIndex: number;
   sliderImage: SliderImageSchema;
   id: number;
   image: ImageType;
   index: number;
};

type Delete = {
   type: "delete";
   index: number;
   sliderImageId: number;
   categoryIndex: number;
};

type SliderAction = Add | Delete | Edit;

export default function useSliderActions() {
   const isFetching = ref(false);

   const appStore = useAppStore();
   const toastStore = useToastStore();
   const privateRequest = usePrivateRequest();

   const actions = async (props: SliderAction) => {
      try {
         isFetching.value = true;
         if (import.meta.env.DEV) await sleep(500);

         switch (props.type) {
            case "add":
               const { images, sliderId, categoryIndex } = props;

               const schemas = images.map(
                  (image) =>
                     ({
                        image_id: image.id,
                        slider_id: sliderId,
                        link_to: "",
                     } as SliderImageSchema)
               );

               const res = await privateRequest.post(SLIDER_IMAGE_URL, schemas);

               const data = res.data.data as SliderImage[];

               const newSliderImages = data.map(
                  (sI, index) => ({ ...sI, image: images[index] } as SliderImage)
               );

               appStore.categories[
                  categoryIndex
               ].category_slider.slider.slider_images.push(...newSliderImages);

               toastStore.setSuccessToast("Add slider images successful");
               break;

            case "edit": {
               const { index, id, categoryIndex, sliderImage, image } = props;

               await privateRequest.put(`${SLIDER_IMAGE_URL}/${id}`, sliderImage);

               Object.assign(
                  appStore.categories[categoryIndex].category_slider.slider.slider_images[
                     index
                  ],
                  { image, image_id: image.id } as Partial<SliderImage>
               );

               toastStore.setSuccessToast("Edit slider image successful");
               break;
            }
            case "delete": {
               const { index, sliderImageId, categoryIndex } = props;

               await privateRequest.delete(`${SLIDER_IMAGE_URL}/${sliderImageId}`);

               appStore.categories[
                  categoryIndex
               ].category_slider.slider.slider_images.splice(index, 1);

               toastStore.setSuccessToast("Delete slider image successful");
               break;
            }
         }
      } catch (error) {
         console.log({ message: error });
         toastStore.setErrorToast(`${props.type} slider image fail`);
      } finally {
         isFetching.value = false;
      }
   };

   return { actions, isFetching };
}
