<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-mesh font-sans antialiased relative overflow-hidden text-white">
    <!-- Grain Overlay -->
    <div class="grain-overlay"></div>

    <!-- Main Card -->
    <div class="relative z-10 w-full max-w-md p-8 glass-card-dark rounded-[2rem] flex flex-col gap-8 transform transition-all duration-500 hover:scale-[1.01]">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 mb-4 shadow-lg">
          <span class="material-symbols-outlined text-3xl text-login-primary">lock</span>
        </div>
        <h1 class="font-display text-3xl font-bold tracking-tight text-white">Sanctum</h1>
        <p class="text-white/40 text-sm font-medium tracking-wide uppercase">Enter your private space</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div class="space-y-1">
          <label class="text-xs font-semibold text-white/60 ml-1 uppercase tracking-wider">Email</label>
          <div class="relative group">
            <input 
              v-model="email"
              type="email" 
              placeholder="you@example.com"
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-login-primary/50 focus:bg-black/30 transition-all inner-shadow-input"
            >
            <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-login-primary/80 transition-colors">mail</span>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-semibold text-white/60 ml-1 uppercase tracking-wider">Password</label>
          <div class="relative group">
            <input 
              v-model="password"
              type="password" 
              placeholder="••••••••"
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-login-primary/50 focus:bg-black/30 transition-all inner-shadow-input"
            >
            <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-login-primary/80 transition-colors">key</span>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-white/40 px-1">
          <label class="flex items-center gap-2 cursor-pointer hover:text-white/60 transition-colors">
            <input type="checkbox" class="rounded border-white/20 bg-white/5 text-login-primary focus:ring-offset-0 focus:ring-0">
            <span>Remember me</span>
          </label>
          <a href="#" class="hover:text-login-primary transition-colors">Forgot Password?</a>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold tracking-wide shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <!-- Divider -->
      <div class="relative flex py-2 items-center">
        <div class="flex-grow border-t border-white/10"></div>
        <span class="flex-shrink-0 mx-4 text-white/30 text-xs font-medium uppercase tracking-widest">Or continue with</span>
        <div class="flex-grow border-t border-white/10"></div>
      </div>

      <!-- Social -->
      <div class="grid grid-cols-2 gap-4">
        <button class="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
          <span class="material-symbols-outlined text-white/60 group-hover:text-white">g_mobiledata</span>
          <span class="text-sm font-medium text-white/60 group-hover:text-white">Google</span>
        </button>
        <button class="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
          <span class="material-symbols-outlined text-white/60 group-hover:text-white">apple</span>
          <span class="text-sm font-medium text-white/60 group-hover:text-white">Apple</span>
        </button>
      </div>
      
      <!-- Footer -->
      <p class="text-center text-xs text-white/30 mt-4">
        Don't have access? <a href="#" class="text-login-primary hover:underline">Request invite</a>
      </p>
    </div>

    <!-- Music Widget (Decorative or Functional) -->
    <div class="absolute bottom-8 right-8 glass-panel rounded-full px-4 py-2 flex items-center gap-3 animate-fade-in opacity-0" style="animation-delay: 0.5s; animation-fill-mode: forwards;">
      <div class="size-8 rounded-full bg-white/10 flex items-center justify-center">
        <span class="material-symbols-outlined text-sm">music_note</span>
      </div>
      <div class="flex flex-col">
        <span class="text-xs font-bold text-white">Midnight City</span>
        <span class="text-[10px] text-white/50">M83</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (error) throw error
    
    router.push('/')
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>
