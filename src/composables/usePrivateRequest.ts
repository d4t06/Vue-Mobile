import { useAuthStore } from "@/stores/auth";
import { privateRequest } from "@/utils/request";
import { computed, watch } from "vue";
import useRefreshToken from "./useRefreshToken";
import { useRouter } from "vue-router";

export default function usePrivateRequest() {
   const authStore = useAuthStore();
   const refresh = useRefreshToken();

   const router = useRouter();

   const token = computed(() => authStore.user?.token);

   watch(
      authStore,
      () => {
         if (!authStore.user || !token.value) return;

         const requestIntercept = privateRequest.interceptors.request.use(
            (config) => {
               // Do something before request is sent
               if (!config.headers["Authorization"]) {
                  config.headers["Authorization"] = `Bearer ${token.value}`;
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

               if (!prevRequest["sent"]) {
                  prevRequest["sent"] = true;

                  if (err?.response?.status === 401) {
                     const newToken = await refresh();
                     prevRequest.headers["Authorization"] = `Bearer ${newToken}`;

                     return privateRequest(prevRequest);
                  }
               }

               return Promise.reject(err);
            }
         );

         return () => {
            privateRequest.interceptors.request.eject(requestIntercept);
            privateRequest.interceptors.response.eject(responseIntercept);
         };
      },
      {
         immediate: true,
      }
   );

   return privateRequest;
}
