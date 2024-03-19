<script lang="ts" setup>
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";
import ToastItem from "./ToastItem.vue";
import { ref, watch } from "vue";

type Props = {
   time?: number;
};

const { time } = withDefaults(defineProps<Props>(), {
   time: 4000,
});

const removing = ref<string | undefined>();

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);

const removeToast = (id: string) => {
   toastStore.setToasts(toasts.value.filter((toast) => toast.id != id));
};

watch([removing], () => {
   if (removing.value) {
      removeToast(removing.value);
   }
});

watch(
   [toasts],
   () => {
      // if no toast remain, reset removing and stop
      if (!toasts.value.length) {
         removing.value = "";
         return;
      }

      const id = toasts.value[toasts.value.length - 1].id;
      setTimeout(() => {
         console.log("run time out check id ", id);
         removing.value = id;
      }, time);
   },
   {
      immediate: true,
   }
);

const classes = {
   wrapper: "fixed bottom-[30px] right-[30px]",
   container: "flex space-y-[10px] flex-col items-end",
};
</script>

<template>
   <Teleport to="#portal">
      <div :class="classes.wrapper">
         <div :class="classes.container">
            <ToastItem v-for="toast in toasts" :onClick="removeToast" :toast="toast" />
         </div>
      </div>
   </Teleport>
</template>
