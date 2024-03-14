import { defineStore } from "pinia";

export type Token = "ADMIN" | "USER" | "";

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
      setAuthenticate(payload: StateType["user"]) {
         Object.assign(this, { user: payload });
      },
      setLoading({ loading }: { loading: boolean }) {
         this.loading = this.loading;
      },
   },
});
