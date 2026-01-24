import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { supabase } from '../lib/supabase'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('../views/Gallery.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('../views/Notes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/diary',
    name: 'Diary',
    component: () => import('../views/Diary.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/music',
    name: 'Music',
    component: () => import('../views/Music.vue'),
    meta: { hidePlayer: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { hidePlayer: true, hideChrome: true }
  },
  {
    path: '/stitch/home-1',
    name: 'StitchHomeAtmosphericCinemaV1',
    component: () => import('../views/stitch/stitchhomeatmosphericcinemav1.vue'),
    meta: { hidePlayer: true, hideChrome: true }
  },
  {
    path: '/stitch/home-2',
    name: 'StitchHomeAtmosphericCinemaV2',
    component: () => import('../views/stitch/stitchhomeatmosphericcinemav2.vue'),
    meta: { hidePlayer: true, hideChrome: true }
  },
  {
    path: '/stitch/home-3',
    name: 'StitchHomeAtmosphericCinemaV3',
    component: () => import('../views/stitch/stitchhomeatmosphericcinemav3.vue'),
    meta: { hidePlayer: true, hideChrome: true }
  },
  {
    path: '/stitch/home-4',
    name: 'StitchHomeAtmosphericCinemaV4',
    component: () => import('../views/stitch/stitchhomeatmosphericcinemav4.vue'),
    meta: { hidePlayer: true, hideChrome: true }
  },
  {
    path: '/stitch/account-settings',
    name: 'StitchAccountSettings',
    component: () => import('../views/stitch/stitchaccountsettings.vue'),
    meta: { hidePlayer: true, hideChrome: true }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('../views/AuthCallback.vue')
  },
  {
    path: '/manager',
    name: 'Manager',
    component: () => import('../views/Manager.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/temp',
    name: 'TempImage',
    component: () => import('../views/TempImage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      next('/music')
      return
    }
  }
  next()
})

export default router
