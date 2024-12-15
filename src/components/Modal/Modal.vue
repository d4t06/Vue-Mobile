<script lang="ts" setup>
import { ref, watch } from "vue";

type Props = {
   zIndex?: string;
   className?: string;
   onClose?: () => void;
};

export type ModalRef = {
   open: () => void;
   close: () => void;
};

const props = withDefaults(defineProps<Props>(), {
   zIndex: "z-[99]",
   className: "py-3 px-5 rounded-lg bg-white",
});

const isOpen = ref(false);
const isMounted = ref(false);

const open = () => (isOpen.value = true);
const close = () => (isMounted.value = false);

defineExpose<ModalRef>({ open, close });

watch(
   [isMounted],
   () => {
      if (!isMounted.value) {
         setTimeout(() => {
            isOpen.value = false;

            props.onClose ? props.onClose() : "";
         }, 400);
      }
   },
   {},
);
watch(
   [isOpen],
   () => {
      if (isOpen.value) {
         setTimeout(() => {
            isMounted.value = true;
         }, 100);
      }
   },
   {},
);

const classes = {
   unMountedContent: "opacity-0 scale-[.95]",
   mountedContent: "opacity-100 scale-[1]",
   unMountedLayer: "opacity-0",
   mountedLayer: "opacity-60",
};
</script>
<template>
   <Teleport v-if="isOpen" to="#portal">
      <div :class="`fixed inset-full ${props.zIndex || 'z-[99]'} `">
         <div
            :class="`transition-opacity duration-300 absolute inset-full bg-black/40 
                             ${isMounted ? classes.mountedLayer : classes.unMountedLayer}
                        `"
            :onClick="close"
         ></div>

         <div
            v-if="$slots['children']"
            :class="`absolute ${
               props.zIndex || 'z-[99]'
            }  duration-300 transition-[transform,opacity] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            ${
                               isMounted
                                  ? classes.mountedContent
                                  : classes.unMountedContent
                            }
                        `"
         >
            <div :class="props.className">
               <slot name="children" />
            </div>
         </div>
      </div>
   </Teleport>
</template>
