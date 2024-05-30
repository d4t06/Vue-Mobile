
import { defineStore } from "pinia";

// export type FilterType = {
//    brands: Brand[];
//    price: PriceRange | null;
// };

// export type SortType = {
//    column: string;
//    type: "desc" | "acs";
// };

type StateType = {
   brands: Brand[];
   price: PriceRange | null;
};

const initialState: StateType = {
   // filters: {
     
   // },
   // sort: {
   //    column: "",
   //    type: "desc",
   // },
   brands: [],
   price: null,
};

export const useFiltersStore = defineStore("filterStore", {
   state: () => initialState,
   actions: {
      storingFilters(payload: Partial<StateType>) {
         console.log('check payload', payload);
         
         Object.assign(this, payload);
      },
   },
});
