<template>
  <header class="fixed top-0 left-0 right-0 z-50 ios-glass-nav h-16 flex items-center justify-between px-8 transition-all duration-300">
    <!-- Left: Logo & Title -->
    <div class="flex items-center gap-4 min-w-max">
      <div class="size-9 rounded-full ring-1 ring-white/20 p-0.5 overflow-hidden shadow-sm shrink-0">
        <div class="w-full h-full bg-cover bg-center rounded-full" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY");'></div>
      </div>
      <span class="text-lg font-bold tracking-widest text-white font-serif uppercase">朝夕藏念</span>
    </div>

    <!-- Right: Nav Links + User + Theme -->
    <div class="flex items-center gap-6 md:gap-8">
      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center gap-2">
        <router-link to="/" class="nav-link" active-class="active">首页</router-link>
        <router-link to="/gallery" class="nav-link" active-class="active">图库</router-link>
        <router-link to="/diary" class="nav-link" active-class="active">日记</router-link>
        <router-link to="/notes" class="nav-link" active-class="active">文档</router-link>
        <router-link to="/music" class="nav-link" active-class="active">音乐</router-link>
      </nav>

      <div class="h-4 w-[1px] bg-white/20 hidden md:block"></div>

      <!-- User / Login -->
      <div v-if="user" class="flex items-center gap-3">
        <span class="hidden lg:block text-xs font-medium text-white/80 tracking-wide">{{ user.user_metadata.full_name || user.email.split('@')[0] }}</span>
        <router-link to="/profile" class="size-9 rounded-full overflow-hidden border border-white/20 hover:border-white/50 transition-all shadow-sm">
           <img v-if="user.user_metadata.avatar_url" :src="user.user_metadata.avatar_url" alt="User" class="w-full h-full object-cover" />
           <div v-else class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
             {{ user.email?.[0].toUpperCase() }}
           </div>
        </router-link>
      </div>
      <router-link v-else to="/login" class="text-xs font-bold tracking-wider uppercase text-white/90 hover:text-white transition-colors border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-md">
        登录
      </router-link>

      <!-- Theme Toggle -->
      <button @click="toggleTheme" class="text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
        <span class="material-symbols-outlined text-[22px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'

const route = useRoute()
const user = ref(null)
const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
  
  if (document.documentElement.classList.contains('dark')) {
    isDark.value = true
  }
})
</script>

<style scoped>
.ios-glass-nav {
  background: rgba(18, 18, 18, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.08);
}

.nav-link {
  @apply px-4 py-1.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all;
}

.nav-link.active {
  @apply bg-white/10 text-white font-semibold;
}
</style>
