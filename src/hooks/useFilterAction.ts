import { useFiltersStore } from "@/stores/filter";

import { storeToRefs } from "pinia";
import useProduct from "./useProducts";
import useGetProduct from "./useGetProduct";

export default function useFilterAction() {
   const filterStore = useFiltersStore();
   const { categoryID, isFetching } = useProduct();
   const { getProduct } = useGetProduct();
   const { brands, price } = storeToRefs(filterStore);

   type BrandToggle = {
      variant: "brand";
      value: Brand | "clear";
   };

   type PriceToggle = {
      variant: "price";
      value: PriceRange | "clear";
   };

   type Clear = {
      variant: "clear";
   };

   type HandleToggle = BrandToggle | PriceToggle | Clear;

   const handleToggle = ({ ...props }: HandleToggle) => {
      if (categoryID.value == null) return;
      switch (props.variant) {
         case "price":
            if (props.value === "clear") price.value = null;
            else price.value = props.value;
            break;
         case "brand":
            if (props.value === "clear") filterStore.brands = [];
            else {
               const brand = props.value;
               const index = brands.value.findIndex((b) => b.id === brand.id);

               if (index == -1) {
                  filterStore.brands.push(brand);
               } else filterStore.brands.splice(index, 1);
            }
            break;
         case "clear":
            filterStore.brands = [];
            filterStore.price = null;
      }

      getProduct({}, { replace: true });
   };

   return { handleToggle, brands, price, isFetching };
}
