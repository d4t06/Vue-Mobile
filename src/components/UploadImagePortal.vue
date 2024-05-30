<script lang="ts" setup>
import useImageAction from "@/hooks/useUploadImage";
const { inputChangeHandler } = useImageAction();
</script>

<template>
   <Teleport to="#portal">
      <input class="hidden" :onChange="inputChangeHandler" type="file" multiple accept="image/*" id="image-upload" />
   </Teleport>
</template>
@/hooks/useUploadImage