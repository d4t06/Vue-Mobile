import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Home from "@/pages/Home.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Login from "@/pages/Login.vue";

const routes: Array<RouteRecordRaw> = [
   {
      path: "/",
      component: DefaultLayout,
      children: [
         {
            path: "/",
            component: Home,
         },
      ],
   },
   {
      path: "/login",
      component: AuthLayout,
      children: [
         {
            path: "/login",
            component: Login,
         },
      ],
   },
   {
      path: "/:category_ascii",
      component: DefaultLayout,
      children: [
         {
            path: "/:category_ascii",
            component: import("@/pages/Product.vue"),
         },
      ],
   },
];

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
});

export default router;
