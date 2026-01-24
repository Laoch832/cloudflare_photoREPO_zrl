import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Music from '../views/Music.vue'
import Gallery from '../views/Gallery.vue'
import Diary from '../views/Diary.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { hideChrome: true, hidePlayer: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { hideChrome: true }
  },
  {
    path: '/music',
    name: 'Music',
    component: Music
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery
  },
  {
    path: '/diary',
    name: 'Diary',
    component: Diary
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
