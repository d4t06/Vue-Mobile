import { ref } from "vue";
import usePrivateRequest from "./usePrivateRequest";
import { useAppStore } from "@/stores/app";
import { useToastStore } from "@/stores/toast";

const SLIDER_IMAGE_URL = "/sliders/images";

type Fetching = "add-image" | "delete-image" | "";

type AddSliderImage = {
   type: "add-image";
   sliderImage: SliderImageSchema;
   sliderIndex: number;
   image: ImageType;
};

type EditSliderImage = {
   type: "edit-image";
   sliderImage: SliderImageSchema;
   sliderIndex: number;
   sliderImageID: number;
   image: ImageType;
};

type DeleteSliderImage = {
   type: "delete-image";
   sliderIndex: number;
   sliderImageID: number;
};

type SliderAction = AddSliderImage | DeleteSliderImage | EditSliderImage;

export default function useSliderActions({ close }: { close: () => void }) {
   const isFetching = ref<Fetching>("");

   const appStore = useAppStore();
   const toastStore = useToastStore();
   const privateRequest = usePrivateRequest();

   const sliderActions = async (props: SliderAction) => {
      console.log("slider actions check props", props);
      console.log("slider actions check app", appStore.categories);

      try {
         switch (props.type) {
            case "add-image":
               isFetching.value = "add-image";

               const res = await privateRequest.post(SLIDER_IMAGE_URL, [
                  props.sliderImage,
               ]);
               const newSliderImage = res.data.data as SliderImage;
               newSliderImage.image = props.image;

               appStore.categories[
                  props.sliderIndex
               ].category_slider.slider.slider_images.push(newSliderImage);

               toastStore.setSuccessToast("Add slider images successful");
               break;
            case "edit-image":
               break;
            case "delete-image":
               isFetching.value = "delete-image";

               await privateRequest.delete(`${SLIDER_IMAGE_URL}/${props.sliderImageID}`);

               appStore.categories[
                  props.sliderIndex
               ].category_slider.slider.slider_images.splice(props.sliderIndex, 1);

               toastStore.setSuccessToast("Delete slider images successful");
               break;
         }
      } catch (error) {
         console.log({ message: error });
         toastStore.setErrorToast(`${props.type} slider image fail`);
      } finally {
         isFetching.value = "";
         close();
      }
   };

   return { sliderActions, isFetching };
}
