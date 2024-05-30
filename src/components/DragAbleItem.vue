<script setup lang="ts">
import useDrag from "@/hooks/useDragItem";

type Props = {
   className?: string;
   index: number;
   handleDragEnd: () => void;
   setIsDrag: (x: boolean) => void;
   isDrag: boolean;
   setEndIndex: (y: number) => void;
};

const { className, handleDragEnd, index, isDrag, setIsDrag, setEndIndex } =
   defineProps<Props>();

const { parentProps } = useDrag({
   setEndIndex,
   handleDragEnd,
   index,
   setIsDrag,
});
</script>

<template>
   <div
      :class="`draggable transition-[padding_margin]`"
      draggable="true"
      v-bind="parentProps"
   >
      <div :class="className">
         <div
            :class="`child-zone`"
            :style="{ pointerEvents: `${isDrag ? 'none' : 'auto'}` }"
         >
            <slot />
         </div>
      </div>
   </div>
</template>
@/hooks/useDragItem