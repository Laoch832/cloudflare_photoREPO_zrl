<template>
  <div class="home-page bg-black font-sans text-white/90 antialiased overflow-hidden h-screen w-full relative">
    <!-- Atmospheric Background -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute inset-0 bg-cover bg-center scale-105 blur-[100px] opacity-70" 
           style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXW2-dWMIb9nb69pFxqgWF7OjEVTqxBGud9l62LjCGje6QYLW0TpLpG3jOFlHv-z5CZD60v2dvnQA8g4NcGVXQm7Ka1ZGcr_c-npxxgI4vNovr6ZqcA-z7Jc5rqgHm42d0lIEpIKHeKL6MQsJFMafHXWiOjAxvw4Be6V-G5y61K5Pk6YQPA_M4ntbSc6J2j3J_rHlx_KFT1MoLg3izPeQz_LrngZ8IAbAZzPjEDzWhGFrvUaREvZ7mbwYC0o9q1n3bvITB34XG2Ic');">
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      <div class="absolute inset-0 grain-overlay"></div>
    </div>

    <!-- Main Layout Container -->
    <div class="relative z-10 flex h-full w-full">
      <!-- Minimalist Sidebar (Hover Trigger) -->
      <div class="sidebar-trigger group fixed left-0 top-0 h-full w-24 flex items-center justify-center z-50">
        <div class="sidebar-content glass-panel h-[90vh] w-64 rounded-xl ml-4 flex flex-col justify-between p-6 text-white shadow-2xl">
          <div class="flex flex-col gap-8">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-full ring-1 ring-white/20 p-0.5 overflow-hidden shadow-sm">
                <div class="w-full h-full bg-cover bg-center rounded-full" 
                     style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY');">
                </div>
              </div>
              <div class="flex flex-col">
                <h2 class="text-white text-lg font-medium leading-tight">Sanctuary</h2>
                <p class="text-white/60 text-xs uppercase tracking-widest">Private Space</p>
              </div>
            </div>
            
            <nav class="flex flex-col gap-2">
              <router-link to="/notes" class="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors" active-class="bg-primary/20 text-white">
                <span class="material-symbols-outlined text-[22px]">auto_stories</span>
                <p class="text-sm font-medium">Thoughts</p>
              </router-link>
              <router-link to="/gallery" class="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors" active-class="bg-primary/20 text-white">
                <span class="material-symbols-outlined text-[22px]">photo_library</span>
                <p class="text-sm font-medium">Gallery</p>
              </router-link>
              <router-link to="/diary" class="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors" active-class="bg-primary/20 text-white">
                <span class="material-symbols-outlined text-[22px]">edit_note</span>
                <p class="text-sm font-medium">Diary</p>
              </router-link>
              <router-link to="/music" class="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors" active-class="bg-primary/20 text-white">
                <span class="material-symbols-outlined text-[22px]">music_note</span>
                <p class="text-sm font-medium">Music</p>
              </router-link>
            </nav>
          </div>
          
          <div class="flex flex-col gap-4">
            <div class="h-px bg-white/10 w-full"></div>
            <router-link to="/profile" class="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-white/10 text-white/80 transition-colors">
              <span class="material-symbols-outlined text-[22px]">settings</span>
              <p class="text-sm font-medium">Settings</p>
            </router-link>
          </div>
        </div>
        
        <!-- Decorative Indicator -->
        <div class="absolute left-4 top-1/2 -translate-y-1/2 group-hover:opacity-0 transition-opacity">
          <div class="w-1 h-12 bg-white/40 rounded-full"></div>
        </div>
      </div>

      <!-- Center Stage Content -->
      <main class="flex-1 flex flex-col items-center justify-center p-8">
        <div class="max-w-7xl w-full px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div class="col-span-1 md:col-span-7 space-y-10">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <span class="h-[1px] w-8 bg-primary/60"></span>
                <span class="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase">{{ currentDate }}</span>
              </div>
              <h1 class="font-serif italic text-7xl md:text-9xl text-white tracking-tighter leading-none opacity-95">
                Quietude
              </h1>
            </div>
            <p class="font-serif text-3xl md:text-4xl text-white/80 leading-[1.4] max-w-2xl">
              "A quiet afternoon, thinking of you. The light hits the floor just right today."
            </p>
            <div class="flex gap-4">
              <button @click="$router.push('/diary')" class="glass-panel px-8 py-4 rounded-full flex items-center gap-3 hover:bg-white/10 active:scale-95 transition-all group cursor-pointer">
                <span class="material-symbols-outlined text-primary text-[22px] fill-current">edit_note</span>
                <span class="text-sm font-semibold tracking-wide">Write a Memory</span>
              </button>
            </div>
          </div>
          
          <div class="col-span-1 md:col-span-5 flex justify-center md:justify-end">
            <div class="relative group">
              <div class="relative w-80 h-[480px] rounded-[2.5rem] overflow-hidden photo-frame transform rotate-1 group-hover:rotate-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <div class="absolute inset-0 bg-cover bg-center" 
                     :style="{ backgroundImage: `url(${randomPhoto?.url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY'})` }"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                <div class="absolute inset-0 border border-white/10 rounded-[2.5rem]"></div>
                <div class="absolute bottom-6 left-6 right-6">
                  <div class="glass-panel px-4 py-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <p class="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-0.5">Captivation</p>
                      <p class="text-xs font-medium">Summer Afternoon</p>
                    </div>
                    <span class="material-symbols-outlined text-primary text-[18px] fill-current">favorite</span>
                  </div>
                </div>
              </div>
              <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 blur-[80px] rounded-full -z-10 animate-pulse-slow"></div>
              <div class="absolute -top-10 -left-10 w-48 h-48 bg-white/5 blur-[80px] rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </main>

      <!-- Corner Decorative Controls -->
      <div class="fixed top-8 right-8 flex gap-4 z-50">
        <button class="size-10 rounded-full glass-panel flex items-center justify-center text-white/80 hover:text-white transition-colors" title="Change Mood">
          <span class="material-symbols-outlined text-[20px]">filter_vintage</span>
        </button>
        <button class="size-10 rounded-full glass-panel flex items-center justify-center text-white/80 hover:text-white transition-colors" title="Fullscreen">
          <span class="material-symbols-outlined text-[20px]">fullscreen</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchJsonCached } from '../lib/fetchJsonCached'

const randomPhoto = ref(null)

const currentDate = computed(() => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('en-US', options)
})

const fetchImages = async () => {
  try {
    const data = await fetchJsonCached('/images.json')
    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length)
      randomPhoto.value = data[randomIndex]
    }
  } catch (e) {
    console.error('Failed to fetch images', e)
  }
}

onMounted(() => {
  fetchImages()
})
</script>

<style scoped>
.sidebar-trigger:hover .sidebar-content {
  transform: translateX(0);
  opacity: 1;
}

.sidebar-content {
  transform: translateX(-20px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
