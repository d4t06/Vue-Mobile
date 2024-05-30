<script lang="ts" setup>
import { ref, watch } from "vue";
import ModalHeader from "./ModalHeader.vue";
import { Button } from "../ui";
import { inputClasses } from "@/utils/appHelper";

type Props = {
   close: () => void;
   submit: (value: string) => void;
   title: string;
   initValue?: string;
   loading?: boolean;
};

const { submit, close, initValue, loading, title } = defineProps<Props>();

const value = ref(initValue ?? "");
const childRef = ref<{ inputRef: HTMLInputElement } | null>(null);

const handleSubmit = () => {
   submit(value.value);
};

watch(childRef, () => childRef.value?.inputRef.focus(), { once: true });
</script>

<template>
   <div class="w-[400px] max-w-[80vw] bg-[#fff]">
      <ModalHeader :close="close" :title="title" />
      <form @submit.prevent="handleSubmit">
         <textarea
            :class="inputClasses.input"
            :onChange="(e) => value = (e.target as HTMLInputElement).value"
            :value="value"
         />
         <p class="text-right mt-[20px]">
            <Button className="leading-[24px]" :loading="loading" variant="push" type="submit">
               Save
            </Button>
         </p>
      </form>
   </div>
</template>
