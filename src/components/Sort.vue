<script lang="ts" setup>
import { Button } from "./ui";
import useSortActions from "@/hooks/useSortActions";
import type { SortStoreType } from "@/stores/sort";
import useProduct from "@/hooks/useProducts";
import { generateId } from "@/utils/appHelper";
import { GetProductParams } from "@/hooks/useGetProduct";

type Props = {
   additionParams?: Partial<GetProductParams>
}

const props = defineProps<Props>()

type Continent = {
   column: SortStoreType["column"];
   type: SortStoreType["type"];
   name: string;
};

const continents: Continent[] = [
   {
      name: "Low price",
      column: "price",
      type: "asc",
   },
   {
      name: "High price",
      column: "price",
      type: "desc",
   },
   {
      name: "Best seller",
      column: "price",
      type: "desc",
   },
];

const { handleSort, nameAscii, enable } = useSortActions();
const { isFetching } = useProduct();

const classes = {
   active: "text-[#cd1818] font-[500]",
   btn: "py-[3px] px-[12px] text-[15px] flex-shrink-0",
};
</script>
<template>
   <div :class="`flex w-full flex-col md:flex-row md:items-center md:mt-[14px]`">
      <h5 class="mr-[14px] font-[500] translate-y-[1px]">Sort</h5>
      <div
         :class="`flex pb-[2px] flex-wrap overflow-x-auto w-full mt-[-10px] ml-[-10px] space-x-[10px] space-y-[10px] ${
            isFetching ? 'disable' : ''
         }`"
      >
         <Button
            :class="`${classes.btn} ml-[10px] mt-[10px]`"
            :active="!enable"
            :onClick="() => handleSort({ action: 'clear', params: props.additionParams })"
            size="clear"
            variant="push"
            colors="secondary"
            >Newest
         </Button>
         <Button
            v-for="item in continents"
            :onClick="
               () =>
                  handleSort({
                     action: 'sort',
                     name: item.name,
                     column: item.column,
                     type: item.type,
                     params: props.additionParams
                  })
            "
            :class="classes.btn"
            :active="nameAscii === generateId(item.name)"
            size="clear"
            variant="push"
            colors="secondary"
            >{{ item.name }}
         </Button>
      </div>
   </div>
</template>
