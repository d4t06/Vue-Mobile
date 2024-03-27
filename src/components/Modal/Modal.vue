<script lang="ts" setup>
type Props = {
   className?: string;
   close: () => void;
};
const { className, close } = withDefaults(defineProps<Props>(), { className: "" });
</script>
<template>
   <Teleport to="#portal">
      <div :class="`fixed inset-0 z-[99] bg-black/60 ${className}`" :onClick="close"></div>

      <div
         v-if="$slots"
         class="fixed z-[100] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      >
         <div class="py-[12px] px-[16px] rounded-[8px] bg-white"><slot /></div>
      </div>
   </Teleport>
</template>
