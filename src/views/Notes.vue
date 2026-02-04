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
          <div v-for="doc in documents" :key="doc.id" 
               @click="openDocument(doc)"
               class="ios-glass-card p-6 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer border border-white/10">
            <div class="flex justify-between items-start mb-4">
              <div class="size-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <span class="material-symbols-outlined text-white/70 group-hover:text-white">description</span>
              </div>
              <span class="text-[10px] uppercase tracking-widest text-white/30 font-bold">{{ formatDate(doc.date) }}</span>
            </div>
            <h3 class="text-xl font-medium text-white mb-2 line-clamp-1">{{ doc.id }}</h3>
            <p class="text-white/50 text-sm line-clamp-3 mb-4 leading-relaxed">{{ doc.summary }}</p>
            <div class="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
              <span class="text-[10px] bg-white/5 px-2 py-1 rounded-md text-white/40">#document</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Document Viewer Modal -->
    <div v-if="selectedDoc" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="closeDocument">
      <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-2xl">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedDoc.id }}</h2>
          <button @click="closeDocument" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <span class="material-symbols-outlined text-gray-500">close</span>
          </button>
        </div>
        <div class="prose dark:prose-invert max-w-none" v-html="selectedDoc.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchJsonCached } from '../lib/fetchJsonCached'

const documents = ref([])
const loading = ref(true)
const selectedDoc = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const openDocument = (doc) => {
  selectedDoc.value = doc
}

const closeDocument = () => {
  selectedDoc.value = null
}

onMounted(async () => {
  try {
    // 从本地 notes.json 加载文档
    const data = await fetchJsonCached('/notes.json')
    documents.value = data || []
  } catch (e) {
    console.error('Failed to load documents:', e)
    documents.value = []
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

.prose {
  color: #374151;
  line-height: 1.75;
}
.prose p {
  margin-bottom: 1em;
}
:global(.dark) .prose {
  color: #d1d5db;
}
</style>
