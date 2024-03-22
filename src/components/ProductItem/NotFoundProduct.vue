<script setup lang="ts">
const classes = {
   container: "max-w-[80vw] mt-[30px] mx-auto text-center ",
   image: "w-[250px] mx-auto",
};
</script>

<template>
   <div :class="classes.container">
      <img :class="classes.image" src="https://fptshop.com.vn/Content/v5d/images/noti-search.png" alt="" />
      <p class="text-[18px] mt-[30px]">
         Rất tiếc chúng tôi không tìm thấy kết quả theo yêu cầu của bạn
      </p>
   </div>
</template>
