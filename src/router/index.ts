import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Reader from '../views/Reader.vue'
import BookSelection from '../views/BookSelection.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/books'
  },
  {
    path: '/books',
    name: 'Books',
    component: BookSelection
  },
  {
    path: '/reader/:bookIndex',
    name: 'Home',
    component: Reader
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
