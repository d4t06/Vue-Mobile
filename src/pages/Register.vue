<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";
import { publicRequest } from "@/utils/request";
import { CheckIcon, XMarkIcon } from "@heroicons/vue/16/solid";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { loginClasses } from "@/utils/appHelper";

const REGISTER_URL = "/auth/register";
const USER_REGEX = /^(?=.{4,20}$)[a-zA-Z].*/;
const PWD_REGEX = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

const isSubmit = ref(false);

const username = ref("");
const validName = ref(false);

const password = ref("");
const validPassword = ref(false);

const confirmPassword = ref("");
const validConfirmPassword = ref(false);

const errorMsg = ref("");

const router = useRouter();

const handleSubmit = async (e: Event) => {
   e.preventDefault();
   try {
      isSubmit.value = true;

      await publicRequest.post(REGISTER_URL, {
         username: username.value,
         password: password.value,
      });

      router.push("/login");
   } catch (error: any) {
      if (!error?.response) {
         errorMsg.value = "No server response";
      } else if (error?.response.status === 409) {
         errorMsg.value = "Username has taken, please use another instead";
      } else {
         errorMsg.value = "Register fail";
      }
   } finally {
      isSubmit.value = false;
   }
};

watch([username], () => {
   const result = USER_REGEX.test(username.value);

   validName.value = result;
});

watch([password, confirmPassword], () => {
   const result = PWD_REGEX.test(password.value);
   validPassword.value = result;

   let match = password.value === confirmPassword.value;

   if (!password) match = false;
   validConfirmPassword.value = match;
});

const classes = {
   labelGroup: "flex items-center space-x-[4px]",
   checkIcon: "text-emerald-500 w-[24px]",
   xIcon: "text-red-500 w-[24px]",
};
</script>

<template>
   <div :class="loginClasses.container">
      <form
         :class="`${loginClasses.form} ${
            isSubmit ? ' opacity-60 pointer-events-none' : ''
         }`"
         @submit="handleSubmit"
      >
         <div :class="loginClasses.left">
            <h1 :class="loginClasses.HDMobile">
               Vue <span class="text-[#cd1818]">Mobile</span>
            </h1>
            <h1 class="text-[26px] mt-[10px] text-[#1f1f1f]">Create new account</h1>
            <p v-if="errorMsg" :class="loginClasses.errorMessage">{{ errorMsg }}</p>
         </div>
         <div :class="loginClasses.right">
            <div :class="loginClasses.inputGroup">
               <div :class="classes.labelGroup">
                  <label :class="loginClasses.label + ' pt-[8px]'" htmlFor="username"
                     >Username</label
                  >
                  <span v-if="username">
                     <CheckIcon v-if="validName" :class="classes.checkIcon" />
                     <XMarkIcon v-else :class="classes.xIcon" />
                  </span>
               </div>
               <input
                  :class="loginClasses.input"
                  ref="{userInputRef}"
                  id="username"
                  autoComplete="off"
                  type="text"
                  placeholder="example..."
                  required
                  v-model="username"
               />
            </div>
            <div :class="loginClasses.inputGroup">
               <div :class="classes.labelGroup">
                  <label :class="loginClasses.label" htmlFor="password">Password</label>
                  <span v-if="password">
                     <CheckIcon v-if="validPassword" :class="classes.checkIcon" />
                     <XMarkIcon v-else :class="classes.xIcon" />
                  </span>
               </div>
               <input
                  :class="loginClasses.input"
                  type="password"
                  id="password"
                  autoComplete="off"
                  required
                  v-model="password"
               />
            </div>

            <div :class="loginClasses.inputGroup">
               <div :class="classes.labelGroup">
                  <label :class="loginClasses.label" htmlFor="confirm"
                     >Confirm password</label
                  >
                  <span v-if="confirmPassword">
                     <CheckIcon
                        v-if="validConfirmPassword && validPassword"
                        :class="classes.checkIcon"
                     />
                     <XMarkIcon v-else :class="classes.xIcon" />
                  </span>
               </div>
               <input
                  :class="loginClasses.input"
                  type="password"
                  id="confirm"
                  autoComplete="off"
                  required
                  v-model="confirmPassword"
               />
            </div>

            <div class="md:text-right">
               <Button
                  variant="push"
                  className="leading-[26px] w-full md:w-auto mt-[20px]"
                  type="submit"
               >
                  Sign up
               </Button>
               <p className="text-[14px] mt-[20px]">
                  Already have an account ?,
                  <RouterLink class="text-[#cd1818] hover:underline ml-[4px]" to="/login">
                     Sign in</RouterLink
                  >
               </p>
            </div>
         </div>
      </form>
   </div>
</template>
