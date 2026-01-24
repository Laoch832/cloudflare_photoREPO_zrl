import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Music from '../views/Music.vue'
import Gallery from '../views/Gallery.vue'
import Diary from '../views/Diary.vue'
import Files from '../views/Files.vue'
import Notes from '../views/Notes.vue'

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
    meta: { hideChrome: false, hidePlayer: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { hideChrome: true, requiresAuth: true }
  },
  {
    path: '/files',
    name: 'Files',
    component: Files,
    meta: { requiresAuth: true }
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
  },
  {
    path: '/notes',
    name: 'Notes',
    component: Notes
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth Guard
import { supabase } from '../lib/supabase'

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      next('/login')
      return
    }
  }
  next()
})

export default router
