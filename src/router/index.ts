import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Home from "@/pages/Home.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Forbidden from "@/pages/Forbidden.vue";
import Product from "@/pages/Product.vue";
import Account from "@/pages/Account.vue";
import Dashboard from "@/pages/Dashboard/Dashboard.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import DashboardProduct from "@/pages/Dashboard/DashboardProduct.vue";
import DashboardProductDetail from "@/pages/Dashboard/ProductDetail/ProductDetail.vue";
import Category from "@/pages/Dashboard/Category/Category.vue";
import Banner from "@/pages/Dashboard/Banner.vue";
import Init from "@/pages/Dashboard/Init.vue";
import CenterLayout from "@/layouts/CenterLayout.vue";
import ProductDetail from "@/pages/ProductDetail/ProductDetail.vue";
import CartLayout from "@/layouts/CartLayout.vue";
import Cart from "@/pages/Cart/Cart.vue";
import Search from "@/pages/Search.vue";

const routeList = [
   {
      path: "/",
      component: Home,
   },
   {
      path: "/account",
      component: Account,
   },
   {
      path: "/cart",
      component: Cart,
      layout: CartLayout,
   },
   {
      path: "/search/:q",
      component: Search,
   },
   {
      path: "/:categoryAscii",
      component: Product,
   },
   {
      path: "/product/:id",
      component: ProductDetail,
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
      path: "/forbidden",
      component: Forbidden,
      layout: AuthLayout,
   },
   {
      path: "/dashboard",
      component: Dashboard,
      layout: DashboardLayout,
   },

   {
      path: "/dashboard/init",
      component: Init,
      layout: CenterLayout,
   },
   {
      path: "/dashboard/product",
      component: DashboardProduct,
      layout: DashboardLayout,
   },
   {
      path: "/dashboard/product/:id",
      component: DashboardProductDetail,
      layout: DashboardLayout,
   },
   {
      path: "/dashboard/category",
      component: Category,
      layout: DashboardLayout,
   },
   {
      path: "/dashboard/banner",
      component: Banner,
      layout: DashboardLayout,
   },
];

const routes: Array<RouteRecordRaw> = [];

routeList.map((r) => {
   const routeItem: RouteRecordRaw = {
      path: r.path,
      component: r.layout ?? DefaultLayout,
      children: [{ path: "", component: r.component }],
   };

   routes.push(routeItem);
});

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
});

export default router;
