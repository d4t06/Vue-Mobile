<script lang="ts" setup>
import { inputClasses } from "@/utils/appHelper";
import { ref, type InputHTMLAttributes } from "vue";

interface Props {
   className?: string;
   attrs?: Partial<InputHTMLAttributes>;
}

const { className, attrs } = defineProps<Props>();

const inputRef = ref<HTMLInputElement | null>(null);
defineExpose({ inputRef });
</script>

<template>
      <input :class="`${inputClasses.input} ${className} `" v-bind="attrs" ref="inputRef" />
</template>
