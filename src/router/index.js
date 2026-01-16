import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Gallery from '../views/Gallery.vue'
import Notes from '../views/Notes.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery
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

export default router
