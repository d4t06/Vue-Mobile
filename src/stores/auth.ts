import { defineStore } from "pinia";

export type Role = "ADMIN" | "USER" | "";

export type AuthResponse = {
   token: string;
   userInfo: {
      username: string;
      role: Role;
   };
};

type StateType = {
   user: {
      username: string;
      role: Role;
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
