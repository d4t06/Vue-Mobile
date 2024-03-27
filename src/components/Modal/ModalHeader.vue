<script lang="ts" setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";
import Button from "../ui/Button.vue";

type Props = {
   title: string;
   close: () => void;
};

const { close, title } = defineProps<Props>();
</script>

<template>
   <div className="flex justify-between items-start mb-[20px]">
      <h2 className="text-[20px] text-[#333] font-[500] mr-[30px]">{{ title }}</h2>
      <Button size="clear" colors="secondary" variant="push" class="p-[4px]" :onClick="close">
         <XMarkIcon class="w-[20px]" />
      </Button>
   </div>
</template>
