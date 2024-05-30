<script setup lang="ts">
import Skeleton from "@/components/Skeleton/Skeleton.vue";
import { Button } from "@/components/ui";
import { ref, watch } from "vue";

type Props = {
   product: Product | null;
   loading: boolean;
};

const props = defineProps<Props>();
const isShowMore = ref(false);
const contentRef = ref<HTMLDivElement>();
const isSetHeight = ref(false);

const handleShowMore = () => {
   const contentEle = contentRef.value;
   if (contentEle) {
      contentEle.style.maxHeight = "100%";
      isShowMore.value = true;
   }
};

watch(
   [() => isSetHeight.value, () => props.loading],
   () => {
      if (props.loading) return;

      if (!isSetHeight.value) {
         setTimeout(() => (isSetHeight.value = true), 1000);
         return;
      }

      const specTable = document.querySelector(".spec") as HTMLDivElement;

      console.log("check spec ", specTable);

      if (specTable) {
         const contentEle = contentRef.value;

         if (contentEle) contentEle.style.maxHeight = `${specTable.clientHeight}px`;
      }
   },
   {
      immediate: true,
   }
);
</script>

<template>
   <div class="content-container relative" ref="contentRef">
      <template v-if="props.loading || !isSetHeight">
         <Skeleton className="w-full h-[500px] !rounded-[14px]" />
      </template>
      <template v-else-if="props.product">
         <div v-html="props.product.description.content"></div>
         <div
            v-if="!isShowMore"
            class="absolute w-full bottom-0 h-[150px] blur-block"
         ></div>
      </template>
   </div>

   <div v-if="!isShowMore && isSetHeight" class="text-center">
      <Button :onClick="handleShowMore" variant="push"> More </Button>
   </div>
</template>

<style lang="scss">
@import url("./style.scss");
</style>
