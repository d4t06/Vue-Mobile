import type { Brand, PriceRange } from "@/types";
import { defineStore } from "pinia";

export type FilterType = {
   brands: Brand[];
   price: PriceRange | undefined;
};

export type SortType = {
   column: string;
   type: "desc" | "acs";
};

type StateType = {
   filters: FilterType;
   sort: SortType;
};

const initialState: StateType = {
   filters: {
      brands: [],
      price: undefined,
   },
   sort: {
      column: "",
      type: "desc",
   },
};

export const useFiltersStore = defineStore("filterStore", {
   state: () => initialState,
   actions: {
      storingFilters(payload: Partial<StateType>) {
         Object.assign(this, payload);
      },
   },
});
