<script lang="ts" setup>
import { inputClasses } from "@/utils/appHelper";
import { ref, type InputHTMLAttributes } from "vue";

interface Props {
   className?: string;
   attrs?: Partial<InputHTMLAttributes>;
}

const model = defineModel()

const { className, attrs } = withDefaults(defineProps<Props>(), { className: "" });

const inputRef = ref<HTMLInputElement | null>(null);
defineExpose({ inputRef });
</script>

<template>
   <input v-model="model" :class="`${inputClasses.input} ${className} `" v-bind="attrs" ref="inputRef" />
</template>
