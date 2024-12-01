import { useToastStore } from "@/stores/toast";
import usePrivateRequest from "./usePrivateRequest";
import { ref } from "vue";
import { useAppStore } from "@/stores/app";

const IMPORT_URL = "/categories/json-import";

export default function useImportCategory() {
   const appStore = useAppStore();

   const status = ref<"input" | "fetching" | "error" | "finish">("input");

   const { setErrorToast, setSuccessToast } = useToastStore();

   const privateRequest = usePrivateRequest();

   const submit = async (value: string) => {
      try {
         status.value = "fetching";

         const json = JSON.parse(value);

         const res = await privateRequest.post(IMPORT_URL, json);

         const categories = res.data.data as Category[];

         appStore.categories.push(...categories);

         status.value = "finish";
         setSuccessToast("Import category successful");
      } catch (error) {
         console.log(error);

         status.value = "error";
         setErrorToast("");
      }
   };

   return {
      status,
      submit,
   };
}
