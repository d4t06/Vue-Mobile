<script lang="ts" setup>
type Props = {
   zIndex?: string;
   close: () => void;
};
const { zIndex, close } = withDefaults(defineProps<Props>(), { zIndex: "z-[99]" });
</script>
<template>
   <Teleport to="#portal">
      <div :class="`fixed inset-0 bg-black/60 ${zIndex}`" :onClick="close"></div>

      <div
         v-if="$slots['children']"
         :class="`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${zIndex}`"
      >
         <div class="py-[12px] px-[16px] rounded-[8px] bg-white">
            <slot name="children" />
         </div>
      </div>
   </Teleport>
</template>
