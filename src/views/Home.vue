<template>
  <div class="home-page min-h-screen bg-black font-sans text-white/90 antialiased overflow-hidden relative">
    <!-- Atmospheric Background -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div 
        class="absolute inset-0 bg-cover bg-center scale-105 blur-[100px] opacity-70 transition-all duration-1000" 
        :style="{ backgroundImage: `url(${randomPhoto?.url || ''})` }"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      <div class="absolute inset-0 grain-texture"></div>
    </div>

    <!-- Top Header Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 ios-glass-nav h-16 flex items-center px-8">
      <div class="flex items-center gap-3 w-1/4">
        <div class="size-8 rounded-full ring-1 ring-white/20 p-0.5 overflow-hidden shadow-sm">
          <div 
            class="w-full h-full bg-cover bg-center rounded-full" 
            :style="{ backgroundImage: `url(${userAvatar || '/default-avatar.png'})` }"
          ></div>
        </div>
        <span class="text-xs font-semibold tracking-widest uppercase opacity-70">Sanctum</span>
      </div>
      
      <nav class="flex-1 flex justify-center items-center gap-1">
        <router-link to="/diary" class="px-5 py-1.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">Diary</router-link>
        <router-link to="/gallery" class="px-5 py-1.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">Gallery</router-link>
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
    <main class="relative z-10 h-screen w-full flex items-center justify-center pt-16 pb-32">
      <div class="max-w-7xl w-full px-12 grid grid-cols-12 gap-12 items-center">
        <!-- Left Text Section -->
        <div class="col-span-7 space-y-10 animate-fade-in">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="h-[1px] w-8 bg-primary/60"></span>
              <span class="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase">{{ currentDate }}</span>
            </div>
            <h1 class="font-serif italic text-7xl md:text-9xl text-white tracking-tighter leading-none opacity-95">
              Quietude
            </h1>
          </div>
          <p class="font-serif text-3xl md:text-4xl text-white/80 leading-[1.4] max-w-2xl italic">
            "A quiet afternoon, thinking of you. The light hits the floor just right today."
          </p>
          <div class="flex gap-4">
            <button @click="$router.push('/diary')" class="ios-glass-card px-8 py-4 rounded-full flex items-center gap-3 hover:bg-white/10 active:scale-95 transition-all group">
              <span class="material-symbols-outlined text-primary text-[22px] fill-current">edit_note</span>
              <span class="text-sm font-semibold tracking-wide uppercase">Write a Memory</span>
            </button>
          </div>
        </div>

        <!-- Right Photo Frame Section -->
        <div class="col-span-5 flex justify-end animate-fade-in" style="animation-delay: 0.2s">
          <div class="relative group">
            <div class="relative w-80 h-[480px] rounded-[2.5rem] overflow-hidden photo-frame transform rotate-1 group-hover:rotate-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
              <div 
                class="absolute inset-0 bg-cover bg-center" 
                :style="{ backgroundImage: `url(${randomPhoto?.url || ''})` }"
              ></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
              <div class="absolute inset-0 border border-white/10 rounded-[2.5rem]"></div>
              <div class="absolute bottom-6 left-6 right-6">
                <div class="ios-glass-card px-4 py-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <p class="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-0.5">Captivation</p>
                    <p class="text-xs font-medium">{{ randomPhoto?.name || 'Moment' }}</p>
                  </div>
                  <span class="material-symbols-outlined text-primary text-[18px] fill-current">favorite</span>
                </div>
              </div>
            </div>
            <!-- Decorative Glows -->
            <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 blur-[80px] rounded-full -z-10 animate-pulse"></div>
            <div class="absolute -top-10 -left-10 w-48 h-48 bg-purple-600/5 blur-[80px] rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabase'

const randomPhoto = ref(null)
const userAvatar = ref(null)

const currentDate = computed(() => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('en-US', options)
})

const fetchImages = async () => {
  try {
    const res = await fetch('/images.json')
    const data = await res.json()
    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length)
      randomPhoto.value = data[randomIndex]
    }
  } catch (e) {
    console.error('Failed to fetch images', e)
  }
}

const fetchUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    userAvatar.value = user.user_metadata?.avatar_url
  }
}

onMounted(() => {
  fetchImages()
  fetchUser()
})
</script>

<style scoped>
.animate-fade-in {
  opacity: 0;
  animation: fadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
