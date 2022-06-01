import { RouteRecordRaw } from 'vue-router'

const chatRoutes: RouteRecordRaw[] = [
  {
    path: '/chat',
    name: 'Chat',
    component: () => import("@/views/chat/Index.vue"),
    // redirect: '/chat/login',
    children: [
      {
        path: 'login',
        name: 'ChatLogin',
        component: () => import("@/views/chat/login/Index.vue"),
      },
      {
        path: 'home',
        name: 'ChatHome',
        component: () => import("@/views/chat/home/Index.vue"),
      }
    ]
  },
]

export default chatRoutes