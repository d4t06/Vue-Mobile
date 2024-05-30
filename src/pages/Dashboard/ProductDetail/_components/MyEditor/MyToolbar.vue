<script setup lang="ts">
import Gallery from "@/components/Gallery.vue";
import { ConfirmModal, Modal } from "@/components/Modal";
import { useToastStore } from "@/stores/toast";
import { privateRequest } from "@/utils/request";
import { ArrowPathIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/vue/24/outline";
import { type Editor } from "@tiptap/vue-3";
import { ref } from "vue";

const MANAGE_DESC_URL = "/product-management/descriptions";

type Modal = "prompt" | "gallery";

type Props = {
   editor: Editor | undefined;
   lock: boolean;
   setLock: (v: boolean) => void;
   setIsChange: (v: boolean) => void;
   isChange: boolean;
   productAscii: string;
};

const { editor, lock, isChange, setLock, productAscii, setIsChange } =
   defineProps<Props>();

const toastStore = useToastStore();

const openModal = ref<Modal | "">("");
const closeModal = () => (openModal.value = "");
const isFetching = ref<"toolbar" | "modal" | "">("");

const handleToggleLock = (v: boolean, isChange: boolean) => {
   console.log(editor);
   if (!editor) return;

   const newLock = !v;
   setLock(newLock);
   editor.setEditable(!newLock);

   const dashContent = document.querySelector(".dash-content") as HTMLDivElement;
   if (dashContent) {
      if (!newLock) {
         dashContent.style.overflow = "hidden";
      } else dashContent.style.overflow = "auto";
   }

   if (isChange && newLock === true) openModal.value = "prompt";
};

const handleAddImages = (imageList: ImageType[]) => {
   if (!editor) return;
   if (!imageList.length) return;

   imageList.forEach((image) =>
      editor.chain().focus().setImage({ src: image.image_url }).run()
   );
   setIsChange(true);
};

const handleSubmit = async (variant: "toolbar" | "modal") => {
   try {
      if (!editor) return;
      isFetching.value = variant;

      const descSchema: ProductDescriptionSchema = {
         content: editor.getHTML(),
         product_ascii: productAscii,
      };

      await privateRequest.put(MANAGE_DESC_URL, descSchema);
      setIsChange(false);
   } catch (error) {
      console.log({ message: error });
      toastStore.setErrorToast("");
   } finally {
      isFetching.value = "";
      toastStore.setSuccessToast("Edit description successful");
      closeModal();
   }
};
</script>
<template>
   <template v-if="editor">
      <div
         class="flex justify-between w-full bg-[#cd1818] h-[50px] px-[10px] text-white item-center"
      >
         <div class="space-x-[10px] flex items-center">
            <button
               :onClick="() => editor!.chain().focus().toggleBold().run()"
               :disable="!editor.can().chain().focus().toggleBold().run()"
               :className="editor.isActive('bold') ? 'active' : ''"
            >
               bold
            </button>

            <button
               :onClick="() => editor!.chain().focus().toggleItalic().run()"
               :disable="!editor.can().chain().focus().toggleItalic().run()"
               :className="editor.isActive('italic') ? 'active' : ''"
            >
               italic
            </button>

            <button
               :onClick="() => editor!.chain().focus().setParagraph().run()"
               :className="editor.isActive('paragraph') ? 'active' : ''"
            >
               paragraph
            </button>

            <button
               :onClick="() => editor!.chain().focus().toggleHeading({ level: 5 }).run()"
               :className="editor.isActive('heading', { level: 5 }) ? 'active' : ''"
            >
               h5
            </button>

            <button
               :onClick="() => editor!.chain().focus().toggleBlockquote().run()"
               :className="editor.isActive('blockquote') ? 'active' : ''"
            >
               blockquote
            </button>

            <button
               :onClick="() => (openModal = 'gallery')"
               :className="editor.isActive('blockquote') ? 'active' : ''"
            >
               image
            </button>

            <button
               :onClick="() => editor!.chain().focus().undo().run()"
               :disable="!editor.can().chain().focus().undo().run()"
            >
               undo
            </button>

            <button
               :onClick="() => editor!.chain().focus().redo().run()"
               :disable="!editor.can().chain().focus().redo().run()"
            >
               redo
            </button>

            <button
               :onClick="() => {}"
               :disable="!editor.can().chain().focus().redo().run()"
            >
               reset
            </button>
         </div>

         <div class="flex items-center space-x-[10px]">
            <button :onClick="() => handleSubmit('toolbar')" :disable="!isChange">
               <ArrowPathIcon v-if="isFetching === 'toolbar'" class="w-[22px]" />
               <span v-else> save </span>
            </button>
            <button :onClick="() => handleToggleLock(lock, isChange)">
               <LockClosedIcon v-if="lock" class="w-[22px]" />
               <LockOpenIcon v-else class="w-[22px]" />
            </button>
         </div>
      </div>

      <Modal v-if="openModal" :close="closeModal">
         <template v-slot:children>
            <Gallery
               v-if="openModal === 'gallery'"
               variant="multiple"
               :close="closeModal"
               :handleChose="(images) => handleAddImages(images)"
            />

            <ConfirmModal
               v-if="openModal === 'prompt'"
               :close="closeModal"
               :callback="() => handleSubmit('modal')"
               title="'Do you want to save changes'"
               desc="Your change will no lost"
               :loading="isFetching === 'modal'"
            />
         </template>
      </Modal>
   </template>
</template>
