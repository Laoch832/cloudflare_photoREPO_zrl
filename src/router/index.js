import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'
import Home from '../views/Home.vue'
import Gallery from '../views/Gallery.vue'
import Notes from '../views/Notes.vue'
import Diary from '../views/Diary.vue'
import Login from '../views/Login.vue'
import Music from '../views/Music.vue'
import Profile from '../views/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: Gallery
    },
    {
      path: '/notes',
      name: 'notes',
      component: Notes
    },
    {
      path: '/diary',
      name: 'diary',
      component: Diary
    },
    {
      path: '/music',
      name: 'music',
      component: Music
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

// Auth Guard
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    next('/login')
    return
  }

  if (to.path === '/login' && session) {
    next('/')
    return
  }

  next()
})

export default router
