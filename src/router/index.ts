import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { App } from 'vue';

import chatRoutes from './chat'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/chat',
  },
  {
    path: '/2022',
    name: '2022',
    component: () => import("@/views/2022/Index.vue")
  },
  // 聊天应用路由
  ...chatRoutes
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})



export const initRouter = (app: App<Element>) => {
  app.use(router)
}