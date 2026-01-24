<template>
  <div class="gallery-page min-h-screen bg-[#121212] font-sans text-white/90 antialiased relative">
    <!-- Top Header Navigation (Shared Style) -->
    <header class="fixed top-0 left-0 right-0 z-50 ios-glass-nav h-16 flex items-center px-8">
      <div class="flex items-center gap-3 w-1/4">
        <router-link to="/" class="flex items-center gap-3">
          <div class="size-8 rounded-full ring-1 ring-white/20 p-0.5 overflow-hidden shadow-sm">
            <div class="w-full h-full bg-cover bg-center rounded-full" :style="{ backgroundImage: `url(${userAvatar || '/default-avatar.png'})` }"></div>
          </div>
          <span class="text-xs font-semibold tracking-widest uppercase opacity-70">Sanctum</span>
        </router-link>
      </div>
      
      <nav class="flex-1 flex justify-center items-center gap-1">
        <router-link to="/diary" class="px-5 py-1.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">Diary</router-link>
        <div class="px-5 py-1.5 rounded-full text-sm font-semibold text-white bg-white/10">Gallery</div>
        <router-link to="/notes" class="px-5 py-1.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">Notes</router-link>
        <router-link to="/music" class="px-5 py-1.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">Playlist</router-link>
      </nav>

      <div class="w-1/4 flex justify-end gap-5">
        <button class="text-white/40 hover:text-white transition-colors">
          <span class="material-symbols-outlined text-[20px]">search</span>
        </button>
        <router-link to="/profile" class="text-white/40 hover:text-white transition-colors">
          <span class="material-symbols-outlined text-[20px]">settings</span>
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-32 pb-48 px-8 max-w-7xl mx-auto">
      <div class="mb-16 space-y-4">
        <h1 class="font-serif text-5xl md:text-6xl text-white tracking-tight">Visual Echoes</h1>
        <p class="font-serif italic text-xl text-white/40 max-w-xl">
          Capturing the silence between our shared glances.
        </p>
      </div>

      <!-- Polaroid Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
        <div 
          v-for="(image, index) in images" 
          :key="image.url" 
          class="polaroid-frame-wrapper group cursor-pointer"
          @click="selectedImage = image"
        >
          <div 
            class="polaroid-frame transition-all duration-500"
            :style="{ transform: `rotate(${getRotation(index)}deg)` }"
          >
            <div class="aspect-square bg-gray-100 overflow-hidden mb-4 relative">
              <img 
                :src="image.url" 
                class="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              >
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
            </div>
            <div class="space-y-1">
              <p class="font-handwritten text-gray-800 text-2xl leading-none">{{ image.name || 'Moment' }}</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{{ formatDate(image.uploadedAt) }}</p>
            </div>
            
            <!-- Random Decorative Element (Sticker/Tape) -->
            <div v-if="index % 3 === 0" class="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/40 backdrop-blur-sm transform rotate-2 z-10"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && images.length === 0" class="py-20 text-center text-white/20 italic font-serif text-2xl">
        No visual echoes captured yet...
      </div>
    </main>

    <!-- Lightbox -->
    <div v-if="selectedImage" class="fixed inset-0 z-[100] flex items-center justify-center p-8" @click="selectedImage = null">
      <div class="absolute inset-0 bg-black/95 backdrop-blur-2xl"></div>
      <div class="relative max-w-5xl w-full max-h-full flex flex-col items-center" @click.stop>
        <img :src="selectedImage.url" class="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-sm">
        <div class="mt-8 text-center space-y-2">
          <h3 class="text-white text-3xl font-serif italic">{{ selectedImage.name }}</h3>
          <p class="text-white/40 uppercase tracking-widest text-xs font-bold">{{ formatDate(selectedImage.uploadedAt) }}</p>
        </div>
        <button @click="selectedImage = null" class="absolute -top-12 right-0 text-white/40 hover:text-white transition-colors">
          <span class="material-symbols-outlined text-3xl">close</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const images = ref([])
const loading = ref(true)
const userAvatar = ref(null)
const selectedImage = ref(null)

const fetchImages = async () => {
  try {
    const res = await fetch('/images.json')
    const data = await res.json()
    images.value = data
  } catch (e) {
    console.error('Failed to fetch images', e)
  } finally {
    loading.value = false
  }
}

const fetchUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    userAvatar.value = user.user_metadata?.avatar_url
  }
}

const getRotation = (index) => {
  const rotations = [-3, 2, -1, 3, -2, 1]
  return rotations[index % rotations.length]
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'OCT 12, 2023'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
}

onMounted(() => {
  fetchImages()
  fetchUser()
})
</script>

<style scoped>
.polaroid-frame {
  backface-visibility: hidden;
}
</style>
