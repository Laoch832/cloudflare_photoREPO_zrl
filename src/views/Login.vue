<template>
  <div class="font-display bg-background-light dark:bg-background-dark text-white selection:bg-login-primary/30 min-h-screen relative flex flex-col">
    <!-- Background Layer -->
    <div class="fixed inset-0 z-0 bg-mesh" data-alt="Abstract warm sunset mesh gradient background"></div>
    <div class="relative z-10 flex min-h-screen flex-col">
      <!-- Top Navigation Bar -->
      <header class="flex items-center justify-between px-10 py-6">
        <div class="flex items-center gap-3">
          <div class="size-8 text-login-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
              <path clip-rule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fill-rule="evenodd"></path>
            </svg>
          </div>
          <h2 class="text-white text-xl font-bold tracking-tight">CrushJournal</h2>
        </div>
        <div class="flex items-center gap-8">
          <a class="text-white/70 hover:text-white transition-colors text-sm font-medium" href="#">Help</a>
          <a class="text-white/70 hover:text-white transition-colors text-sm font-medium" href="#">About</a>
          <button class="bg-login-primary/20 hover:bg-login-primary/30 text-login-primary border border-login-primary/20 px-6 py-2 rounded-xl text-sm font-bold transition-all backdrop-blur-md">
            Support
          </button>
        </div>
      </header>
      <!-- Main Content -->
      <main class="flex flex-1 items-center justify-center p-6">
        <div class="glass-card w-full max-w-[440px] rounded-xl p-10 flex flex-col items-center">
          <!-- Headline -->
          <h1 class="font-serif text-4xl text-white mb-2 text-center">Welcome Back</h1>
          <p class="text-white/50 text-sm font-normal text-center mb-10">Your secrets are safe here.</p>
          <!-- Auth Form -->
          <form class="w-full space-y-6" @submit.prevent>
            <!-- Email Field -->
            <div class="space-y-2">
              <label class="block text-white/80 text-sm font-medium px-1">Email Address</label>
              <input class="inner-shadow-input w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-login-primary/40 focus:border-login-primary transition-all text-base" placeholder="name@example.com" type="email"/>
            </div>
            <!-- Password Field -->
            <div class="space-y-2">
              <div class="flex justify-between items-center px-1">
                <label class="block text-white/80 text-sm font-medium">Password</label>
                <a class="text-login-primary/80 hover:text-login-primary text-xs font-medium transition-colors" href="#">Forgot?</a>
              </div>
              <div class="relative group">
                <input class="inner-shadow-input w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-login-primary/40 focus:border-login-primary transition-all text-base pr-12" placeholder="••••••••" type="password"/>
                <button class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" type="button">
                  <span class="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
            </div>
            <!-- Login Button -->
            <button class="w-full bg-login-primary hover:bg-login-primary/90 text-background-dark font-bold text-base py-4 rounded-xl shadow-lg shadow-login-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]" type="submit">
              Login
            </button>
            <!-- Divider -->
            <div class="flex items-center gap-4 py-2">
              <div class="h-[1px] flex-1 bg-white/10"></div>
              <span class="text-white/20 text-xs font-bold uppercase tracking-widest">or</span>
              <div class="h-[1px] flex-1 bg-white/10"></div>
            </div>
            <!-- Magic One-Click Button -->
            <button class="w-full relative group overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-xl transition-all" type="button">
              <div class="absolute inset-0 bg-gradient-to-r from-login-primary/5 via-login-primary/10 to-login-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[20px] text-login-primary">auto_fix_high</span>
                <span class="text-white font-semibold text-base">Magic One-Click Login</span>
              </div>
            </button>
          </form>
          <!-- Footer Link -->
          <p class="mt-8 text-white/40 text-sm">
            Don't have an account? 
            <a class="text-login-primary font-bold hover:underline" href="#">Sign Up</a>
          </p>
        </div>
      </main>
      <!-- Floating Music Widget -->
      <div class="fixed bottom-10 right-10 z-50">
        <div class="glass-card flex items-center gap-4 px-5 py-3 rounded-full border border-white/10 shadow-2xl">
          <div class="size-10 rounded-full bg-login-primary/20 flex items-center justify-center overflow-hidden">
            <span class="material-symbols-outlined text-login-primary animate-pulse">music_note</span>
          </div>
          <div class="flex flex-col">
            <span class="text-white text-[13px] font-bold leading-tight">Midnight Melancholy</span>
            <span class="text-white/40 text-[11px] font-medium uppercase tracking-wider">Now Playing</span>
          </div>
          <div class="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
            <button class="text-white/60 hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[24px]">skip_previous</span>
            </button>
            <button class="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <span class="material-symbols-outlined text-[20px] fill-current">pause</span>
            </button>
            <button class="text-white/60 hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[24px]">skip_next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.glass-card {
  background: rgba(24, 21, 17, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
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
