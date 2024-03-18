import type { ImageSchema, ImageType } from "@/types";
import { defineStore } from "pinia";

type StateType = {
   images: ImageType[];
   tempImages: ImageSchema[];
   page: number;
   count: number;
   pageSize: number;
};

const initImageStore: StateType = {
   count: 0,
   images: [],
   tempImages: [],
   page: 0,
   pageSize: 0,
};

export const useImageStore = defineStore("image", {
   state: () => ({
      ...initImageStore,
   }),
   actions: {
      storeImages(payload: Partial<StateType>) {
         Object.assign(this, payload);
      },
   },
});
