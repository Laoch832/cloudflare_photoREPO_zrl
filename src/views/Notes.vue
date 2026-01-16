<template>
  <div class="notes-page container">
    <div class="header fade-in">
      <h1 class="cursive page-title">心事日记</h1>
      <p class="subtitle">写给你的，也是写给我的</p>
    </div>

    <div class="notes-container fade-in" style="animation-delay: 0.2s">
      <!-- Notes List (Sidebar) -->
      <div class="notes-sidebar" :class="{ 'mobile-hidden': selectedNote && isMobile }">
        <div v-if="loading" class="loading-text">正在整理心绪...</div>
        <div v-else-if="notes.length === 0" class="empty-text">还没有写下心事...</div>
        
        <div 
          v-else
          v-for="note in sortedNotes" 
          :key="note.id" 
          class="note-item"
          :class="{ active: selectedNote && selectedNote.id === note.id }"
          @click="selectNote(note)"
        >
          <div class="note-icon">
            <span class="material-icons">mail_outline</span>
          </div>
          <div class="note-info">
            <h3 class="note-title">{{ note.filename.replace('.docx', '') }}</h3>
            <span class="note-date">{{ note.date }}</span>
            <p class="note-preview">{{ note.summary }}</p>
          </div>
        </div>
      </div>

      <!-- Note Detail (Main) -->
      <div class="note-content-area" :class="{ 'mobile-visible': selectedNote && isMobile }">
        <div v-if="selectedNote" class="letter-paper slide-up">
          <button class="back-btn mobile-only" @click="selectedNote = null">
            <span class="material-icons">arrow_back</span> 返回列表
          </button>
          
          <div class="letter-header">
            <span class="letter-date">{{ selectedNote.date }}</span>
          </div>
          
          <h2 class="letter-title cursive">{{ selectedNote.filename.replace('.docx', '') }}</h2>
          
          <div class="letter-body" v-html="selectedNote.content"></div>
          
          <div class="letter-footer cursive">
            你的名字，我的心事
          </div>
        </div>
        
        <div v-else class="empty-selection mobile-hidden">
          <span class="material-icons big-icon">mark_email_unread</span>
          <p>选择一篇日记阅读</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

const loading = ref(true)
const notes = ref([])
const selectedNote = ref(null)
const isMobile = ref(window.innerWidth <= 768)

// Sort notes
const sortedNotes = computed(() => {
  return [...notes.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Select note
const selectNote = (note) => {
  selectedNote.value = note
  window.location.hash = note.id
  // Scroll to top of letter
  if (isMobile.value) {
    window.scrollTo(0, 0)
  }
}

// Handle resize
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

// Fetch notes
const fetchNotes = async () => {
  try {
    const response = await fetch('/notes.json')
    const data = await response.json()
    notes.value = data
    
    // Check hash
    const hash = window.location.hash.substring(1)
    if (hash) {
      const found = data.find(n => n.id === hash)
      if (found) selectedNote.value = found
    } else if (!isMobile.value && data.length > 0) {
      // Auto select first note on desktop
      selectedNote.value = data[0]
    }
  } catch (error) {
    console.error('Failed to fetch notes:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNotes()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.notes-page {
  min-height: 80vh;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 3.5rem;
  color: var(--primary-dark);
  margin-bottom: 10px;
}

.subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
  letter-spacing: 2px;
}

.notes-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 40px;
  height: calc(100vh - 250px);
  min-height: 500px;
}

/* Sidebar */
.notes-sidebar {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-md);
  padding: 20px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.3);
  scrollbar-width: thin;
}

[data-theme="dark"] .notes-sidebar {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

.note-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;
  border-left: 3px solid transparent;
}

.note-item:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: translateX(4px);
}

.note-item.active {
  background: white;
  border-left-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

[data-theme="dark"] .note-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .note-item.active {
  background: var(--card-bg);
}

.note-icon {
  color: var(--primary-color);
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
}

.note-info {
  flex: 1;
  overflow: hidden;
}

.note-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-date {
  font-size: 0.8rem;
  color: var(--text-light);
  display: block;
  margin-bottom: 8px;
}

.note-preview {
  font-size: 0.85rem;
  color: var(--text-main);
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Letter Content */
.note-content-area {
  position: relative;
  height: 100%;
}

.letter-paper {
  background: #fff;
  padding: 60px;
  height: 100%;
  overflow-y: auto;
  box-shadow: var(--shadow-md);
  border-radius: 2px;
  position: relative;
  background-image: 
    linear-gradient(#f1f1f1 1px, transparent 1px),
    linear-gradient(90deg, transparent 59px, #ffccd5 60px, transparent 61px);
  background-size: 100% 2em, 100% 100%;
  line-height: 2em;
}

[data-theme="dark"] .letter-paper {
  background-color: var(--card-bg);
  background-image: 
    linear-gradient(#3a3a3a 1px, transparent 1px),
    linear-gradient(90deg, transparent 59px, #590d22 60px, transparent 61px);
}

.letter-header {
  text-align: right;
  margin-bottom: 40px;
}

.letter-date {
  font-family: 'Courier New', monospace;
  color: var(--text-light);
}

.letter-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 40px;
  color: var(--primary-dark);
}

.letter-body {
  font-size: 1.1rem;
  font-family: var(--font-body);
  color: var(--text-main);
  margin-bottom: 60px;
}

.letter-footer {
  text-align: right;
  font-size: 1.8rem;
  color: var(--text-light);
  margin-top: 40px;
}

.empty-selection {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  opacity: 0.5;
}

.big-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .notes-container {
    display: block;
    height: auto;
  }
  
  .notes-sidebar.mobile-hidden {
    display: none;
  }
  
  .note-content-area {
    display: none;
  }
  
  .note-content-area.mobile-visible {
    display: block;
    height: auto;
    min-height: 80vh;
  }
  
  .letter-paper {
    padding: 30px 20px;
    background-image: linear-gradient(#f1f1f1 1px, transparent 1px); /* Remove vertical line on mobile */
  }
  
  .mobile-only {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 20px;
    cursor: pointer;
  }
  
  .page-title {
    font-size: 3rem;
  }
}
</style>