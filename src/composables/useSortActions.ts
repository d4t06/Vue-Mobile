import { useSortStore } from "@/stores/sort";
import { storeToRefs } from "pinia";
import useProduct from "./useProducts";
import { generateId } from "@/utils/appHelper";
import useGetProduct from "./useGetProduct";

export default function useSortActions() {
   const sortStore = useSortStore();
   const { categoryID } = useProduct();
   const { getProduct } = useGetProduct();
   const { column, enable, type, nameAscii } = storeToRefs(sortStore);

   type SortType = {
      action: "sort";
      column: typeof column.value;
      type: typeof type.value;
      name: string;
   };
   type Clear = {
      action: "clear";
   };

   type HandleSort = SortType | Clear;

   const handleSort = (props: HandleSort) => {
      if (!categoryID.value) return;

      switch (props.action) {
         case "sort":
            const { column, type, name } = props;
            if (sortStore.column === column && sortStore.type === type) return;

            sortStore.$patch({ column, type, nameAscii: generateId(name), enable: true });
            getProduct({}, { replace: true });
            break;

         case "clear":
            if (!sortStore.enable) return;

            sortStore.$patch({ column: null, type: null, nameAscii: null, enable: false });
            getProduct({}, { replace: true });
            break;
      }
   };

   return { handleSort, column, enable, type, nameAscii };
}
