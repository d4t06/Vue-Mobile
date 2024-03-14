import { useAuthStore, type Token } from "@/stores/auth";
import { publicRequest } from "@/utils/request";

const REFRESH_URL = "/auth/refresh";

export default function useRefreshToken() {
   const authStore = useAuthStore();

   const refresh = async () => {
      try {
         const res = await publicRequest.get(REFRESH_URL);

         const { token, userInfo } = res.data.data as {
            token: string;
            userInfo: {
               username: string;
               role: Token;
            };
         };

         authStore.setAuthenticate({
            token,
            name: userInfo.username || "",
            role: userInfo.role || "",
         });

         return token;
      } catch (error) {
         throw new Error();
      }
   };

   return refresh;
}
