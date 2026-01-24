<template>
  <div class="min-h-screen w-full bg-[#F2F2F7] font-sans antialiased text-gray-900 pb-32">
    <!-- Top Navigation Pill -->
    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav class="ios-glass-nav px-1.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
        <router-link to="/" class="px-5 py-2.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all">
          Home
        </router-link>
        <router-link to="/gallery" class="px-5 py-2.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all">
          Gallery
        </router-link>
        <div class="px-6 py-2.5 rounded-full bg-white shadow-sm text-sm font-semibold text-gray-900">
          Diary
        </div>
        <router-link to="/music" class="px-5 py-2.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all">
          Music
        </router-link>
      </nav>
    </div>

    <!-- Main Content -->
    <main class="pt-32 px-6 max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 space-y-2">
        <h1 class="font-display text-4xl font-bold tracking-tight text-gray-900">Cinematic Diary</h1>
        <p class="text-gray-500 font-medium tracking-wide">Capture the moments that matter</p>
      </div>

      <!-- Admin: Post New Diary -->
      <div v-if="isAdmin" class="mb-12 ios-glass-card p-6 rounded-[1.5rem] bg-white shadow-sm border border-white/40">
        <div class="flex items-center gap-3 mb-4">
          <div class="size-8 rounded-full bg-diary-accent/10 flex items-center justify-center text-diary-accent">
            <span class="material-symbols-outlined text-lg">edit</span>
          </div>
          <h3 class="font-semibold text-gray-900">Write a Memory</h3>
        </div>
        <div class="space-y-4">
          <input v-model="newTitle" type="text" placeholder="Title (Optional)" class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-diary-accent/20 transition-all">
          <textarea 
            v-model="newContent" 
            placeholder="What happened today?" 
            class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-diary-accent/20 transition-all min-h-[120px] resize-none"
          ></textarea>
          <div class="flex justify-end">
            <button class="bg-diary-accent text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-diary-accent/20 hover:shadow-diary-accent/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" @click="publishDiary" :disabled="publishing">
              <span v-if="publishing" class="animate-spin size-4 border-2 border-white/30 border-t-white rounded-full"></span>
              {{ publishing ? 'Publishing...' : 'Publish' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="relative pl-8 border-l-2 border-gray-200 space-y-12">
        <!-- Loading State -->
        <div v-if="loading" class="py-12 flex justify-center">
          <div class="animate-spin size-8 border-2 border-diary-accent/30 border-t-diary-accent rounded-full"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="notes.length === 0" class="py-12 text-center text-gray-400">
          <span class="material-symbols-outlined text-4xl mb-2">auto_stories</span>
          <p>No memories yet. Start writing...</p>
        </div>

        <!-- Diary Entries -->
        <div 
          v-else
          v-for="(note, index) in notes" 
          :key="note.id" 
          class="relative group animate-fade-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- Timeline Dot -->
          <div class="absolute -left-[41px] top-6 size-5 rounded-full bg-white border-4 border-diary-accent shadow-sm group-hover:scale-110 transition-transform"></div>
          
          <!-- Card -->
          <div class="ios-glass-card p-6 rounded-[1.5rem] bg-white hover:bg-white/80 transition-all duration-300 hover:shadow-md border border-white/40 group-hover:-translate-y-1">
            <div class="flex items-start justify-between mb-3">
              <div class="space-y-1">
                <span class="text-xs font-bold text-diary-accent uppercase tracking-wider">{{ formatDateFull(note.created_at) }}</span>
                <h2 v-if="note.title" class="text-xl font-bold text-gray-900 leading-tight">{{ note.title }}</h2>
                <h2 v-else class="text-xl font-bold text-gray-900 leading-tight">Untitled Memory</h2>
              </div>
              <button v-if="isAdmin" @click="deleteDiary(note.id)" class="text-gray-300 hover:text-red-400 transition-colors p-1">
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
            
            <div class="text-gray-600 leading-relaxed mb-4 line-clamp-4 whitespace-pre-wrap font-serif">
              {{ note.content }}
            </div>
            
            <div class="flex items-center gap-4 pt-4 border-t border-gray-100">
              <button class="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-diary-accent transition-colors">
                <span class="material-symbols-outlined text-base">visibility</span>
                <span>Read</span>
              </button>
              <div class="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <span class="material-symbols-outlined text-base">schedule</span>
                <span>{{ formatTime(note.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Floating Action Button (Mobile) -->
    <div class="fixed bottom-24 right-6 md:hidden z-40">
      <button v-if="isAdmin" @click="scrollToTop" class="size-14 rounded-full bg-diary-accent text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all">
        <span class="material-symbols-outlined text-2xl">edit</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../lib/supabase'

const notes = ref([])
const loading = ref(true)
const isAdmin = ref(false)
const publishing = ref(false)
const newTitle = ref('')
const newContent = ref('')

let authListener = null

// Check Admin
const checkAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user && user.email === '2730377018@qq.com') {
    isAdmin.value = true
  } else {
    isAdmin.value = false
  }
}

// Fetch Diaries
const fetchNotes = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      
    if (error) throw error
    notes.value = data || []
  } catch (error) {
    console.error('Error fetching notes:', error)
  } finally {
    loading.value = false
  }
}

// Publish Diary
const publishDiary = async () => {
  if (!newContent.value.trim()) return alert('Please write something...')
  
  try {
    publishing.value = true
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('notes')
      .insert({
        title: newTitle.value,
        content: newContent.value,
        user_id: user.id,
        is_published: true
      })

    if (error) throw error
    
    // Reset form
    newTitle.value = ''
    newContent.value = ''
    
    // Refresh list
    await fetchNotes()
  } catch (error) {
    alert('Failed to publish: ' + error.message)
  } finally {
    publishing.value = false
  }
}

// Delete Diary
const deleteDiary = async (id) => {
  if (!confirm('Are you sure you want to delete this memory?')) return
  
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      
    if (error) throw error
    
    // Remove locally
    notes.value = notes.value.filter(n => n.id !== id)
  } catch (error) {
    alert('Delete failed: ' + error.message)
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Formatters
const formatDateFull = (dateStr) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('en-US', options)
}

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  checkAdmin()
  fetchNotes()
  
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user?.email === '2730377018@qq.com') {
      isAdmin.value = true
    } else {
      isAdmin.value = false
    }
  })
  authListener = data.subscription
})

onUnmounted(() => {
  if (authListener) authListener.unsubscribe()
})
</script>
