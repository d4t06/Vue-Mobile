<script lang="ts" setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";
import Button from "../ui/Button.vue";

type Props = {
   title: string;
   closeModal: () => void;
};

const props = defineProps<Props>();
</script>

<template>
   <div className="flex justify-between center mb-5 space-x-3">
      <h1 className="text-2xl">{{ props.title }}</h1>
      <Button
         size="clear"
         colors="secondary"
         variant="push"
         class="p-1 flex-shrink-0"
         :onClick="props.closeModal"
      >
         <XMarkIcon class="w-6" />
      </Button>
   </div>
</template>
