import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Home from "@/pages/Home.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Product from "@/pages/Product.vue";
import Dashboard from "@/pages/Dashboard/Dashboard.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import DashboardProduct from "@/pages/Dashboard/DashboardProduct.vue";

const routeList = [
   {
      path: "/",
      component: Home,
   },
   {
      path: "/:category_ascii",
      component: Product,
   },
   {
      path: "/Login",
      component: Login,
      layout: AuthLayout,
   },
   {
      path: "/register",
      component: Register,
      layout: AuthLayout,
   },
   {
      path: "/dashboard",
      component: Dashboard,
      layout: DashboardLayout,
   },
   {
      path: "/dashboard/product",
      component: DashboardProduct,
      layout: DashboardLayout,
   },
];

const routes: Array<RouteRecordRaw> = [];

routeList.map((r) => {
   const routeItem = {
      path: r.path,
      component: r.layout ?? DefaultLayout,
      children: [
         {
            path: r.path,
            component: r.component,
         },
      ],
   };

   routes.push(routeItem);
});

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
});

export default router;
