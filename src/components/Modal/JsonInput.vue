<script setup lang="ts">
import { ref, watch } from "vue";
import { Button } from "../ui";

type Props = {
   status: "input" | "error" | "fetching" | "successful" | "finish";
   closeModal: () => void;
   submit: (v: string) => void;
   title?: string;
};
const props = defineProps<Props>();

const parsedData = ref("");
const textRef = ref("");

watch(
   [textRef],
   () => {
      try {
         const json = JSON.parse(textRef.value);

         parsedData.value = json;
      } catch (error) {
         parsedData.value = "";
      }
   },
   {}
);

const classes = {
   input: `p-2 text-[#333] rounded-md outline-none bg-black/15  w-full min-h-[150px]`,
};
</script>

<template>
   <div class="w-[500px] max-w-[90vw]">
      <h1 class="text-xl mb-5">{{ props.title || "Import" }}</h1>

      <textarea
         :class="classes.input"
         v-if="props.status === 'input'"
         v-model="textRef"
         placeholder="[ { } ]"
      />

      <p v-if="props.status === 'finish'">Import successful</p>
      <p v-if="props.status === 'error'">Something went wrong</p>

      <p class="mt-3">
         <Button
            v-if="props.status === 'input'"
            :disabled="!parsedData || !textRef"
            variant="push"
            :onClick="() => props.submit(textRef)"
         >
            Ok
         </Button>
         <Button
            v-if="props.status === 'finish' || props.status === 'error'"
            :onClick="props.closeModal"
            variant="push"
         >
            Close
         </Button>
      </p>
   </div>
</template>
