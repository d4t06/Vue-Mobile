import type { Toast } from "@/types";
import { nanoid } from "nanoid";
import { defineStore } from "pinia";

type StateType = {
   toasts: Toast[];
};

const initToastStore: StateType = {
   toasts: [],
};

const initToastObject = ({ title, desc }: Partial<Toast>) => {
   return {
      desc,
      title,
      id: nanoid(4),
   } as Toast;
};

export const useToastStore = defineStore("toast", {
   state: () => ({
      ...initToastStore,
   }),
   actions: {
      setToasts(toasts: Toast[]) {
         this.toasts = toasts;
      },
      setSuccessToast(msg: string) {
         const toast: Toast = initToastObject({ desc: msg, title: "success" });
         this.toasts = [...this.toasts, toast];
      },
      setErrorToast(msg: string) {
         const toast: Toast = initToastObject({ desc: msg, title: "error" });
         this.toasts = [...this.toasts, toast];
      },
   },
});
