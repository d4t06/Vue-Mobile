<script lang="ts" setup>
import Button from "../ui/Button.vue";
import ModalHeader from "./ModalHeader.vue";

type Props = {
   callback: () => void;
   loading: boolean;
   close: () => void;
   title?: string;
   desc?: string;
};

const { callback, close, desc, title, loading } = defineProps<Props>();
</script>

<template>
   <div
      :class="`w-[400px] max-w-[calc(90vw-40px)] 
      ${loading ? 'opacity-60 pointer-events-none' : ''}`"
   >
      <ModalHeader :close="close" :title="title || 'Wait a minute'" />

      <slot />

      <p class="text-[16px] font-semibold text-red-500">
         {{ desc || "This action can not be undone" }}
      </p>
      <div class="flex gap-[10px] mt-[20px]">
         <Button variant="push" colors="secondary" :onClick="close"> Close </Button>
         <Button
            className="leading-[24px] w-[120px]"
            :loading="loading"
            variant="push"
            :onClick="callback"
         >
            Yes, sure
         </Button>
      </div>
   </div>
</template>
