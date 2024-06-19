import { useAppStore } from "@/stores/app";
import { useToastStore } from "@/stores/toast";

import { publicRequest } from "@/utils/request";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import usePrivateRequest from "./usePrivateRequest";
import { sleep } from "@/utils/appHelper";
// import { useRoute } from "vue-router";

export type CategoryOpenModal = "close" | "edit" | "add" | "delete";

const CATEGORY_URL = "/categories";

type Props = {
   autoGetCategories?: boolean;
};

export default function useCategory(props?: Props) {
   const isFetching = ref(false);

   const appStore = useAppStore();
   const toastStore = useToastStore();
   const { status, categories } = storeToRefs(appStore);

   const privateRequest = usePrivateRequest();
   // const route = useRoute();

   const getCategories = async () => {
      try {
         if (appStore.categories.length) return;

         console.log(">>> api get categories");
         const res = await publicRequest.get("/categories");
         appStore.storingCategory({ categories: res.data.data, status: "successful" });
      } catch (err) {
         console.log({ message: err });
         appStore.storingCategory({ status: "error" });
      }
   };

   type AddCategory = {
      type: "add";
      category: CategorySchema;
   };

   type EditCategory = {
      type: "edit";
      category: CategorySchema;
      currentIndex: number | undefined;
   };

   const addOrEditCategory = async ({ ...props }: AddCategory | EditCategory) => {
      try {
         switch (props.type) {
            case "add":
               isFetching.value = true;
               if (import.meta.env.DEV) await sleep(500);

               const { category } = props;
               // add category
               const res = await privateRequest.post(`${CATEGORY_URL}`, category);

               // add attributes prop to category to fix error not found when add attribute
               const newCategory = res.data.data as Category;
               const newCategories = [...categories.value, newCategory];

               appStore.storingCategory({ categories: newCategories });

               break;
            case "edit":
               const { category: _category, currentIndex } = props;

               if (currentIndex === undefined) throw new Error("Missing current index");
               const curCategory = categories.value[currentIndex];

               if (curCategory === undefined) throw new Error("Missing curCategory");

               isFetching.value = true;

               await privateRequest.put(`${CATEGORY_URL}/${curCategory.id}`, _category);

               const _newCategories = [...categories.value];
               Object.assign(_newCategories[currentIndex], _category);

               appStore.storingCategory({ categories: _newCategories });
         }

         toastStore.setSuccessToast(`${props.type} category successful`);
      } catch (error) {
         console.log({ message: error });
         toastStore.setErrorToast(`${props.type} category fail`);
      } finally {
         isFetching.value = false;
         // isOpenModal.value = "close";
      }
   };

   const deleteCategory = async (currentIndex: number | undefined) => {
      try {
         if (currentIndex === undefined) throw new Error("Missing current index have id");
         const curCategory = categories.value[currentIndex];

         if (!curCategory) throw new Error("Category not found");
         isFetching.value = true;

         await privateRequest.delete(`${CATEGORY_URL}/${curCategory.id}`);

         const newCategories = categories.value.filter((c) => c.id !== curCategory.id);
         appStore.storingCategory({ categories: newCategories });

         toastStore.setSuccessToast(
            `Delete category '${curCategory.category_name}' successful`
         );
      } catch (error) {
         console.log({ message: error });
         toastStore.setErrorToast(`Delete category fail`);
      } finally {
         isFetching.value = false;
         // isOpenModal.value = "close";
      }
   };

   watch(
      () => {},
      () => {
         if (props?.autoGetCategories) {
            if (!categories.value.length) getCategories();
         }
      },
      {
         immediate: true,
      }
   );

   return {
      categories,
      status,
      getCategories,
      addOrEditCategory,
      deleteCategory,
      isFetching,
   };
}
