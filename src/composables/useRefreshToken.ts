import { useAuthStore, type AuthResponse } from "@/stores/auth";
import { privateRequest } from "@/utils/request";

const REFRESH_URL = "/auth/refresh";

export default function useRefreshToken() {
   const authStore = useAuthStore();

   const refresh = async () => {
      try {
         /**
          * Must to delete header.authorization in spring boot
          * for skip jwt authentication
          */
         const res = await privateRequest.get(REFRESH_URL, {
            transformRequest: (data, headers) => {
               delete headers.Authorization;
               return data;
            },
         });

         const { token, userInfo } = res.data.data as AuthResponse;

         authStore.setAuthenticate({
            user: {
               ...userInfo,
               token,
            },
         });

         return token;
      } catch (error) {
         console.log({ message: error });
      }
   };

   return refresh;
}
