<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";
import { useAuthStore } from "@/stores/auth";
import { publicRequest } from "@/utils/request";
import { CheckIcon, XMarkIcon } from "@heroicons/vue/16/solid";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

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

const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async (e: Event) => {
   e.preventDefault();
   try {
      isSubmit.value = true;

      const res = await publicRequest.post(REGISTER_URL, {
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
   container:
      "rounded-[24px]  md:flex-grow ml-0 mr-0 my-auto md:ml-[200px] md:mr-[200px] bg-white p-[20px]",
   form: "flex flex-col md:flex-row justify-between",
   right: "space-y-[16px] mt-[20px] md:mt-0",
   inputGroup: "flex flex-col space-y-[2px]",
   labelGroup: "flex items-center space-x-[4px]",
   label: "text-[#000]",
   input: "py-[4px] rounded-[6px] border border-black/15 outline-none px-[10px]",
   checkIcon: "text-emerald-500 w-[24px]",
   xIcon: "text-red-500 w-[24px]",
   errorMessage: "bg-red-500/30 text-red-500 p-[6px] rounded-[6px] inline-block",
};
</script>

<template>
   <div :class="classes.container">
      <form
         :class="`${classes.form} ${isSubmit ? ' opacity-60 pointer-events-none' : ''}`"
         @submit="handleSubmit"
      >
         <div class="left text-center md:text-left space-y-[10px]">
            <h1 class="text-[26px] font-[500]" to="/">
               HD <span class="text-[#cd1818]">Mobile</span>
            </h1>
            <h2 class="text-[22px]">Sign up</h2>
            <p v-if="errorMsg" :class="classes.errorMessage">{{ errorMsg }}</p>
         </div>
         <div :class="classes.right">
            <div :class="classes.inputGroup">
               <div :class="classes.labelGroup">
                  <label :class="classes.label" htmlFor="username">Username</label>
                  <span v-if="username">
                     <CheckIcon v-if="validName" :class="classes.checkIcon" />
                     <XMarkIcon v-else :class="classes.xIcon" />
                  </span>
               </div>
               <input
                  :class="classes.input"
                  ref="{userInputRef}"
                  id="username"
                  autoComplete="off"
                  type="text"
                  placeholder="example..."
                  required
                  v-model="username"
               />
            </div>
            <div :class="classes.inputGroup">
               <div :class="classes.labelGroup">
                  <label :class="classes.label" htmlFor="password">Password</label>
                  <span v-if="password">
                     <CheckIcon v-if="validPassword" :class="classes.checkIcon" />
                     <XMarkIcon v-else :class="classes.xIcon" />
                  </span>
               </div>
               <input
                  :class="classes.input"
                  type="password"
                  id="password"
                  autoComplete="off"
                  required
                  v-model="password"
               />
            </div>

            <div :class="classes.inputGroup">
               <div :class="classes.labelGroup">
                  <label :class="classes.label" htmlFor="confirm">Confirm password</label>
                  <span v-if="confirmPassword">
                     <CheckIcon
                        v-if="validConfirmPassword && validPassword"
                        :class="classes.checkIcon"
                     />
                     <XMarkIcon v-else :class="classes.xIcon" />
                  </span>
               </div>
               <input
                  :class="classes.input"
                  type="password"
                  id="confirm"
                  autoComplete="off"
                  required
                  v-model="confirmPassword"
               />
            </div>


            <div class="md:text-right space-y-[10px]">
            <Button
               rounded="max"
               variant="push"
               className="leading-[26px] w-full md:w-auto"
               type="submit"
            >
               Sign up
            </Button>
            <p className="text-[14px]">
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
