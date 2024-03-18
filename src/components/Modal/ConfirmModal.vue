<script lang="ts" setup>
import Button from "../ui/Button.vue";

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
      <h2 class="text-[22px] font-[500]">{{ title || "Wait a minute" }}</h2>
      <p class="text-[16px] font-semibold text-red-500">{{ desc }}</p>
      <div class="flex gap-[10px] mt-[20px]">
         <Button variant="primary" class="bg-gray-500 text-[#333]" :onClick="close"> Close </Button>
         <Button className="leading-[24px]" :loading="loading" variant="primary" :onClick="callback"> "Yes please" </Button>
      </div>
   </div>
</template>
