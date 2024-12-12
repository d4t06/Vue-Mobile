<script lang="ts" setup>
type Props = {
   colList: string[];
   className?: string;
};

const props = withDefaults(defineProps<Props>(), {
   className: "[&_th]:text-left",
});
</script>

<template>
   <table :class="`table ${props.className}`">
      <thead>
         <tr>
            <th v-for="item in props.colList" key="{index}">{{ item }}</th>
         </tr>
      </thead>

      <tbody>
         <slot />
      </tbody>
   </table>
</template>

<style lang="scss">
@import url("./Table.module.scss");
</style>
