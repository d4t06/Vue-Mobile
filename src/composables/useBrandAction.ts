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

   type AddOrEditBrand = AddBrand | EditBrand;

   const updateCategory = (currentCategory: Category) => {
      if (curCategoryIndex.value === undefined) return;
      const newCategories = [...categories.value];
      newCategories[curCategoryIndex.value] = currentCategory;
      appStore.storingCategory({ categories: newCategories, status: "successful" });
   };

   const addOrEditBrand = async ({ ...props }: AddOrEditBrand) => {
      try {
         switch (props.type) {
            case "add":
               if (!currentCategory.value) throw new Error("Current category not found");

               isFetching.value = true;

               const brandRes = await privateRequest.post(`${BRAND_URL}`, props.brand);

               const newBrandData = brandRes.data.data as Brand;

            //    const newCurrentCategory = { ...currentCategory.value };
            //    newCurrentCategory.brands.push(newBrandData);
            //    newCurrentCategory.brands.push(newBrandData);
            //    newCurrentCategory.brands.push(newBrandData);
            //    newCurrentCategory.brands.push(newBrandData);
            
            if (import.meta.env.DEV) await sleep(2000);
            
               console.log("update");
            currentCategory.value.brands.push(newBrandData);

            //    updateCategory(newCurrentCategory);

               break;

            case "edit":
               if (curCategoryIndex.value === undefined || !currentCategory.value)
                  throw new Error("Current not found");

               const { brand: updateBrand, currentIndex } = props;

               const oldBrand = currentCategory.value.brands[curCategoryIndex.value];

               if (currentIndex === undefined || !oldBrand)
                  throw new Error("Missing current index");
               isFetching.value = true;

               await privateRequest.put(`${BRAND_URL}/${oldBrand.id}`, updateBrand);

               const _newCurrentCategory = { ...currentCategory.value };
               Object.assign(_newCurrentCategory.brands[currentIndex], updateBrand);

               if (import.meta.env.DEV) await sleep(2000);

               console.log("update");

               updateCategory(_newCurrentCategory);
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

   const deleteBrand = async (curBrandIndex: number | undefined) => {
      try {
         if (curBrandIndex === undefined || !currentCategory.value)
            throw new Error("Current category not found");

        isFetching.value = true;

         // get delete brand
         const targetBrand = currentCategory.value.brands[curBrandIndex];
        // api
         await privateRequest.delete(`${BRAND_URL}/${targetBrand.id}`);
        // local update
         const newBrands = currentCategory.value.brands.filter((b) => b.id !== targetBrand.id);
         const newCategory = { ...currentCategory.value, brands: newBrands } as Category;

         if (import.meta.env.DEV) await sleep(2000);
         updateCategory(newCategory);

         toastStore.setSuccessToast(`Delete brand '${targetBrand.brand_name}' successful`);
      } catch (error) {
         console.log({ message: error });
         toastStore.setErrorToast(`Delete brand fail`);
      } finally {
         isFetching.value = false;
         isOpenModal.value = "close";
      }
   };

   return { categories, isFetching, addOrEditBrand, deleteBrand };
}
