
import { defineStore } from "pinia";

type AppState = {
   categories: Category[];
   status: "loading" | "successful" | "error";
};

const initialAppState: AppState = {
   categories: [],
   status: "loading",
};

export const useAppStore = defineStore("app", {
   state: () => ({
      ...initialAppState,
   }),
   actions: {
      storingCategory(payload: Partial<AppState>) {
         this.status = payload.status || this.status;
         this.categories = payload.categories || [];
      },
   },
});
