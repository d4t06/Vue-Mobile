import { useAuthStore } from "@/stores/auth";
import { privateRequest } from "../utils/request";
import { ref } from "vue";

const useLogout = () => {
   const authStore = useAuthStore();
   const isFetching = ref(false);

   const logout = async () => {
      try {
         isFetching.value = true;

         await privateRequest.get("/auth/logout");
         authStore.setAuthenticate({
            user: null,
         });
      } catch (error) {
         console.log({ message: error });
      } finally {
         isFetching.value = false;
      }
   };
   return { logout, isFetching };
};

export default useLogout;
