<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";
import { useAuthStore, type AuthResponse } from "@/stores/auth";
import { privateRequest, publicRequest } from "@/utils/request";
import { onBeforeMount, onUnmounted, ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
const LOGIN_URL = "/auth/login";

const usernameRef = ref<HTMLInputElement | null>(null);

const isSubmit = ref(false);
const username = ref("");
const password = ref("");

const errorMsg = ref("");

const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async (e: Event) => {
   e.preventDefault();
   try {
      isSubmit.value = true;

      const response = await privateRequest.post(LOGIN_URL, {
         username: username.value,
         password: password.value,
      });

      const { token, userInfo } = response.data.data as AuthResponse;

      authStore.setAuthenticate({
         user: { ...userInfo, token },
         loading: false,
      });

      router.push("/");
   } catch (error: any) {
      if (!error?.response) {
         errorMsg.value = "No server response";
      } else if (error?.response.status === 401) {
         errorMsg.value = "Username or password invalid";
      } else {
         errorMsg.value = "Sign in fail";
      }

      console.log({ message: error });
   } finally {
      isSubmit.value = false;
   }
};

watchEffect(() => {
   if (usernameRef.value) {
      usernameRef.value.focus();
   }
});

const classes = {
   container:
      "rounded-[24px] w-[90vw] md:flex-grow md:w-auto mx-auto my-auto md:mx-[200px] bg-white p-[20px] md:px-[30px]",
   form: "flex flex-col md:flex-row justify-between",
   right: "space-y-[16px] mt-[20px] md:mt-0",
   inputGroup: "flex flex-col space-y-[2px]",
   label: "text-[#000]",
   input: "py-[4px] rounded-[6px] border border-black/15 outline-none px-[10px]",
   errorMessage: "bg-red-500/30 text-red-500 p-[6px] rounded-[6px] inline-block",
};
</script>

<template>
   <div :class="classes.container">
      <form
         :class="`${classes.form} ${isSubmit ? 'opacity-60 pointer-events-none' : ''}`"
         @submit="handleSubmit"
      >
         <div class="left text-center md:text-left space-y-[10px]">
            <h1 class="text-[26px] font-[500]" to="/">
               HD <span class="text-[#cd1818]">Mobile</span>
            </h1>
            <h2 class="text-[22px]">Sign in</h2>
            <p v-if="errorMsg" :class="classes.errorMessage">{{ errorMsg }}</p>
         </div>
         <div :class="classes.right">
            <div :class="classes.inputGroup">
               <label :class="classes.label" htmlFor="username">Username</label>
               <input
                  ref="usernameRef"
                  :class="classes.input"
                  id="username"
                  type="text"
                  required
                  v-model="username"
               />
            </div>
            <div :class="classes.inputGroup">
               <label :class="classes.label" htmlFor="password">Password</label>
               <input
                  :class="classes.input"
                  type="text"
                  id="password"
                  autoComplete="off"
                  required
                  v-model="password"
               />
            </div>
            <div className="persist-check">
               <input type="checkbox" id="persist" />
               <label className="ml-[8px]" htmlFor="persist"> Trust this device :v ? </label>
            </div>

            <div class="md:text-right space-y-[10px]">
               <Button
                  rounded="max"
                  variant="push"
                  className="leading-[26px] w-full md:w-auto"
                  type="submit"
               >
                  Sign in
               </Button>
               <p className="text-[14px]">
                  Don't have an account jet ?,
                  <RouterLink class="text-[#cd1818] hover:underline ml-[4px]" to="/register">
                     Sign up</RouterLink
                  >
               </p>
            </div>
         </div>
      </form>
   </div>
</template>
