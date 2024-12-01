import { ref, watch, watchEffect } from "vue";

type Props = {
   sliderImages: SliderImage[];
   autoSlide?: number;
   quantity: number;
};

const SLIDER_BREAK_POINT = 768;

export default function useSlider({ sliderImages, quantity }: Props) {
   const curIndex = ref(1);
   const sliderRef = ref<HTMLDivElement | null>(null);
   const isEnter = ref(false);

   let isDrag = false;

   let prevPageX = 0;
   let scroll = 0;
   let prevScroll = 0;

   const LAST_INDEX =
      window.innerWidth >= SLIDER_BREAK_POINT
         ? sliderImages.length - (quantity - 1)
         : sliderImages.length;

   const getSliderWidth = () => {
      const sliderEle = sliderRef.value;
      if (!sliderEle) return 0;

      return Math.ceil(
         window.innerWidth >= SLIDER_BREAK_POINT
            ? sliderEle.clientWidth / quantity
            : sliderEle.clientWidth
      );
   };

   // important function
   const checkIsScrollFinish = () => {
      const sliderEle = sliderRef.value;
      if (!sliderEle) return;

      const width = getSliderWidth();

      const expectScroll = (curIndex.value - 1) * width;
      console.log(expectScroll, curIndex.value);

      const diff = Math.ceil(sliderEle.scrollLeft) - Math.ceil(expectScroll);

      return !(Math.abs(diff) > 2);
   };

   const startDrag = (pageX: number) => {
      if (pageX === undefined) return console.log("pageX is undefined");
      const isFinish = checkIsScrollFinish();
      if (!isFinish) return;

      isDrag = true;
      prevPageX = pageX;

      const sliderEle = sliderRef.value;
      if (!sliderEle) return;

      sliderEle.style.scrollBehavior = "auto";
   };

   const handleTouchStart = (e: TouchEvent) => {
      const pageX = e.changedTouches[0].pageX;
      if (!sliderImages.length || sliderImages.length === 1) return;
      startDrag(pageX);
   };

   const handleStartDrag = (e: MouseEvent) => {
      e.preventDefault();

      if (sliderImages.length <= 1) return;
      startDrag(e.pageX);
   };

   const getNewIndex = () => {
      let newIndex = curIndex.value;
      if (!sliderRef.value) return newIndex;

      const distance = scroll - prevScroll;
      const minimum = sliderRef.value.clientWidth / 4;

      if (distance > 0) {
         if (newIndex === LAST_INDEX) newIndex -= 1;
         else if (Math.abs(distance) > minimum) newIndex += 1;
      } else if (distance < 0) {
         if (newIndex === 1) newIndex += 1;
         else if (Math.abs(distance) > minimum) newIndex -= 1;
      }

      return newIndex;
   };

   const handleMouseEnter = () => {
      isEnter.value = true;
   };

   const handleMouseLeave = () => {
      isEnter.value = false;
      if (isDrag) handleStopDrag();
   };

   const drag = (pageX: number) => {
      if (!sliderRef.value) return;

      const sliderWidth = getSliderWidth();

      const distance = pageX - prevPageX;
      const newScrollLeft = prevScroll - distance;

      const isValid =
         newScrollLeft > 0 && newScrollLeft < sliderWidth * LAST_INDEX;

      if (isValid) {
         const sliderEle = sliderRef.value;
         if (!sliderEle) return;

         sliderEle.scrollLeft = newScrollLeft;
      }
      scroll = newScrollLeft;
   };

   const handleDrag = (e: MouseEvent) => {
      if (!isDrag) return;

      drag(e.pageX);
   };

   const handleTouchMove = (e: TouchEvent) => {
      if (!isDrag) return;

      const pageX = e.changedTouches[0].pageX;

      drag(pageX);
   };

   const stopDrag = () => {
      if (!sliderRef.value) return;

      const sliderWidth = getSliderWidth();

      if (scroll === prevScroll) return;
      if (scroll === 0 || scroll === sliderWidth * LAST_INDEX) return;

      const sliderEle = sliderRef.value;
      if (!sliderEle) return;

      sliderEle.style.scrollBehavior = "smooth";

      const newIndex = getNewIndex();

      if (newIndex === curIndex.value) {
         sliderEle.scrollLeft = prevScroll;
      } else {
         curIndex.value = newIndex;
      }
      scroll = 0;
   };

   const handleStopDrag = () => {
      if (!isDrag) return;

      isDrag = false;

      stopDrag();
   };

   const next = () => {
      const sliderEle = sliderRef.value;
      if (!sliderEle || !sliderImages.length) return;

      sliderEle.style.scrollBehavior = "smooth";
      const isFinish = checkIsScrollFinish();

      if (isFinish) {
         if (curIndex.value === LAST_INDEX) curIndex.value = 1;
         else curIndex.value++;
      }
   };

   const previous = () => {
      const sliderEle = sliderRef.value;
      if (!sliderEle || !sliderImages.length) return;

      sliderEle.style.scrollBehavior = "smooth";
      const isFinish = checkIsScrollFinish();
      if (!isFinish) return;

      if (curIndex.value === 1) curIndex.value = LAST_INDEX;
      else curIndex.value--;
   };

   watch(curIndex, () => {
      const sliderEle = sliderRef.value;
      if (!sliderEle) return;

      const width = getSliderWidth();

      const needToScroll = (curIndex.value - 1) * width;
      sliderEle.scrollLeft = needToScroll;
      prevScroll = needToScroll;
   });

   const attributeObj: Record<any, (e: any) => void> = {
      onMouseDown: (e) => handleStartDrag(e),
      onTouchStart: (e) => handleTouchStart(e),

      onMouseMove: (e) => handleDrag(e),
      onTouchMove: (e) => handleTouchMove(e),

      onMouseUp: () => handleStopDrag(),
      onTouchEnd: () => handleStopDrag(),

      onMouseEnter: () => (isEnter.value = true),
      onMouseLeave: () => handleMouseLeave(),
   };

   watchEffect(
      (onCleanUp) => {
         const sliderEle = sliderRef.value;
         if (!sliderEle) return;

         sliderEle.addEventListener("mousedown", handleStartDrag);
         sliderEle.addEventListener("touchstart", handleTouchStart);

         sliderEle.addEventListener("mousemove", handleDrag);
         sliderEle.addEventListener("touchmove", handleTouchMove);

         sliderEle.addEventListener("mouseup", handleStopDrag);
         sliderEle.addEventListener("touchend", handleStopDrag);

         sliderEle.addEventListener("mouseenter", handleMouseEnter);
         sliderEle.addEventListener("mouseleave", handleMouseLeave);

         onCleanUp(() => {
            sliderEle.removeEventListener("mousedown", handleStartDrag);
            sliderEle.removeEventListener("touchstart", handleTouchStart);

            sliderEle.removeEventListener("mousemove", handleDrag);
            sliderEle.removeEventListener("touchmove", handleTouchMove);

            sliderEle.removeEventListener("mouseup", handleStopDrag);
            sliderEle.removeEventListener("touchend", handleStopDrag);

            sliderEle.removeEventListener("mouseenter", handleMouseEnter);
            sliderEle.removeEventListener("mouseleave", handleMouseLeave);
         });
      },
      {
         flush: "post",
      }
   );

   return { curIndex, next, previous, sliderRef, attributeObj };
}
