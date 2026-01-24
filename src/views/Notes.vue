<template>
  <div class="notes-page min-h-screen bg-[#F2F2F7] font-sans antialiased text-gray-900 pb-32">
    <!-- Top Navigation Pill (Shared) -->
    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto">
      <nav class="ios-glass-nav px-1.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
        <router-link to="/" class="px-5 py-2.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all">
          Home
        </router-link>
        <router-link to="/gallery" class="px-5 py-2.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all">
          Gallery
        </router-link>
        <router-link to="/diary" class="px-5 py-2.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all">
          Diary
        </router-link>
        <div class="px-6 py-2.5 rounded-full bg-white shadow-sm text-sm font-semibold text-gray-900">
          Notes
        </div>
      </nav>
    </div>

    <main class="pt-32 px-6 max-w-5xl mx-auto">
      <!-- Toolbar -->
      <div class="notes-toolbar animate-fade-in mb-12 flex justify-between items-center flex-wrap gap-6">
        <div class="toolbar-left flex items-center gap-6 flex-1">
          <h1 class="font-display text-4xl font-bold tracking-tight text-gray-900">Document Sanctuary</h1>
          <div class="search-bar ios-glass-card border-none bg-white/50 px-4 py-2 rounded-xl flex items-center flex-1 max-w-md">
            <span class="material-symbols-outlined text-gray-400 mr-3">search</span>
            <input type="text" placeholder="Search documents..." v-model="searchQuery" class="bg-transparent border-none outline-none text-sm w-full">
          </div>
        </div>
        <div class="toolbar-right">
          <button v-if="isAdmin" class="magic-gradient text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center gap-2" @click="showCreateModal = true">
            <span class="material-symbols-outlined text-[20px]">add</span> Create
          </button>
        </div>
      </div>

      <!-- Create Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 z-[2000] flex items-center justify-center p-6" @click="showCreateModal = false">
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div class="relative bg-white p-8 rounded-2xl w-full max-w-2xl shadow-2xl" @click.stop>
          <h3 class="text-xl font-bold mb-6">Capture a New Thought</h3>
          <div class="space-y-4">
            <input v-model="newNoteTitle" placeholder="Title" class="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
            <textarea v-model="newNoteContent" placeholder="Write your content here..." class="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[300px] resize-none"></textarea>
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button @click="showCreateModal = false" class="px-6 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
            <button @click="createNote" class="magic-gradient text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" :disabled="saving">
              {{ saving ? 'Saving...' : 'Publish' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Container -->
      <div class="docs-container animate-fade-in" style="animation-delay: 0.1s">
        <!-- Loading State -->
        <div v-if="loading" class="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
          <div class="animate-spin size-8 border-2 border-primary/30 border-t-primary rounded-full"></div>
          <p class="text-sm font-medium">Retrieving documents...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredNotes.length === 0" class="py-20 text-center text-gray-400">
          <span class="material-symbols-outlined text-5xl mb-4 opacity-20">description</span>
          <p class="font-serif italic text-lg">No documents found in the sanctuary...</p>
        </div>

        <!-- Document Grid -->
        <div v-else-if="!selectedNote" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="note in filteredNotes" 
            :key="note.id" 
            class="ios-glass-card bg-white p-6 rounded-[1.5rem] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-[320px]"
            @click="openNote(note)"
          >
            <div class="flex-1 overflow-hidden mask-linear-fade">
              <div class="text-gray-500 text-sm leading-relaxed font-serif whitespace-pre-wrap" v-html="note.summary"></div>
            </div>
            <div class="mt-6 pt-6 border-t border-gray-50">
              <h3 class="font-bold text-gray-900 truncate group-hover:text-primary transition-colors">{{ note.title }}</h3>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{{ formatDate(note.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Document Reader View -->
        <div v-else class="animate-fade-in">
          <div class="mb-8 flex items-center justify-between">
            <button class="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium" @click="closeNote">
              <span class="material-symbols-outlined">arrow_back</span> Back to Sanctuary
            </button>
            <button class="ios-glass-card bg-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-white/80" @click="copyShareLink">
              <span class="material-symbols-outlined text-base">share</span> Share
            </button>
          </div>
          
          <div class="ios-glass-card bg-white p-12 md:p-20 rounded-[2.5rem] shadow-sm">
            <div class="text-center mb-16 space-y-2">
              <h2 class="text-4xl font-display font-bold text-gray-900">{{ selectedNote.title }}</h2>
              <p class="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{{ formatDate(selectedNote.created_at) }}</p>
            </div>
            <div class="prose prose-lg max-w-none font-serif text-gray-800 leading-loose" v-html="selectedNote.content"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { fetchJsonCached } from '../lib/fetchJsonCached'

const loading = ref(true)
const notes = ref([])
const selectedNote = ref(null)
const searchQuery = ref('')
const isAdmin = ref(false)
const showCreateModal = ref(false)
const newNoteTitle = ref('')
const newNoteContent = ref('')
const saving = ref(false)

const filteredNotes = computed(() => {
  let result = [...notes.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.summary.toLowerCase().includes(query)
    )
  }
  return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const checkAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user && user.email === '2730377018@qq.com') {
    isAdmin.value = true
  }
}

const createNote = async () => {
  if (!newNoteTitle.value) return alert('Please enter a title')
  saving.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('notes')
      .insert({
        title: newNoteTitle.value,
        content: newNoteContent.value,
        user_id: user.id,
        is_published: true
      })
    if (error) throw error
    showCreateModal.value = false
    newNoteTitle.value = ''
    newNoteContent.value = ''
    fetchNotes()
  } catch (error) {
    alert('Failed to publish: ' + error.message)
  } finally {
    saving.value = false
  }
}

const copyShareLink = () => {
  const url = `${window.location.origin}/notes#${selectedNote.value.id}`
  navigator.clipboard.writeText(url).then(() => alert('Link copied!'))
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
}

const openNote = (note) => {
  selectedNote.value = note
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const closeNote = () => {
  selectedNote.value = null
}

const fetchNotes = async () => {
  try {
    const { data: dbNotes } = await supabase
      .from('notes')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      
    let allNotes = []
    if (dbNotes) {
      allNotes = dbNotes.map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
        summary: n.summary || n.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...',
        created_at: n.created_at
      }))
    }

    try {
      const localData = await fetchJsonCached('/notes.json')
      const mappedLocal = localData.map(n => ({
        id: n.id,
        title: n.filename ? n.filename.replace('.docx', '') : n.id,
        content: n.content,
        summary: n.summary,
        created_at: n.date
      }))
      allNotes = [...allNotes, ...mappedLocal]
    } catch (e) {
      // Ignore missing local file
    }
    
    notes.value = allNotes
    const hash = window.location.hash.substring(1)
    if (hash) {
      const found = allNotes.find(n => n.id === hash)
      if (found) openNote(found)
    }
  } catch (error) {
    console.error('Failed to fetch notes:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkAdmin()
  fetchNotes()
})
</script>

<style scoped>
.mask-linear-fade {
  mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
}
.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
