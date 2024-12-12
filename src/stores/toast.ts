import { nanoid } from "nanoid";
import { defineStore } from "pinia";

type StateType = {
   toasts: Toast[];
};

const initToastStore: StateType = {
   toasts: [],
};

const initToastObject = ({ variant, desc }: Partial<Toast>) => {
   return {
      desc,
      variant,
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
      setSuccessToast(msg?: string) {
         const toast: Toast = initToastObject({
            desc: msg || "Successful",
            variant: "success",
         });
         this.toasts = [...this.toasts, toast];
      },
      setErrorToast(msg?: string) {
         const toast: Toast = initToastObject({
            desc: msg || "Some things went wrong",
            variant: "error",
         });
         this.toasts = [...this.toasts, toast];
      },
   },
});
