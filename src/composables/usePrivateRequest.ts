import { useAuthStore } from "@/stores/auth";
import { privateRequest } from "@/utils/request";
import { watchEffect } from "vue";
import useRefreshToken from "./useRefreshToken";

export default function usePrivateRequest() {
   const authStore = useAuthStore();
   const refresh = useRefreshToken();

   const token = authStore.user?.token;

   watchEffect(() => {
      if (!token) return;

      const requestIntercept = privateRequest.interceptors.request.use(
         (config) => {
            // Do something before request is sent
            if (!config.headers["Authorization"]) {
               config.headers["Authorization"] = `Bearer ${token}`;
            }

            return config;
         },
         (err) => Promise.reject(err) // Do something with response error
      );

      const responseIntercept = privateRequest.interceptors.response.use(
         (response) => response, // Do something with response data

         async (err) => {
            // Do something with response error
            const prevRequest = err?.config;

            if (err?.response?.status === 403 && !prevRequest?.sent) {
               // console.log("handle response err");
               prevRequest.sent = true;
               const newToken = await refresh();
               prevRequest.headers["Authorization"] = `Bearer ${newToken}`;

               return privateRequest(prevRequest);
            }
            return Promise.reject(err);
         }
      );

      return () => {
         privateRequest.interceptors.request.eject(requestIntercept);
         privateRequest.interceptors.response.eject(responseIntercept);
      };
   }, {});

   return privateRequest;
}
