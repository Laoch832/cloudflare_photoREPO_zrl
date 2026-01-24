<template>
  <div class="font-display bg-background-light dark:bg-background-dark text-white selection:bg-login-primary/30 min-h-screen relative flex flex-col">
    <!-- Background Layer -->
    <div class="fixed inset-0 z-0 bg-mesh" data-alt="Abstract warm sunset mesh gradient background"></div>
    <div class="relative z-10 flex min-h-screen flex-col items-center justify-center">
      <!-- Main Content -->
      <main class="flex flex-1 items-center justify-center p-6 w-full">
        <div class="glass-card w-full max-w-[440px] rounded-xl p-10 flex flex-col items-center mt-16">
          <!-- Headline -->
          <h1 class="font-serif text-4xl text-white mb-2 text-center">Welcome Back</h1>
          <p class="text-white/50 text-sm font-normal text-center mb-10">Sign in to your account</p>
          <!-- Auth Form -->
          <form class="w-full space-y-6" @submit.prevent="handleLogin">
            <!-- Email Field -->
            <div class="space-y-2">
              <label class="block text-white/80 text-sm font-medium px-1">Email Address</label>
              <input v-model="email" class="inner-shadow-input w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-login-primary/40 focus:border-login-primary transition-all text-base" placeholder="name@example.com" type="email" required/>
            </div>
            <!-- Password Field -->
            <div class="space-y-2">
              <div class="flex justify-between items-center px-1">
                <label class="block text-white/80 text-sm font-medium">Password</label>
              </div>
              <div class="relative group">
                <input v-model="password" class="inner-shadow-input w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-login-primary/40 focus:border-login-primary transition-all text-base pr-12" placeholder="••••••••" type="password" required/>
              </div>
            </div>
            
            <div v-if="errorMsg" class="text-red-400 text-sm text-center">{{ errorMsg }}</div>

            <!-- Login Button -->
            <button :disabled="loading" class="w-full bg-login-primary hover:bg-login-primary/90 text-background-dark font-bold text-base py-4 rounded-xl shadow-lg shadow-login-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50" type="submit">
              {{ loading ? 'Signing in...' : 'Login' }}
            </button>
            
            <div class="relative flex items-center justify-center w-full my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-white/10"></div>
              </div>
              <div class="relative px-4 bg-transparent text-xs text-white/40 uppercase tracking-widest bg-[#221a10]">OR</div>
            </div>

            <!-- OAuth Button -->
            <button @click.prevent="handleGithubLogin" type="button" class="w-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm py-3.5 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-3">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              Sign in with GitHub
            </button>
          </form>
        </div>
      </main>
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
const errorMsg = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (error) throw error
    
    router.push('/')
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

const handleGithubLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) throw error
  } catch (e) {
    errorMsg.value = e.message
    loading.value = false
  }
}
</script>

<style scoped>
.glass-card {
  background: rgba(24, 21, 17, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
.inner-shadow-input {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
.bg-mesh {
  background-color: #221a10;
  background-image: 
    radial-gradient(at 0% 0%, hsla(35, 90%, 55%, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 0%, hsla(20, 80%, 40%, 0.2) 0px, transparent 50%),
    radial-gradient(at 100% 100%, hsla(45, 92%, 55%, 0.15) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(15, 85%, 45%, 0.2) 0px, transparent 50%);
}
</style>
