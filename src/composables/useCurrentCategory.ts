import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

export default function useCurrentCategory() {
   const route = useRoute();
   const appStore = useAppStore();

   const { status } = storeToRefs(appStore);

   const getCurCategory = () => {
      if (appStore.status !== "successful") return undefined;

      const categoryAscii = route.params.categoryAscii;
      if (!categoryAscii) return undefined;

      return appStore.categories.find((c) => c.category_ascii === categoryAscii);
   };

   const getBrandsByCategory = () => {
      const curCategory = getCurCategory();
      if (!curCategory) return [];
      return curCategory.brands;
   };

   const getHomeSliderImages = () => {

      console.log('check categries',appStore.categories);
      
      return (
         appStore.categories.find((c) => c.category_ascii === "home")?.category_slider.slider
            .slider_images || []
      );
   };

   return {
      status: status,
      getCurCategory,
      getBrandsByCategory,
      getHomeSliderImages,
   };
}
