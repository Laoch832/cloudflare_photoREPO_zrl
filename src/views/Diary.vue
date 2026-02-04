<template>
  <div class="font-sans text-gray-900 bg-white min-h-screen relative overflow-hidden">
    <div class="fixed inset-0 z-0 bg-gray-50"></div>
    
    <main class="relative z-10 pt-24 pb-48 h-screen overflow-y-auto custom-scrollbar">
      <div class="max-w-4xl mx-auto px-6">
        <div class="text-center mb-16 mt-8">
          <h1 class="text-5xl font-serif text-gray-900 mb-2 tracking-tight">Journal</h1>
          <p class="text-sm text-gray-500 tracking-[0.2em] uppercase font-medium">Fragments of Time</p>
        </div>
        
        <div v-if="loading" class="flex items-center justify-center h-40">
          <div class="text-gray-400">Loading journal...</div>
        </div>
        <div v-else-if="entries.length === 0" class="flex items-center justify-center h-40">
           <div class="text-gray-400">No journal entries found.</div>
        </div>

        <div v-else class="space-y-12">
          <div v-for="entry in entries" :key="entry.id" class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-8 flex flex-col md:flex-row gap-8">
            <div class="md:w-32 flex-shrink-0 text-center md:text-left md:border-r md:border-gray-100 md:pr-8 flex flex-row md:flex-col justify-center md:justify-start items-center md:items-start gap-4 md:gap-1">
              <span class="text-4xl font-serif text-gray-900">{{ formatDate(entry.created_at).dayNumeric }}</span>
              <div class="flex flex-col text-xs uppercase tracking-wider text-gray-500 font-bold">
                <span>{{ formatDate(entry.created_at).month }}</span>
                <span>{{ formatDate(entry.created_at).year }}</span>
              </div>
              <span class="text-xs text-gray-400 mt-1 md:mt-2">{{ formatDate(entry.created_at).weekday }}</span>
            </div>
            
            <div class="flex-1">
              <h3 class="text-2xl font-serif text-gray-900 mb-4 leading-tight">{{ entry.title }}</h3>
              <div class="prose prose-gray max-w-none text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap font-light">
                {{ entry.content }}
              </div>
              <div class="flex items-center justify-between border-t border-gray-100 pt-6 mt-auto">
                <div class="flex gap-4 text-xs text-gray-400 font-medium uppercase tracking-wide">
                  <span>{{ countWords(entry.content) }} Words</span>
                  <span>{{ formatDate(entry.created_at).time }}</span>
                </div>
                <button class="text-gray-900 hover:text-gray-600 text-sm font-semibold flex items-center gap-1 transition-colors">
                  Read Full Entry <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
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
  if (!dateString) return {}
  const date = new Date(dateString)
  return {
    dayNumeric: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    year: date.getFullYear(),
    weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
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
    entries.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
