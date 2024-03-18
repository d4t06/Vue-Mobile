<script lang="ts" setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";

type Props = {
   title: string;
   close: () => void;
};

const { close, title } = defineProps<Props>();
</script>

<template>
   <div className="flex justify-between mb-[15px]">
      <h1 className="text-[26px] text-[#333] font-[500] mr-[10px] line-clamp-1">{{ title }}</h1>
      <button :onClick="close">
         <XMarkIcon className="w-[30px]" />
      </button>
   </div>
</template>
