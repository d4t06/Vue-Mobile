<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import MyToolbar from "./MyToolbar.vue";
import { ref } from "vue";

type Props = {
   content: string;
   productId: number;
   classNames?: string;
};

const { content, classNames, productId } = defineProps<Props>();
const isChange = ref(false);
const lock = ref(true);

const setLock = (value: boolean) => (lock.value = value);
const setIsChange = (value: boolean) => (isChange.value = value);

const editor = useEditor({
   content,
   editable: false,
   extensions: [StarterKit, Image],
   // onUpdate: () => (isChange.value = true),
   editorProps: {
      handleDOMEvents: {
         keypress: () => {
            isChange.value = true;
         },
      },
   },
});

const classes = {
   wrapper: "my-editor border border-black/10 bg-white rounded-[12px] overflow-hidden",
   controlContainer:
      "bg-[#cd1818] text-white flex gap-[12px] items-center h-[50px] px-[10px]",
   editContainer: "max-h-[70vh] overflow-auto editor-container",
};
</script>

<template>
   <div :class="classes.wrapper">
      <MyToolbar
         v-if="editor"
         :lock="lock"
         :isChange="isChange"
         :setIsChange="setIsChange"
         :setLock="setLock"
         :editor="editor"
         :productId="productId"
      />
      <div :class="`${classes.editContainer} ${classNames}`">
         <EditorContent :editor="editor" />
      </div>
   </div>
</template>
<style lang="scss">
@import url("./MyEditor.module.scss");
</style>
