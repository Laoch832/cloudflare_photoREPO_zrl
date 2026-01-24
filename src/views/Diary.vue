<template>
  <div class="font-sans text-white antialiased min-h-screen relative overflow-hidden bg-black">
    <div class="fixed inset-0 z-0">
      <div class="absolute inset-0 bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXW2-dWMIb9nb69pFxqgWF7OjEVTqxBGud9l62LjCGje6QYLW0TpLpG3jOFlHv-z5CZD60v2dvnQA8g4NcGVXQm7Ka1ZGcr_c-npxxgI4vNovr6ZqcA-z7Jc5rqgHm42d0lIEpIKHeKL6MQsJFMafHXWiOjAxvw4Be6V-G5y61K5Pk6YQPA_M4ntbSc6J2j3J_rHlx_KFT1MoLg3izPeQz_LrngZ8IAbAZzPjEDzWhGFrvUaREvZ7mbwYC0o9q1n3bvITB34XG2Ic"); filter: blur(80px) brightness(0.6); transform: scale(1.1);'></div>
      <div class="absolute inset-0 bg-black/40"></div>
    </div>
    
    <main class="relative z-10 pt-32 pb-48 h-screen overflow-y-auto custom-scrollbar">
      <div class="max-w-3xl mx-auto px-6">
        <div class="text-center mb-16">
          <h1 class="text-5xl font-display italic text-white mb-2">Cinematic Diary</h1>
          <p class="text-sm text-white/40 tracking-[0.2em] uppercase font-medium">Capturing whispers of the heart</p>
        </div>
        <div class="relative">
          <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[0.5px] timeline-line bg-white/10"></div>
          
          <div v-if="loading" class="flex items-center justify-center h-40">
            <div class="text-white/50">Loading journal...</div>
          </div>
          <div v-else-if="entries.length === 0" class="flex items-center justify-center h-40">
             <div class="text-white/50">No journal entries found.</div>
          </div>

          <div v-else class="space-y-24 relative">
            <div v-for="(entry, index) in entries" :key="entry.id" class="relative">
              <div class="absolute left-1/2 -translate-x-1/2 top-0 size-2.5 rounded-full bg-white border border-accent/40 shadow-sm z-10"></div>
              <div class="pt-8 flex flex-col items-center">
                <div class="text-center mb-6">
                  <span class="block text-2xl font-display font-medium text-white">{{ formatDate(entry.created_at).date }}</span>
                  <span class="text-[10px] uppercase tracking-widest text-white/30 font-bold">{{ formatDate(entry.created_at).day }}</span>
                </div>
                <div class="w-full ios-card rounded-ios-lg p-10 bg-white/5 backdrop-blur-md border border-white/10">
                  <div class="flex justify-between items-start mb-6">
                    <h3 class="text-xl font-medium text-white tracking-tight">{{ entry.title }}</h3>
                    <span class="material-symbols-outlined text-diary-accent text-[22px] fill-current">favorite</span>
                  </div>
                  <p class="text-white/70 leading-relaxed font-light text-[17px] mb-8 whitespace-pre-wrap">
                    {{ entry.content }}
                  </p>
                  <div class="flex items-center justify-between border-t border-white/5 pt-6">
                    <div class="flex gap-4 items-center">
                      <span class="text-[11px] font-semibold text-white/30 bg-white/5 px-2.5 py-1 rounded-full uppercase">{{ countWords(entry.content) }} words</span>
                      <span class="text-[11px] text-white/30 font-medium">{{ formatDate(entry.created_at).time }}</span>
                    </div>
                    <button class="text-diary-accent text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity">
                      Read More <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const entries = ref([])
const loading = ref(true)

const formatDate = (dateString) => {
  if (!dateString) return { date: '', day: '', time: '' }
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    day: date.toLocaleDateString('en-US', { weekday: 'long' }),
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
}

const countWords = (text) => {
  return text ? text.trim().split(/\s+/).length : 0
}

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    entries.value = data
  } catch (e) {
    console.error('Failed to load diary entries:', e)
    // Fallback data for demo if table doesn't exist
    entries.value = [
      {
        id: 1,
        title: "The Golden Hour Reflection",
        content: "Today the light hit the floor just right. I couldn't help but think about that afternoon at the cafe when we didn't say anything but everything felt understood...",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: "Midnight Echoes",
        content: "Listening to that one song on repeat. It feels like a secret soundtrack to everything I want to tell you but can't find the courage to speak...",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.ios-blur {
  backdrop-filter: blur(30px) saturate(190%);
  -webkit-backdrop-filter: blur(30px) saturate(190%);
}
.ios-card {
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.04);
}
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}
</style>
