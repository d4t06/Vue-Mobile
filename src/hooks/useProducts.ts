import { useProductStore } from "@/stores/product";

import { storeToRefs } from "pinia";
import { computed } from "vue";

export default function useProduct() {
   const productStore = useProductStore();
   const { status, ...rest } = storeToRefs(productStore);

   const isFetching = computed(
      () => status.value === "loading" || status.value === "more-loading"
   );

   return { status, isFetching, ...rest };
}
