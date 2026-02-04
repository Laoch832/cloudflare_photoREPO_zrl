<template>
  <div class="font-sans text-white antialiased min-h-screen relative overflow-hidden bg-black">
    <div class="fixed inset-0 z-0">
      <div class="absolute inset-0 bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXW2-dWMIb9nb69pFxqgWF7OjEVTqxBGud9l62LjCGje6QYLW0TpLpG3jOFlHv-z5CZD60v2dvnQA8g4NcGVXQm7Ka1ZGcr_c-npxxgI4vNovr6ZqcA-z7Jc5rqgHm42d0lIEpIKHeKL6MQsJFMafHXWiOjAxvw4Be6V-G5y61K5Pk6YQPA_M4ntbSc6J2j3J_rHlx_KFT1MoLg3izPeQz_LrngZ8IAbAZzPjEDzWhGFrvUaREvZ7mbwYC0o9q1n3bvITB34XG2Ic"); filter: blur(80px) brightness(0.6); transform: scale(1.1);'></div>
      <div class="absolute inset-0 bg-black/40"></div>
    </div>
    
    <main class="relative z-10 pt-24 pb-48 h-screen overflow-y-auto custom-scrollbar">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-16 mt-8">
          <h1 class="text-5xl font-display italic text-white mb-2">Documents</h1>
          <p class="text-sm text-white/40 tracking-[0.2em] uppercase font-medium">Archives of Thought</p>
        </div>
        
        <div v-if="loading" class="flex items-center justify-center h-40">
          <div class="text-white/50">Loading documents...</div>
        </div>
        <div v-else-if="documents.length === 0" class="flex items-center justify-center h-40">
           <div class="text-white/50">No documents found.</div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="doc in documents" :key="doc.id" class="ios-glass-card p-6 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer border border-white/10">
            <div class="flex justify-between items-start mb-4">
              <div class="size-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <span class="material-symbols-outlined text-white/70 group-hover:text-white">description</span>
              </div>
              <span class="text-[10px] uppercase tracking-widest text-white/30 font-bold">{{ formatDate(doc.created_at) }}</span>
            </div>
            <h3 class="text-xl font-medium text-white mb-2 line-clamp-1">{{ doc.title }}</h3>
            <p class="text-white/50 text-sm line-clamp-3 mb-4 leading-relaxed">{{ doc.content }}</p>
            <div class="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
              <span v-for="tag in (doc.tags || []).slice(0, 3)" :key="tag" class="text-[10px] bg-white/5 px-2 py-1 rounded-md text-white/40">
                #{{ tag }}
              </span>
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

const documents = ref([])
const loading = ref(true)

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(async () => {
  try {
    // Fetch notes that are tagged as 'document' OR just all notes for now since we don't have strict differentiation
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    documents.value = data
  } catch (e) {
    console.error('Failed to load documents:', e)
    // Fallback data
    documents.value = [
      {
        id: 1,
        title: "Project Specifications",
        content: "Detailed requirements for the upcoming architectural overhaul. Key focus areas include structural integrity and aesthetic cohesion.",
        tags: ["work", "planning"],
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: "Research Notes: Quantum Mechanics",
        content: "Exploring the implications of entanglement in macroscopic systems. The bridge between classical and quantum physics remains elusive.",
        tags: ["science", "research"],
        created_at: new Date(Date.now() - 86400000 * 5).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.ios-glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.05);
}

:global(.dark) .ios-glass-card {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.1);
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
