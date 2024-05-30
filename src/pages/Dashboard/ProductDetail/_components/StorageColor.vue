<script setup lang="ts">
import { Modal } from "@/components/Modal";
import AddItem from "@/components/Modal/AddItem.vue";
import { useProductDetailStore } from "@/stores/productDetail";
import { storeToRefs } from "pinia";
import { inject, ref } from "vue";
import StorageItem from "./child/StorageItem.vue";
import ColorItem from "./child/ColorItem.vue";
import useStorageActions from "@/hooks/useStorageActions";
import useColorActions from "@/hooks/useColorActions";
import { Box } from "@/components/ui";

type Modal = "add-storage" | "add-color";

const classes = inject("classes") as Record<string, string>;

const p = useProductDetailStore();
const { productDetail } = storeToRefs(p);

const openModal = ref<Modal | "">("");

const closeModal = () => (openModal.value = "");
const { isFetching: storageFetching, storageActions } = useStorageActions({ closeModal });
const { isFetching: colorFetching, colorActions } = useColorActions({ closeModal });

// hooks

type AddStorage = {
   variant: "add-storage";
   value: string;
};

const handleAddStorage = async (props: AddStorage) => {
   await storageActions({ variant: "add", value: props.value });
};

type AddColor = {
   variant: "add-color";
   value: string;
};

const handleAddColor = async (props: AddColor) => {
   await colorActions({ variant: "add", value: props.value });
};
</script>
<template>
   <div v-if="productDetail" :class="classes.flexContainer">
      <div :class="`${classes.flexCol} w-[50%] `">
         <h5 :class="classes.label">Storage</h5>
         <div :class="`${classes.group}`">
            <div :class="`${classes.flexContainer} mt-[-16px]`">
               <div
                  v-for="(storage, index) in productDetail.storages"
                  :class="`${classes.flexCol} w-1/3 `"
               >
                  <StorageItem :storage="storage" :index="index" />
               </div>
               <div :class="`${classes.flexCol} w-1/3 `">
                  <Box :onClick="() => (openModal = 'add-storage')" />
               </div>
            </div>
         </div>
      </div>
      <div :class="`${classes.flexCol} w-[50%]`">
         <h5 :class="classes.label">Color</h5>
         <div :class="`${classes.group}`">
            <div :class="`${classes.flexContainer} mt-[-16px]`">
               <div
                  v-for="(color, index) in productDetail.colors"
                  :class="`${classes.flexCol} w-1/3 `"
               >
                  <ColorItem :color="color" :index="index" />
               </div>
               <div :class="`${classes.flexCol} w-1/3 `">
                  <Box :onClick="() => (openModal = 'add-color')" />
               </div>
            </div>
         </div>
      </div>
   </div>

   <Modal v-if="!!openModal" :close="closeModal">
      <template v-if="productDetail" v-slot:children>
         <AddItem
            v-if="openModal === 'add-storage'"
            :close="closeModal"
            :submit="(value) => handleAddStorage({ variant: 'add-storage', value })"
            :loading="storageFetching"
            title="Add Storage"
         />

         <AddItem
            v-if="openModal === 'add-color'"
            :close="closeModal"
            :submit="(value) => handleAddColor({ variant: 'add-color', value })"
            :loading="colorFetching"
            title="Add color"
         />
      </template>
   </Modal>
</template>
@/hooks/useStorageActions@/hooks/useColorActions