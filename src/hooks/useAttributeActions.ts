import { useAppStore } from "@/stores/app";
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";
import { Ref, computed, ref } from "vue";
import usePrivateRequest from "./usePrivateRequest";
import { sleep } from "@/utils/appHelper";

const CATEGORY_URL = "/categories";
const DEV = import.meta.env.DEV;

type Props = {
   curCategoryIndex: Ref<number | null>;
   closeModal: () => {};
};

export default function useAttributeActions({ curCategoryIndex, closeModal }: Props) {
   const isFetching = ref(false);

   const appStore = useAppStore();
   const toastStore = useToastStore();
   const { categories } = storeToRefs(appStore);

   const privateRequest = usePrivateRequest();

   const curCategory = computed(() =>
      curCategoryIndex.value === null ? null : categories.value[curCategoryIndex.value]
   );

   type Add = {
      variant: "add";
      attribute: CategoryAttributeSchema;
   };

   type Edit = {
      variant: "edit";
      index: number;
      id: number;
      attribute: CategoryAttributeSchema;
   };

   type Delete = {
      variant: "delete";
      index: number;
      id: number;
   };

   const attributeActions = async (props: Add | Edit | Delete) => {
      try {
         if (!curCategory.value || curCategoryIndex.value === null)
            throw new Error("current not found");

         isFetching.value = true;
         if (import.meta.env.DEV) await sleep(500);

         switch (props.variant) {
            case "add":
               const { attribute } = props;

               const curAttributeOrder = curCategory.value.attribute_order;

               //   add attribute
               const res = await privateRequest.post(
                  `${CATEGORY_URL}/attributes`,
                  attribute
               );
               const newAttribute = res.data.data;

               // case fist time create category
               const newAttributeOrder = !!curAttributeOrder
                  ? curAttributeOrder + `_${newAttribute.id}`
                  : `${newAttribute.id}`;

               const newCategory: CategorySchema = {
                  attribute_order: newAttributeOrder,
                  category_ascii: curCategory.value.category_ascii,
                  category_name: curCategory.value.category_name,
                  is_show: 1,
               };

               //    update category attribute order
               await privateRequest.put(
                  `${CATEGORY_URL}/${curCategory.value.id}`,
                  newCategory
               );

               if (DEV) await sleep(500);

               appStore.categories[curCategoryIndex.value].attributes.push(newAttribute);
               appStore.categories[curCategoryIndex.value].attribute_order =
                  newAttributeOrder;

               toastStore.setSuccessToast("Add attribute successful");
               break;

            case "edit": {
               const { attribute, id, index } = props;

               const res = await privateRequest.put(
                  `${CATEGORY_URL}/attributes/${id}`,
                  attribute
               );
               const newAttribute = res.data.data;

               appStore.categories[curCategoryIndex.value].attributes[index] =
                  newAttribute;

               toastStore.setSuccessToast("Edit attribute successful");

               break;
            }

            case "delete":
               {
                  const { id, index } = props;
                  let newAttributeOrder = "";
                  const curAttributeOrder = curCategory.value.attribute_order;

                  await privateRequest.delete(`${CATEGORY_URL}/attributes/${id}`);

                  // if last index
                  if (curAttributeOrder.includes(`_${id}`)) {
                     newAttributeOrder = curAttributeOrder.replace(`_${id}`, "");
                  } else newAttributeOrder = curAttributeOrder.replace(`${id}_`, "");

                  const newCategorySchema: CategorySchema = {
                     attribute_order: newAttributeOrder,
                     category_ascii: curCategory.value.category_ascii,
                     category_name: curCategory.value.category_name,
                     is_show: 1,
                  };

                  //    update category attribute order
                  await privateRequest.put(
                     `${CATEGORY_URL}/${curCategory.value.id}`,
                     newCategorySchema
                  );

                  appStore.categories[curCategoryIndex.value].attribute_order =
                     newAttributeOrder;
                  appStore.categories[curCategoryIndex.value].attributes.splice(index, 1);

                  toastStore.setSuccessToast("Delete attribute successful");
               }
               break;
         }
      } catch (error) {
         console.log({ message: error });

         toastStore.setErrorToast("");
      } finally {
         isFetching.value = false;
         closeModal();
      }
   };

   const sortAttribute = async (startIndex: number, endIndex: number) => {
      try {
         if (startIndex === endIndex || !curCategory.value) return;

         isFetching.value = true;
         if (import.meta.env.DEV) sleep(500);
         const newOrderArray = curCategory.value.attribute_order.split("_");

         let temp = newOrderArray[startIndex];
         newOrderArray[startIndex] = newOrderArray[endIndex];
         newOrderArray[endIndex] = temp;

         const newOrder = newOrderArray.join("_");
         const newCategorySchema: CategorySchema = {
            attribute_order: newOrder,
            category_ascii: curCategory.value.category_ascii,
            category_name: curCategory.value.category_name,
            is_show: 1,
         };

         await privateRequest.put(
            `${CATEGORY_URL}/${curCategory.value.id}`,
            newCategorySchema
         );

         appStore.categories[curCategoryIndex.value as number].attribute_order = newOrder;
      } catch (error) {
         console.log({ message: error });
         toastStore.setErrorToast("");
      } finally {
         isFetching.value = false;
      }
   };

   return { attributeActions, sortAttribute, curCategory: curCategory, isFetching };
}

export type AttributeActionsType = ReturnType<typeof useAttributeActions>;
