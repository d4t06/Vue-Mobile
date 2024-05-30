<script lang="ts" setup>
import { ref, watch, reactive, computed } from "vue";
import { MyInput, Button } from "../ui";

import ModalHeader from "../Modal/ModalHeader.vue";

type Props = {
   close: () => void;
   submit: (data: PriceRangeSchema) => void;
   categoryID: number;
   title: string;
   initValue?: PriceRangeSchema;
   loading: boolean;
};

const { submit, close, initValue, loading, categoryID, title } = defineProps<Props>();

const initPriceRangeData: PriceRangeSchema = {
   category_id: categoryID,
   from_price: 0,
   label: "",
   to_price: 0,
};

const priceRangeData = reactive<PriceRangeSchema>(initPriceRangeData);
const childRef = ref<{ inputRef: HTMLInputElement } | null>(null);
const isChange = ref(false);

const isAbleToSubmit = computed(() => {
   const { from_price, to_price, label } = priceRangeData;
   return (
      +from_price !== +to_price &&
      !!label &&
      Number.isInteger(+to_price) &&
      Number.isInteger(+from_price)
   );
});

const handleInput = (field: keyof typeof priceRangeData, value: string) => {
   isChange.value = true;
   Object.assign(priceRangeData, { [field]: value });
};

const handleSubmit = () => {
   submit(priceRangeData);
};

watch(childRef, () => childRef.value?.inputRef.focus(), { once: true });

// use watch to do not mutate the current price range
watch(
   () => initValue,
   () => {
      if (initValue) {
         Object.assign(priceRangeData, initValue);
      }
   },
   {
      immediate: true,
   }
);
</script>

<template>
   {{ console.log("check props", initValue) }}
   <div class="w-[300px] bg-[#fff]">
      <ModalHeader :close="close" :title="title" />
      <form @submit.prevent="handleSubmit" class="space-y-[16px]">
         <MyInput
            ref="childRef"
            :attrs="{ placeholder: 'Label', value: priceRangeData.label }"
            @input="(e) => handleInput('label',(e.target as HTMLInputElement).value)"
         />
         <MyInput
            :attrs="{ placeholder: 'From', value: priceRangeData.from_price }"
            @input="(e) => handleInput('from_price',(e.target as HTMLInputElement).value)"
         />

         <MyInput
            :attrs="{ placeholder: 'To', value: priceRangeData.to_price }"
            @input="(e) => handleInput('to_price',(e.target as HTMLInputElement).value)"
         />

         <p class="text-right mt-[20px]">
            <Button
               variant="push"
               :disabled="!isAbleToSubmit"
               :class="`leading-[24px]`"
               :loading="loading"
               type="submit"
            >
               Save
            </Button>
         </p>
      </form>
   </div>
</template>
