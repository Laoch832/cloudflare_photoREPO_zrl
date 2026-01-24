<template>
  <div class="min-h-screen w-full bg-[#1e1e1e] font-sans antialiased text-white flex">
    <!-- Sidebar (Same as Home) -->
    <div class="fixed left-0 top-0 h-full w-64 glass-panel flex flex-col justify-between p-6 z-50">
      <div class="flex flex-col gap-8">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-full ring-1 ring-white/20 p-0.5 overflow-hidden shadow-sm">
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
          <router-link to="/" class="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors">
            <span class="material-symbols-outlined text-[22px]">auto_stories</span>
            <p class="text-sm font-medium">Thoughts</p>
          </router-link>
          <router-link to="/gallery" class="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors">
            <span class="material-symbols-outlined text-[22px]">photo_library</span>
            <p class="text-sm font-medium">Gallery</p>
          </router-link>
          <router-link to="/diary" class="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors">
            <span class="material-symbols-outlined text-[22px]">edit_note</span>
            <p class="text-sm font-medium">Diary</p>
          </router-link>
          <router-link to="/music" class="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors">
            <span class="material-symbols-outlined text-[22px]">music_note</span>
            <p class="text-sm font-medium">Music</p>
          </router-link>
        </nav>
      </div>
      
      <div class="flex flex-col gap-4">
        <div class="h-px bg-white/10 w-full"></div>
        <div class="flex items-center gap-4 px-4 py-2 rounded-lg bg-primary/20 text-white transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[22px]">settings</span>
          <p class="text-sm font-medium">Settings</p>
        </div>
        <button @click="signOut" class="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-white/10 text-red-400 transition-colors w-full text-left">
          <span class="material-symbols-outlined text-[22px]">logout</span>
          <p class="text-sm font-medium">Sign Out</p>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 ml-64 p-12 overflow-y-auto">
      <div class="max-w-3xl mx-auto space-y-8">
        <header class="space-y-2">
          <h1 class="text-3xl font-display font-bold text-white">Profile Settings</h1>
          <p class="text-white/60">Manage your personal information and preferences.</p>
        </header>

        <!-- Profile Card -->
        <div class="glass-card-dark p-8 rounded-[2rem] space-y-8">
          <!-- Avatar -->
          <div class="flex items-center gap-6">
            <div class="relative size-24">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY" 
                   class="w-full h-full object-cover rounded-full border-2 border-white/10" alt="Avatar">
              <button class="absolute bottom-0 right-0 size-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Sanctuary User</h3>
              <p class="text-white/40 text-sm">admin@example.com</p>
            </div>
          </div>

          <!-- Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-white/60 uppercase tracking-wider">Display Name</label>
              <input type="text" value="Sanctuary User" class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-all">
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold text-white/60 uppercase tracking-wider">Username</label>
              <input type="text" value="@sanctuary" class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-all">
            </div>
            <div class="col-span-full space-y-2">
              <label class="text-xs font-bold text-white/60 uppercase tracking-wider">Bio</label>
              <textarea class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-all h-32 resize-none">Just a quiet soul capturing moments in time.</textarea>
            </div>
          </div>
          
          <div class="pt-6 border-t border-white/10 flex justify-end gap-4">
            <button class="px-6 py-2 rounded-lg text-white/60 hover:text-white transition-colors">Cancel</button>
            <button class="px-6 py-2 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">Save Changes</button>
          </div>
        </div>

        <!-- Privacy Card -->
        <div class="glass-card-dark p-8 rounded-[2rem] space-y-6">
           <h3 class="text-xl font-bold text-white">Privacy & Security</h3>
           <div class="space-y-4">
             <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
               <div>
                 <h4 class="font-medium text-white">Public Profile</h4>
                 <p class="text-sm text-white/40">Allow others to find your profile</p>
               </div>
               <div class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer bg-primary">
                  <span class="absolute left-0 inline-block w-6 h-6 transition duration-200 ease-in-out transform translate-x-6 bg-white rounded-full shadow border-2 border-primary"></span>
               </div>
             </div>
             
             <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
               <div>
                 <h4 class="font-medium text-white">Two-Factor Authentication</h4>
                 <p class="text-sm text-white/40">Add an extra layer of security</p>
               </div>
               <button class="text-sm font-medium text-primary hover:text-white transition-colors">Enable</button>
             </div>
           </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

const signOut = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>
