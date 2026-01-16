<template>
  <div class="container">
    <div class="section-card">
      <h1>笔记</h1>
      
      <!-- Note Detail View -->
      <div id="note-detail" class="note-detail" v-if="selectedNote">
        <a href="#" class="back-link" @click.prevent="selectedNote = null">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>返回笔记列表
        </a>
        <div class="note-detail-content">
          <h3>{{ selectedNote.filename.replace('.docx', '') }}</h3>
          <div class="note-date">{{ selectedNote.date }}</div>
          <div style="margin-top: 24px;" v-html="selectedNote.content"></div>
        </div>
      </div>
      
      <!-- Notes List View -->
      <div id="notes-list" class="notes-list" v-else>
        <div v-if="loading" style="text-align: center; color: var(--secondary-text);">Loading...</div>
        <div v-else-if="notes.length === 0" style="text-align: center; color: var(--secondary-text);">暂无笔记</div>
        <div 
          v-for="note in sortedNotes" 
          :key="note.id" 
          class="note-item ripple"
          @click="selectedNote = note"
        >
          <div class="note-date">{{ note.date }}</div>
          <div class="note-title">{{ note.filename.replace('.docx', '') }}</div>
          <div class="note-summary">{{ note.summary }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'

const loading = ref(true)
const notes = ref([])
const selectedNote = ref(null)

// Sort notes by date descending
const sortedNotes = computed(() => {
  return [...notes.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Fetch notes data
const fetchNotes = async () => {
  try {
    const response = await fetch('/notes.json')
    const data = await response.json()
    notes.value = data
    
    // Check if we need to show a specific note based on hash
    const hash = window.location.hash
    if (hash) {
      const noteId = hash.substring(1)
      const note = data.find(n => n.id === noteId)
      if (note) {
        selectedNote.value = note
      }
    }
  } catch (error) {
    console.error('Failed to load notes:', error)
  } finally {
    loading.value = false
  }
}

// Watch hash changes
const handleHashChange = () => {
  const hash = window.location.hash
  if (hash) {
    const noteId = hash.substring(1)
    const note = notes.value.find(n => n.id === noteId)
    if (note) {
      selectedNote.value = note
    }
  } else {
    selectedNote.value = null
  }
}

// Watch selectedNote changes and update hash
watch(selectedNote, (newNote) => {
  if (newNote) {
    window.location.hash = newNote.id
  } else {
    window.location.hash = ''
  }
})

// Initialize component
onMounted(() => {
  fetchNotes()
  window.addEventListener('hashchange', handleHashChange)
})

// Cleanup event listener
onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 100px auto 40px;
  padding: 0 24px;
}

.section-card {
  background: var(--card-bg);
  padding: 32px;
  border-radius: var(--md-sys-shape-corner-large);
  margin-bottom: 32px;
  /* Soft shadow for elevation */
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid transparent; /* Prepare for outline */
}

h1 {
  font-size: 32px;
  margin-bottom: 16px;
  font-weight: 400;
  color: var(--text-color);
}

h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: var(--md-sys-color-primary);
  font-weight: 500;
}

h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: var(--md-sys-color-on-surface);
  font-weight: 500;
  margin-top: 0;
}

p {
  line-height: 1.6;
  color: var(--secondary-text);
  margin-bottom: 16px;
}

/* Notes List */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.note-item {
  padding: 24px;
  background: var(--bg-color);
  border-radius: var(--md-sys-shape-corner-medium);
  border-left: 4px solid var(--md-sys-color-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
  cursor: pointer;
}

.note-item:hover {
  background: var(--md-sys-color-surface-variant);
  transform: translateY(-2px);
}

.note-date {
  font-size: 14px;
  color: var(--secondary-text);
  margin-bottom: 8px;
  font-weight: 500;
}

.note-title {
  font-size: 18px;
  color: var(--text-color);
  margin-bottom: 12px;
  font-weight: 600;
}

.note-summary {
  font-size: 14px;
  color: var(--secondary-text);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Note Detail */
.note-detail {
  display: block;
}

.note-detail-content {
  background: var(--bg-color);
  padding: 24px;
  border-radius: var(--md-sys-shape-corner-medium);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-top: 16px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--md-sys-color-primary);
  font-weight: 500;
  margin-bottom: 16px;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.2s;
}

.back-link:hover {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

/* Ripple Effect */
.ripple {
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}
.ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .5s, opacity 1s;
}
.ripple:active:after {
  transform: scale(0, 0);
  opacity: .2;
  transition: 0s;
}
</style>
