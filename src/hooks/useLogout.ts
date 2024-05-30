import { useAuthStore } from "@/stores/auth";
import { privateRequest } from "../utils/request";

const useLogout = () => {
   const authStore = useAuthStore();

   const logout = async () => {
      try {
         await privateRequest.get("/auth/logout");
         authStore.setAuthenticate({
            user: null,
         });
      } catch (error) {
         console.log({ message: error });
      }
   };
   return logout;
};

export default useLogout;
