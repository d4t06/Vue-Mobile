<script setup lang="ts">
import { MyInput } from "@/components/ui";
import { inputClasses } from "@/utils/appHelper";

const classes = {
   formLabel: "text-[16px] text-[#3f3f3f] font-[500]",
};
</script>

<template>
   <div class="space-y-[14px]">
      <div class="space-y-[6px]">
         <label :class="classes.formLabel" htmlFor="name"> Họ và tên </label>
         <MyInput :attrs="{ id: 'name' }" />
      </div>
      <div class="space-y-[6px]">
         <label :class="classes.formLabel" htmlFor="phone-number"> Số điện thoại </label>
         <MyInput :attrs="{ id: 'phone-number' }" />
      </div>
      <div class="space-y-[6px]">
         <label :class="classes.formLabel" htmlFor="location"> Địa chỉ </label>
         <textarea id="location" :class="inputClasses.input" />
      </div>
   </div>
</template>
