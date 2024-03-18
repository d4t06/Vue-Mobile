<script lang="ts" setup>
import AddProduct from "@/components/Form/AddProduct.vue";
import Button from "@/components/ui/Button.vue";
import MyInput from "@/components/ui/MyInput.vue";
import Table from "@/components/ui/Table/Table.vue";
import { PlusIcon } from "@heroicons/vue/16/solid";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

type Tab = "ALL" | "ADD" | "EDIT";

const currentTab = ref<Tab>("ALL");
const currentProductIndex = ref<number>();

const classes = {
   searchBtn: "w-[]",
   hide: "hidden",
};
</script>

<template>
   <div class="flex justify-between">
      <div :class="`${currentTab != 'ALL' ? classes.hide : ''} flex space-x-[10px]`">
         <MyInput :attrs="{ placeholder: 'iPhone thirteen' }" className="ashdlasjd" />
         <Button variant="push">
            <MagnifyingGlassIcon class="w-[24px]" />
         </Button>
      </div>

      <Button
         v-if="currentTab === 'ALL'"
         :onClick="() => (currentTab = 'ADD')"
         variant="push"
         class="ml-auto"
      >
         <PlusIcon class="w-[20px]" />
         Add product
      </Button>

      <Button v-else :onClick="() => (currentTab = 'ALL')" variant="push" class="ml-auto">
         Cancel
      </Button>
   </div>
   <div :class="`${currentTab != 'ALL' ? classes.hide : ''}`">
      <div class="mt-[30px]">
         <Table :colList="['Name', 'Giá', '']">
            
         </Table>
      </div>
   </div>

   <div :class="`${currentTab != 'ADD' ? classes.hide : ''}`">
      <AddProduct type="Add" />
   </div>
   <div :class="`${currentTab != 'EDIT' ? classes.hide : ''}`">Edit tab</div>
</template>
