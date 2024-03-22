import { useAppStore } from "@/stores/app";
import { useToastStore } from "@/stores/toast";
import type { Brand, BrandSchema, Category } from "@/types";
import { storeToRefs } from "pinia";
import { computed, ref, type Ref } from "vue";
import usePrivateRequest from "./usePrivateRequest";
import { sleep } from "@/utils/appHelper";

const BRAND_URL = "/brands";

export type BrandModal = "close" | "edit" | "add" | "delete";

type Props = {
   isOpenModal: Ref<BrandModal>;
   curCategoryIndex: Ref<number | undefined>;
};

export default function useBrandAction({ isOpenModal, curCategoryIndex }: Props) {
   const isFetching = ref(false);

   const appStore = useAppStore();
   const toastStore = useToastStore();
   const { categories, status } = storeToRefs(appStore);

   const privateRequest = usePrivateRequest();
   const currentCategory = computed(() =>
      curCategoryIndex.value === undefined ? undefined : categories.value[curCategoryIndex.value]
   );

   type AddBrand = {
      type: "add";
      brand: BrandSchema;
   };

   type EditBrand = {
      type: "edit";
      brand: BrandSchema;
      currentIndex: number | undefined;
   };

   type DeleteBrand = {
      type: "delete";
      curBrandIndex: number | undefined;
   };

   type Params = AddBrand | EditBrand | DeleteBrand;

   const updateCategory = (currentCategory: Category) => {
      if (curCategoryIndex.value === undefined) return;
      const newCategories = [...categories.value];
      newCategories[curCategoryIndex.value] = currentCategory;
      appStore.storingCategory({ categories: newCategories, status: "successful" });
   };

   const brandActions = async ({ ...props }: Params) => {
      try {
         switch (props.type) {
            case "add":
               if (!currentCategory.value) throw new Error("Current category not found");

               isFetching.value = true;

               const brandRes = await privateRequest.post(`${BRAND_URL}`, props.brand);

               const newBrandData = brandRes.data.data as Brand;

               if (import.meta.env.DEV) await sleep(2000);

               currentCategory.value.brands.push(newBrandData);

               break;

            case "edit":
               if (curCategoryIndex.value === undefined || !currentCategory.value)
                  throw new Error("Current not found");

               const { brand: updateBrand, currentIndex } = props;
               if (currentIndex === undefined) throw new Error("Missing current index");

               const oldBrand = currentCategory.value.brands[currentIndex];
               if (oldBrand === undefined) throw new Error("Brand not found ");

               isFetching.value = true;
               // api
               await privateRequest.put(`${BRAND_URL}/${oldBrand.id}`, updateBrand);

               if (import.meta.env.DEV) await sleep(2000);
               Object.assign(currentCategory.value.brands[currentIndex], updateBrand);

               break;

            case "delete":
               const { curBrandIndex } = props;
               if (curBrandIndex === undefined || !currentCategory.value)
                  throw new Error("Current category not found");

               isFetching.value = true;

               // get delete brand
               const targetBrand = currentCategory.value.brands[curBrandIndex];
               // api
               await privateRequest.delete(`${BRAND_URL}/${targetBrand.id}`);
               // local update
               if (import.meta.env.DEV) await sleep(2000);
               const newBrands = currentCategory.value.brands.filter(
                  (b) => b.id !== targetBrand.id
               );
               currentCategory.value.brands = newBrands;
         }
         toastStore.setSuccessToast(`${props.type} brand successful`);
      } catch (error) {
         console.log({ message: error });
         toastStore.setErrorToast(`${props.type} brand fail`);
      } finally {
         isFetching.value = false;
         isOpenModal.value = "close";
      }
   };

   // const deleteBrand = async (curBrandIndex: number | undefined) => {
   //    try {
   //       if (curBrandIndex === undefined || !currentCategory.value)
   //          throw new Error("Current category not found");

   //       isFetching.value = true;

   //       // get delete brand
   //       const targetBrand = currentCategory.value.brands[curBrandIndex];
   //       // api
   //       await privateRequest.delete(`${BRAND_URL}/${targetBrand.id}`);
   //       // local update
   //       const newBrands = currentCategory.value.brands.filter((b) => b.id !== targetBrand.id);
   //       const newCategory = { ...currentCategory.value, brands: newBrands } as Category;

   //       if (import.meta.env.DEV) await sleep(2000);
   //       updateCategory(newCategory);

   //       toastStore.setSuccessToast(`Delete brand '${targetBrand.brand_name}' successful`);
   //    } catch (error) {
   //       console.log({ message: error });
   //       toastStore.setErrorToast(`Delete brand fail`);
   //    } finally {
   //       isFetching.value = false;
   //       isOpenModal.value = "close";
   //    }
   // };

   return { categories, isFetching, brandActions };
}
