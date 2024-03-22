import { useFiltersStore } from "@/stores/filter";
import type { Brand, PriceRange } from "@/types";
import { storeToRefs } from "pinia";
import useProduct from "./useProducts";

export default function useFilterAction() {
   const filterStore = useFiltersStore();
   const { getProduct, categoryID, isFetching } = useProduct();
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
               const index = brands.value.findIndex((b) => b.brand_ascii === brand.brand_ascii);

               if (index == -1) {
                  filterStore.brands.push(brand);
               } else filterStore.brands.splice(index, 1);
            }
            break;
         case "clear":
            filterStore.brands = [];
            filterStore.price = null;
      }

      const brandID = brands.value.map((b) => b.id);
      getProduct({ page: 0, brandID, categoryID: categoryID.value }, { replace: true });
   };

   return { handleToggle, brands, price, isFetching };
}
