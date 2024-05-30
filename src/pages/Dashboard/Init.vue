<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/ui/Button.vue";
import { loginClasses } from "@/utils/appHelper";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const INIT_URL = `${
   import.meta.env.VITE_API_ENDPOINT || "https://spring-mobile-latest.onrender.com/api"
}/init`;

const authStore = useAuthStore();

const currentStep = ref(0);

const usernameRef = ref<HTMLInputElement | null>(null);

const isSubmit = ref(false);
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMsg = ref("");

const router = useRouter();

const next = () => (currentStep.value += 1);

const handleSubmit = async (e: Event) => {
   e.preventDefault();

   try {
      isSubmit.value = true;

      await axios.post(
         INIT_URL,
         {
            username: username.value,
            password: password.value,
         },
         {
            withCredentials: true,
         }
      );
   } catch (error: any) {
      if (!error?.response) {
         errorMsg.value = "No server response";
      } else if (error?.response.status === 409) {
         errorMsg.value = "Username has taken";
      } else {
         errorMsg.value = "register fail";
      }

      console.log({ message: error });
   } finally {
      isSubmit.value = false;
      next();
   }
};

const finish = () => {
   router.push("/login");
   authStore.setAuthenticate({ prevPath: "/dashboard" });
};
</script>
<template>
   <slot v-if="currentStep === 0">
      <h1 class="text-[40px] font-[500] text-[#333]">Welcome</h1>
      <Button class="!absolute bottom-[60px]" variant="push" :onClick="next">
         Next
      </Button>
   </slot>

   <slot v-if="currentStep === 1" class="">
      <div :class="loginClasses.container">
         <form
            :class="`${loginClasses.form} ${
               isSubmit ? 'opacity-60 pointer-events-none' : ''
            }`"
         >
            <div :class="loginClasses.left">
               <h1 :class="loginClasses.HDMobile">
                  Vue <span class="text-[#cd1818]">Mobile</span>
               </h1>
               <h1 class="text-[26px] text-[#1f1f1f] mt-[10px]">Dashboard</h1>
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
               <div :class="loginClasses.inputGroup">
                  <label :class="loginClasses.label" htmlFor="confirm-password"
                     >Confirm password</label
                  >
                  <input
                     :class="loginClasses.input"
                     type="text"
                     id="confirm-password"
                     autoComplete="off"
                     required
                     v-model="confirmPassword"
                  />
               </div>
            </div>
         </form>
      </div>
      <Button
         :loading="isSubmit"
         class="!absolute bottom-[60px]"
         variant="push"
         :onClick="handleSubmit"
      >
         Next
      </Button>
   </slot>

   <slot v-if="currentStep === 2" class="">
      <h1 class="text-[40px] font-[500] text-[#333]">Done !</h1>
      <Button class="!absolute bottom-[60px]" variant="push" :onClick="finish">
         Go to dashboard
      </Button>
   </slot>
</template>
