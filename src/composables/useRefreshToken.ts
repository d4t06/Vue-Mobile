import { useAuthStore, type AuthResponse } from "@/stores/auth";
import { privateRequest, publicRequest } from "@/utils/request";

const REFRESH_URL = "/auth/refresh";

export default function useRefreshToken() {
   const authStore = useAuthStore();

   const refresh = async () => {
      console.log("run refresh");

      try {
         if (authStore.user) return;

         const res = await privateRequest.get(REFRESH_URL);

         const { token, userInfo } = res.data.data as AuthResponse;

         authStore.setAuthenticate({
            user: {
               ...userInfo,
               token,
            },
            loading: false,
         });

         return token;
      } catch (error) {
         authStore.setAuthenticate({ loading: false });
         console.log({ message: error });
      }
   };

   return refresh;
}
