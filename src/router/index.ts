import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/Home.vue'
import AboutVue from '@/pages/About.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutVue
    },
  ]
})

export default router
