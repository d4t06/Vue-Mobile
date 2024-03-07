import { defineStore } from "pinia";

type AppState = {
   categories: Category[];
   brands: Record<string, Brand[]>;
   sliders: Record<string, SliderImage[]>;
   priceRanges: Record<string, PriceRange[]>;
   initLoading: boolean;
};

const initialAppState: AppState = {
   categories: [],
   priceRanges: {},
   sliders: {},
   brands: {},
   initLoading: true,
};

export const useAppStore = defineStore("app", () => {
   return { initialAppState };
});
