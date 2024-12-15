<script lang="ts" setup>
import Button from "../ui/Button.vue";
import ModalHeader from "./ModalHeader.vue";

type Props = {
   callback: () => void;
   loading: boolean;
   closeModal: () => void;
   title?: string;
   desc?: string;
};

const { callback, closeModal, desc, title, loading } = defineProps<Props>();
</script>

<template>
   <div
      :class="`w-[400px] max-w-[85vw] 
      ${loading ? 'opacity-60 pointer-events-none' : ''}`"
   >
      <ModalHeader :closeModal="closeModal" :title="title || 'Wait a minute'" />

      <slot />

      <p class="text-[16px] font-semibold text-red-500">
         {{ desc || "This action can not be undone" }}
      </p>
      <div class="flex gap-[10px] mt-[20px]">
         <Button variant="push" colors="secondary" :onClick="closeModal"> Close </Button>
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
