<template>
  <div class="login-page deep-artistic-bg min-h-screen flex items-center justify-center p-6 font-sans text-white/90 selection:bg-primary/30 relative overflow-hidden">
    <!-- Decorative Glows -->
    <div class="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="fixed bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
    
    <div class="w-full max-w-[440px] z-10 animate-fade-in">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center size-14 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-xl">
          <span class="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
        </div>
        <h2 class="font-serif text-4xl text-white font-light mb-3">Sanctum</h2>
        <p class="text-white/40 text-[11px] uppercase tracking-[0.25em] font-light">Enter your private digital world</p>
      </div>

      <div class="glass-card rounded-ios p-10 space-y-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-white/40 text-[10px] font-semibold uppercase tracking-widest px-1">Email Address</label>
            <input 
              v-model="email"
              type="email" 
              placeholder="name@example.com"
              required
              class="w-full ios-input rounded-ios-inner h-[54px] px-5 text-white focus:outline-none text-[15px] placeholder:text-white/10"
            >
          </div>

          <div class="space-y-2">
            <div class="flex justify-between px-1">
              <label class="block text-white/40 text-[10px] font-semibold uppercase tracking-widest">Password</label>
              <a href="#" class="text-[10px] text-primary/60 hover:text-primary transition-colors uppercase tracking-widest font-bold">Forgot?</a>
            </div>
            <input 
              v-model="password"
              type="password" 
              placeholder="••••••••"
              required
              class="w-full ios-input rounded-ios-inner h-[54px] px-5 text-white focus:outline-none text-[15px] placeholder:text-white/10"
            >
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full magic-gradient h-[54px] rounded-ios-inner text-white font-bold text-[15px] transition-all active:scale-[0.98] shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="animate-spin size-4 border-2 border-white/30 border-t-white rounded-full"></span>
            {{ loading ? 'Accessing...' : 'Sign In' }}
          </button>
        </form>

        <div class="relative flex py-2 items-center">
          <div class="flex-grow border-t border-white/5"></div>
          <span class="flex-shrink-0 mx-4 text-[10px] text-white/20 uppercase tracking-widest font-bold">Limited Access</span>
          <div class="flex-grow border-t border-white/5"></div>
        </div>

        <p class="text-center text-[12px] text-white/30">
          Don't have an invite? <a href="#" class="text-primary/60 hover:text-primary transition-colors font-medium">Request Access</a>
        </p>
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

<style scoped>
.animate-fade-in {
  opacity: 0;
  animation: fadeIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
