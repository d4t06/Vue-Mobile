import { useToastStore } from "@/stores/toast";
import usePrivateRequest from "./usePrivateRequest";
import { ref } from "vue";
import { useProductStore } from "@/stores/product";
import { sleep } from "@/utils/appHelper";

const IMPORT_URL = "/products/json-import";

type JsonProduct = {
   name: string;
};

export default function useImportProduct() {
   const productStore = useProductStore();

   const status = ref<"input" | "fetching" | "error" | "finish">("input");
   const currentIndex = ref(0);

   const jsonProducts = ref<JsonProduct[]>([]);

   const { setErrorToast, setSuccessToast } = useToastStore();

   const privateRequest = usePrivateRequest();

   const submit = async (text: string) => {
      try {
         status.value = "fetching";

         const json = JSON.parse(text);
         jsonProducts.value = json;

         const newProducts: ProductList[] = [];
         for (let index = 0; index < json.length; index++) {
            const element = json[index];
            currentIndex.value = index;

            const res = await privateRequest.post(IMPORT_URL, element);

            if (res.data.data) {
               const product = res.data.data as ProductList;
               newProducts.push(product);
            }
         }

         await sleep(2000);

         status.value = "finish";
         setSuccessToast("Import products successful");
         productStore.products.push(...newProducts);
      } catch (error) {
         setErrorToast("");
         status.value = "error";
      }
   };

   return { status, currentIndex, submit, jsonProducts };
}
