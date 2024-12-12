<script setup lang="ts">
import { useDrag } from "@/hooks/useDragItem";

type Props = {
   className?: string;
   index: number;
   handleDragEnd: () => void;
};

const { className, handleDragEnd, index } = defineProps<Props>();

const { parentProps, isDrag } = useDrag({
   handleDragEnd,
   index,
});
</script>

<template>
   <div
      :class="`draggable`"
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
