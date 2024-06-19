import { publicRequest } from "@/utils/request";
import { Ref, ref, watchEffect } from "vue";

type Props = {
   searchKey: Ref<string>;
};

const URL = "/products/search";

export default function useSearchProduct({ searchKey }: Props) {
   const isFetching = ref(false);
   const searchResult = ref<SearchProduct[]>([]);

   watchEffect((onCancel) => {
      if (!searchKey.value.trim()) return;

      const controller = new AbortController();

      const getSearch = async () => {
         try {
            console.log("search");

            isFetching.value = true;
            const res = await publicRequest.get(`${URL}?q=${searchKey.value}`, {
               signal: controller.signal,
            });
            searchResult.value = res.data.data;
         } catch (error) {
            console.log({ message: error });
         } finally {
            isFetching.value = false;
         }
      };

      getSearch();

      onCancel(() => {
         controller.abort();
      });
   });

   return { searchResult, isFetching };
}
