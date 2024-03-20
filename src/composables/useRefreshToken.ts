import { useAuthStore, type AuthResponse } from "@/stores/auth";
import axios from "axios";

const REFRESH_URL = "http://localhost:8080/api/auth/refresh";

// const privateRequest = axios.create({
//    baseURL: BASE_URL,
//    withCredentials: true,
// });

export default function useRefreshToken() {
   const authStore = useAuthStore();

   const refresh = async () => {
      console.log("run refresh");
      try {
         /**
          * Not use privateRequest instance
          * because is cause infinite loop
          * for skip jwt authentication
          */
         const res = await axios.get(REFRESH_URL, {
            withCredentials: true,
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
