<template>
  <header class="fixed top-0 left-0 right-0 z-50 ios-glass-nav h-16 flex items-center px-8">
    <div class="flex items-center gap-3 w-1/4">
      <div class="size-8 rounded-full ring-1 ring-white/20 p-0.5 overflow-hidden shadow-sm">
        <div class="w-full h-full bg-cover bg-center rounded-full" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY");'></div>
      </div>
      <span class="text-xs font-semibold tracking-widest uppercase opacity-70 text-white">Sanctum</span>
    </div>
    <nav class="flex-1 flex justify-center items-center gap-1">
      <router-link to="/diary" class="px-5 py-1.5 rounded-full text-sm font-medium transition-all" :class="route.path === '/diary' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'">Journal</router-link>
      <router-link to="/gallery" class="px-5 py-1.5 rounded-full text-sm font-medium transition-all" :class="route.path === '/gallery' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'">Gallery</router-link>
      <router-link to="/music" class="px-5 py-1.5 rounded-full text-sm font-medium transition-all" :class="route.path === '/music' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'">Playlist</router-link>
    </nav>
    <div class="w-1/4 flex justify-end gap-5 items-center">
      <button class="text-white/40 hover:text-white transition-colors">
        <span class="material-symbols-outlined text-[20px]">search</span>
      </button>
      
      <div v-if="user" class="flex items-center gap-3">
        <router-link to="/profile" class="size-8 rounded-full overflow-hidden border border-white/20 hover:border-white/50 transition-all">
           <img v-if="user.user_metadata.avatar_url" :src="user.user_metadata.avatar_url" alt="User" class="w-full h-full object-cover" />
           <div v-else class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold">
             {{ user.email?.[0].toUpperCase() }}
           </div>
        </router-link>
      </div>
      <router-link v-else to="/login" class="text-xs font-semibold tracking-wide uppercase text-white/70 hover:text-white transition-colors border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10">
        Login
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'

const route = useRoute()
const user = ref(null)

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
})
</script>

<style scoped>
.ios-glass-nav {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.15);
}
</style>
