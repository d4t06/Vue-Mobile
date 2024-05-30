<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";
import { useAuthStore, type AuthResponse } from "@/stores/auth";
import axios from "axios";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { loginClasses } from "@/utils/appHelper";

const LOGIN_URL = `${
   import.meta.env.VITE_API_ENDPOINT || "https://spring-mobile-latest.onrender.com/api"
}/auth/login`;

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

      const response = await axios.post(
         LOGIN_URL,
         {
            username: username.value,
            password: password.value,
         },
         {
            withCredentials: true,
         }
      );

      const { token, userInfo } = response.data.data as AuthResponse;

      authStore.setAuthenticate({
         user: { ...userInfo, token },
         loading: false,
      });

      router.push("/");
      authStore.setAuthenticate({ prevPath: null });
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

watch(
   usernameRef,
   () => {
      usernameRef.value?.focus();
   },
   { flush: "post" }
);

watch(
   () => 0,
   () => {
      if (authStore.user) return router.push("/");
   },
   {
      immediate: true,
   }
);

</script>

<template>
   {{ console.log("render check from.path", authStore.prevPath) }}
   <div :class="loginClasses.container">
      <form
         :class="`${loginClasses.form} ${
            isSubmit ? 'opacity-60 pointer-events-none' : ''
         }`"
         @submit="handleSubmit"
      >
         <div :class="loginClasses.left">
            <h1 :class="loginClasses.HDMobile">
               Vue <span class="text-[#cd1818]">Mobile</span>
            </h1>
            <h1 class="text-[26px] text-[#1f1f1f] mt-[10px]">Sign in</h1>
            <p v-if="errorMsg" :class="loginClasses.errorMessage">{{ errorMsg }}</p>
         </div>
         <div :class="loginClasses.right">
            <div :class="loginClasses.inputGroup">
               <label :class="loginClasses.label + ' pt-[8px]'" htmlFor="username"
                  >Username</label
               >
               <input
                  ref="usernameRef"
                  :class="loginClasses.input"
                  id="username"
                  type="text"
                  v-model="username"
               />
            </div>
            <div :class="loginClasses.inputGroup">
               <label :class="loginClasses.label" htmlFor="password">Password</label>
               <input
                  :class="loginClasses.input"
                  type="text"
                  id="password"
                  autoComplete="off"
                  required
                  v-model="password"
               />
            </div>
            <div className="persist-check">
               <input type="checkbox" id="persist" />
               <label className="ml-[8px] text-[#1f1f1f]" htmlFor="persist">
                  Trust this device :v ?
               </label>
            </div>

            <div class="md:text-right">
               <Button
                  variant="push"
                  className="leading-[26px] w-full md:w-auto mt-[20px]"
                  type="submit"
               >
                  Sign in
               </Button>
               <p className="text-[14px] mt-[20px]">
                  Don't have an account jet ?,
                  <RouterLink
                     class="text-[#cd1818] hover:underline ml-[4px]"
                     to="/register"
                  >
                     Sign up</RouterLink
                  >
               </p>
            </div>
         </div>
      </form>
   </div>
</template>
