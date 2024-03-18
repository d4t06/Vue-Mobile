<script lang="ts" setup>


type Props = {
   colList: string[];
};

const { colList } = defineProps<Props>();
</script>

<template>
   <table className="table">
      <thead>
         <tr>
            <th v-for="item in colList" key="{index}">{{ item }}</th>
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
