import { defineStore } from "pinia";

type StateType = {
   user: {
      name: string;
      role: "ADMIN" | "USER" | "";
      token: string;
   } | null;
   loading: boolean;
};

const intiAuthStore: StateType = {
   user: null,
   loading: true,
};

export const useAuthStore = defineStore("auth", {
   state: () => ({
      ...intiAuthStore,
   }),
   actions: {
      setAuthenticate(payload: Partial<StateType>) {
         Object.assign(this, payload);
      },
      setLoading({ loading }: { loading: boolean }) {
         this.loading = this.loading;
      },
   },
});
