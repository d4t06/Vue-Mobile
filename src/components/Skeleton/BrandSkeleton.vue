<script lang="ts" setup>
import Skeleton from './Skeleton.vue'
</script>

<template>
      <Skeleton v-for="key in [...Array(5).keys()]" className="w-[100px] h-[28px] md:h-[34px] md:w-[150px] flex-shrink-0 rounded-[99px]" />
</template>
