import { ref, watch } from "vue";

type Props = {
   sliderImages: SliderImage[];
   autoSlide?: number;
};

export default function useSlider({ sliderImages }: Props) {
   const curIndex = ref(1);
   let sliderWidth = ref(0);
   let maxScroll = ref(0);

   const sliderRef = ref<HTMLDivElement | null>(null);

   // important function
   const checkIsScrollFinish = () => {
      const sliderEle = sliderRef.value;
      if (!sliderEle) return;

      const expectScroll = (curIndex.value - 1) * sliderWidth.value;
      const diff = Math.ceil(sliderEle.scrollLeft) - Math.ceil(expectScroll);

      return !(Math.abs(diff) > 1);
   };

   const next = () => {
      const sliderEle = sliderRef.value;
      if (!sliderEle || !sliderImages.length) return;

      sliderEle.style.scrollBehavior = "smooth";
      const isFinish = checkIsScrollFinish();

      if (isFinish) {
         if (curIndex.value === sliderImages.length) curIndex.value = 1;
         else curIndex.value++;
      }
   };

   const previous = () => {
      const sliderEle = sliderRef.value;
      if (!sliderEle || !sliderImages.length) return;

      sliderEle.style.scrollBehavior = "smooth";
      const isFinish = checkIsScrollFinish();
      if (!isFinish) return;

      if (curIndex.value === 1) curIndex.value = sliderImages.length;
      else curIndex.value--;
   };

   //   initial data
   watch(
      sliderRef,
      () => {
         const sliderEle = sliderRef.value;
         if (!sliderEle || !sliderImages) return;
         const width = Math.ceil(sliderEle.clientWidth);

         sliderWidth.value = width;
         maxScroll.value = width * sliderImages.length;
      },
      {
         immediate: true,
      }
   );

   watch(curIndex, () => {
      const sliderEle = sliderRef.value;
      if (!sliderEle) return;

      const needToScroll = (curIndex.value - 1) * sliderWidth.value;
      sliderEle.scrollLeft = needToScroll;
   });

   return { curIndex, next, previous, sliderRef };
}
