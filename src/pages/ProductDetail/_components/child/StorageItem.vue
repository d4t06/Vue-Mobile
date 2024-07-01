<script setup lang="ts">
import { Button } from '@/components/ui';

type Props = {
   storage: ProductStorage;
   defaultCombine: ProductCombine | undefined;
   active: boolean;
   handleChoseStorage: (s: ProductStorage) => void;
};

const props = defineProps<Props>();

const classes = {
   variantButton: "h-[56px]",
};
</script>

<template>
   <template v-if="props.defaultCombine">
      <Button
         :className="`!flex-col px-[4px] w-full ${classes.variantButton}`"
         :active="props.active"
         :onClick="
            () =>
               !props.active ? handleChoseStorage(props.storage) : console.log('already')
               
         "
         variant="push"
         colors="secondary"
      >
         <span>
            {{ props.storage.storage_name }}
         </span>
         <span class="text-[14px] font-[500]"> {{}}</span>
      </Button>
   </template>
</template>
