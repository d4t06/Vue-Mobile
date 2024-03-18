<script lang="ts" setup>
import type { Toast } from "@/types";
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline";


type Props = {
   toast: Toast;
   onClick: (id: string) => void;
};

const { toast, onClick } = defineProps<Props>();

const classes = {
   container: "flex items-center font-[500] px-[12px] py-[6px] rounded-[8px]",
};
</script>

<template>
   <div
      :onClick="() => onClick(toast.id)"
      :class="`${classes.container} ${toast.title === 'error' && 'bg-red-500 text-white'} ${
         toast.title === 'success' && 'bg-emerald-500 text-white'
      } `"
   >
      <CheckIcon v-if="toast.title === 'success'" class="w-[24px]" />
      <XMarkIcon v-if="toast.title === 'error'" class="w-[24px]" />

      <p class="text-[16px] ml-[8px]">{{ toast.desc }}</p>
   </div>
</template>
