<script lang="ts" setup>
import { ref, watch, reactive, computed } from "vue";
import { MyInput, Button } from "../ui";

import ModalHeader from "../Modal/ModalHeader.vue";

type Props = {
   closeModal: () => void;
   submit: (data: PriceRangeSchema) => void;
   categoryID: number;
   title: string;
   initValue?: PriceRangeSchema;
   loading: boolean;
};

const { submit, closeModal, initValue, loading, categoryID, title } =
   defineProps<Props>();

const initPriceRangeData: PriceRangeSchema = {
   category_id: categoryID,
   from_price: 0,
   label: "",
   to_price: 0,
};

const priceRangeData = reactive<PriceRangeSchema>(initPriceRangeData);
const childRef = ref<{ inputRef: HTMLInputElement } | null>(null);
// const isChange = ref(false);

const isAbleToSubmit = computed(() => {
   const { from_price, to_price, label } = priceRangeData;
   return (
      +from_price !== +to_price &&
      !!label &&
      Number.isInteger(+to_price) &&
      Number.isInteger(+from_price)
   );
});

// const handleInput = (field: keyof typeof priceRangeData, value: string) => {
//    isChange.value = true;
//    Object.assign(priceRangeData, { [field]: value });
// };

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
   },
);
</script>

<template>
   {{ console.log("check props", initValue) }}
   <div class="w-[300px] bg-[#fff]">
      <ModalHeader :closeModal="closeModal" :title="title" />
      <form @submit.prevent="handleSubmit" class="space-y-[16px]">
         <MyInput ref="childRef" v-model="priceRangeData.label" />
         <MyInput
            :attrs="{
               placeholder: 'From',
               type: 'number',
               min: 0,
            }"
            v-model="priceRangeData.from_price"
         />

         <MyInput
            :attrs="{
               placeholder: 'To',
               type: 'number',
               min: 0,
            }"
            v-model="priceRangeData.to_price"
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
