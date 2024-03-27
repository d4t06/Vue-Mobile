import { defineStore } from "pinia";

export type Column = "price" | "seller";

export type SortStoreType = {
   column: Column | null;
   type: "desc" | "asc" | null;
   enable: boolean;
   nameAscii: string | null;
};

const initialState: SortStoreType = {
   column: null,
   type: null,
   enable: false,
   nameAscii: null,
};

export const useSortStore = defineStore("sortStore", {
   state: () => initialState,
});
