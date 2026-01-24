import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'
import Home from '../views/Home.vue'
import Gallery from '../views/Gallery.vue'
import Notes from '../views/Notes.vue'
import Diary from '../views/Diary.vue'
import Login from '../views/Login.vue'
import Music from '../views/Music.vue'
import Profile from '../views/Profile.vue'
import StitchHomeAtmosphericCinemaV1 from '../views/stitch/StitchHomeAtmosphericCinemaV1.vue'
import StitchHomeAtmosphericCinemaV2 from '../views/stitch/StitchHomeAtmosphericCinemaV2.vue'
import StitchHomeAtmosphericCinemaV3 from '../views/stitch/StitchHomeAtmosphericCinemaV3.vue'
import StitchHomeAtmosphericCinemaV4 from '../views/stitch/StitchHomeAtmosphericCinemaV4.vue'
import StitchAccountSettings from '../views/stitch/StitchAccountSettings.vue'

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
      component: Login,
      meta: { hidePlayer: true }
    },
    {
      path: '/stitch/home-1',
      name: 'stitch-home-1',
      component: StitchHomeAtmosphericCinemaV1,
      meta: { hidePlayer: true }
    },
    {
      path: '/stitch/home-2',
      name: 'stitch-home-2',
      component: StitchHomeAtmosphericCinemaV2,
      meta: { hidePlayer: true }
    },
    {
      path: '/stitch/home-3',
      name: 'stitch-home-3',
      component: StitchHomeAtmosphericCinemaV3,
      meta: { hidePlayer: true }
    },
    {
      path: '/stitch/home-4',
      name: 'stitch-home-4',
      component: StitchHomeAtmosphericCinemaV4,
      meta: { hidePlayer: true }
    },
    {
      path: '/stitch/account-settings',
      name: 'stitch-account-settings',
      component: StitchAccountSettings,
      meta: { hidePlayer: true }
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
