<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";
import useLogout from "@/hooks/useLogout";
import RequireAuth from "@/layouts/RequireAuth.vue";

const logOut = useLogout();

const handleLogout = () => {
   logOut();
};
</script>

<template>
   <RequireAuth :allow-roles="['USER']">
      <div class="pt-[30px]">
         <Button :onclick="handleLogout" variant="push"> Sign out </Button>
      </div>
   </RequireAuth>
</template>
@/hooks/useLogout