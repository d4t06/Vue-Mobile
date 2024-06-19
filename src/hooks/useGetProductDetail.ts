import { useProductDetailStore } from "@/stores/productDetail";
import { sleep } from "@/utils/appHelper";
import { publicRequest } from "@/utils/request";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const PRODUCT_URL = "/products";
export default function useGetProductDetail() {
   const productDetailStore = useProductDetailStore();

   const status = ref<"loading" | "success" | "error">("loading");
   const route = useRoute();

   const getProductDetail = async () => {
      try {
         const productId = route.params.id;
         status.value = "loading";

         await sleep(500);

         const res = await publicRequest.get(`${PRODUCT_URL}/${productId}`);
         productDetailStore.storingProduct(res.data.data);
         status.value = "success";
         // productDetail.value = res.data.data as Product;
      } catch (error) {
         console.log({ message: error });
         status.value = "error";
         productDetailStore.resetProduct();
      }
   };

   watch(
      route,
      async () => {
         getProductDetail();
      },
      {
         immediate: true,
      }
   );

   return { status };
}
