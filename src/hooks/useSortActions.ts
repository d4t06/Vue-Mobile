import { useSortStore } from "@/stores/sort";
import { storeToRefs } from "pinia";
import { generateId } from "@/utils/appHelper";
import useGetProduct, { GetProductParams } from "./useGetProduct";

export default function useSortActions() {
   const sortStore = useSortStore();
   const { getProduct } = useGetProduct();
   const { column, enable, type, nameAscii } = storeToRefs(sortStore);

   type SortType = {
      action: "sort";
      column: typeof column.value;
      type: typeof type.value;
      name: string;
      params?: Partial<GetProductParams>;
   };
   type Clear = {
      action: "clear";
      params?: Partial<GetProductParams>;
   };

   type HandleSort = SortType | Clear;

   const handleSort = (props: HandleSort) => {
      // console.log("check product Store", productStore.categoryID);

      // if (!productStore.categoryID) return;

      switch (props.action) {
         case "sort":
            const { column, type, name, params = {} } = props;
            if (sortStore.column === column && sortStore.type === type) return;

            sortStore.$patch({ column, type, nameAscii: generateId(name), enable: true });
            getProduct(params, { replace: true });
            break;

         case "clear":
            if (!sortStore.enable) return;

            sortStore.$patch({
               column: null,
               type: null,
               nameAscii: null,
               enable: false,
            });
            getProduct(props.params || {}, { replace: true });
            break;
      }
   };

   return { handleSort, column, enable, type, nameAscii };
}
