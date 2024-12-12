<script lang="ts" setup>
import { CheckIcon } from "@heroicons/vue/16/solid";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { ref, watchEffect } from "vue";

const isOpen = ref(false);

type Props = {
   toast: Toast;
   onClick: (id: string) => void;
};

const { toast, onClick } = defineProps<Props>();

const getColor = () => {
   switch (toast.variant) {
      case "error":
         return "text-red-500";
      case "success":
         return "text-green-500";
   }
};

const classes = {
   icon: `w-6`,
   container: `bg-white transition-[transform,opacity] border-[1px] shadow-lg rounded-md overflow-hidden min-w-[150px] max-w-[250px]`,
   text: `text-sm p-2`,
   open: "opacity-[1] translate-x-0",
   close: "opacity-0 translate-x-10",
   header: "border-b-[1px] bg-gray-100 px-2 py-1 flex space-x-1",
};

watchEffect(() => {
   setTimeout(() => {
      isOpen.value = true;
   }, 100);
});
</script>

<template>
   <div
      :onClick="() => onClick(toast.id)"
      :class="`${classes.container} ${isOpen ? classes.open : classes.close} `"
   >
      <div :class="`${classes.header} ${getColor()}`">
         <CheckIcon v-if="toast.variant === 'success'" :class="classes.icon" />
         <XMarkIcon v-if="toast.variant === 'error'" :class="classes.icon" />

         <span>{{ toast.variant.toUpperCase() }}</span>
      </div>

      <p :class="classes.text">{{ toast.desc }}</p>
   </div>
</template>
