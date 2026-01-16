<template>
  <div class="docs-app">
    <!-- Main Dashboard (File Picker) -->
    <div v-if="!selectedNote" class="docs-dashboard fade-in">
      <div class="docs-header container">
        <div class="search-bar">
          <span class="material-icons search-icon">search</span>
          <input type="text" placeholder="搜索日记..." v-model="searchQuery">
        </div>
      </div>

      <div class="docs-content container">
        <div class="section-title">最近打开</div>
        
        <div v-if="loading" class="loading-state">
          <span class="material-icons spin">sync</span>
        </div>

        <div v-else class="docs-grid">
          <div class="new-doc-card" title="写一篇新日记 (功能开发中)">
            <div class="plus-icon">
              <span class="material-icons">add</span>
            </div>
            <div class="doc-info">空白文档</div>
          </div>

          <div 
            v-for="note in filteredNotes" 
            :key="note.id" 
            class="doc-card"
            @click="selectNote(note)"
          >
            <div class="doc-preview">
              <div class="preview-text">{{ note.summary }}</div>
            </div>
            <div class="doc-info">
              <div class="doc-title">{{ note.filename.replace('.docx', '') }}</div>
              <div class="doc-meta">
                <span class="doc-icon material-icons">article</span>
                <span class="doc-date">{{ note.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Editor View -->
    <div v-else class="docs-editor fade-in">
      <div class="editor-toolbar">
        <div class="toolbar-left">
          <button class="icon-btn" @click="selectedNote = null" title="返回首页">
            <span class="material-icons" style="color: #1a73e8;">description</span>
          </button>
          <div class="doc-header-info">
            <input type="text" class="doc-title-input" :value="selectedNote.filename.replace('.docx', '')" readonly>
            <div class="doc-menu-bar">
              <span>文件</span>
              <span>编辑</span>
              <span>查看</span>
              <span>插入</span>
              <span>格式</span>
              <span>工具</span>
              <span>帮助</span>
            </div>
          </div>
        </div>
        <div class="toolbar-right">
          <button class="share-btn">
            <span class="material-icons">lock</span> 分享
          </button>
          <div class="user-avatar">
            <span class="material-icons">account_circle</span>
          </div>
        </div>
      </div>
      
      <div class="editor-tools">
        <div class="tool-group">
          <button class="tool-btn"><span class="material-icons">undo</span></button>
          <button class="tool-btn"><span class="material-icons">redo</span></button>
          <button class="tool-btn"><span class="material-icons">print</span></button>
        </div>
        <div class="separator"></div>
        <div class="tool-group">
          <select class="font-select">
            <option>正文</option>
            <option>标题 1</option>
          </select>
          <select class="font-family-select">
            <option>Arial</option>
            <option>Roboto</option>
          </select>
        </div>
        <div class="separator"></div>
        <div class="tool-group">
          <button class="tool-btn"><span class="material-icons">format_bold</span></button>
          <button class="tool-btn"><span class="material-icons">format_italic</span></button>
          <button class="tool-btn"><span class="material-icons">format_underlined</span></button>
          <button class="tool-btn" style="color: #1a73e8"><span class="material-icons">format_color_text</span></button>
        </div>
      </div>

      <div class="editor-canvas">
        <div class="paper-sheet">
          <div class="paper-content" v-html="selectedNote.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const loading = ref(true)
const notes = ref([])
const selectedNote = ref(null)
const searchQuery = ref('')

const filteredNotes = computed(() => {
  if (!searchQuery.value) return notes.value
  return notes.value.filter(n => 
    n.filename.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    n.summary.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectNote = (note) => {
  selectedNote.value = note
  window.scrollTo(0, 0)
}

const fetchNotes = async () => {
  try {
    const response = await fetch('/notes.json')
    const data = await response.json()
    // Sort by date desc
    notes.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // Check hash for direct link
    const hash = window.location.hash.substring(1)
    if (hash) {
      const found = data.find(n => n.id === hash)
      if (found) selectNote(found)
    }
  } catch (error) {
    console.error('Failed to fetch notes:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNotes()
})
</script>

<style scoped>
.docs-app {
  min-height: calc(100vh - 80px); /* Adjust for main navbar */
  background-color: #f9fbfd;
  color: #202124;
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* Dashboard Styles */
.docs-header {
  padding: 16px 0;
  display: flex;
  align-items: center;
}

.search-bar {
  background: #f1f3f4;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  transition: background 0.2s, box-shadow 0.2s;
}

.search-bar:focus-within {
  background: white;
  box-shadow: 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
}

.search-icon {
  color: #5f6368;
  margin-right: 12px;
}

.search-bar input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 16px;
  outline: none;
  color: #202124;
}

.docs-content {
  padding: 24px 0;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #202124;
  margin-bottom: 16px;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.doc-card, .new-doc-card {
  border: 1px solid #dadce0;
  border-radius: 4px;
  cursor: pointer;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
  height: 260px;
  display: flex;
  flex-direction: column;
}

.doc-card:hover, .new-doc-card:hover {
  border-color: transparent;
  box-shadow: 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
}

.new-doc-card {
  align-items: center;
  justify-content: center;
}

.plus-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  /* Google colored plus */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Cpath fill='%2334A853' d='M16 16v14h4V20z'/%3E%3Cpath fill='%234285F4' d='M30 16H20l-4 4h14z'/%3E%3Cpath fill='%23FBBC05' d='M6 16v4h10l4-4z'/%3E%3Cpath fill='%23EA4335' d='M20 16V6h-4v14z'/%3E%3Cpath fill='none' d='M0 0h36v36H0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.new-doc-card .plus-icon .material-icons {
  font-size: 48px;
  color: #ea4335; /* Fallback color */
  display: none; /* Use SVG background if possible */
}

.doc-preview {
  flex: 1;
  padding: 16px;
  background: white;
  overflow: hidden;
  border-bottom: 1px solid #dadce0;
}

.preview-text {
  font-size: 6px; /* Tiny text for preview effect */
  color: #5f6368;
  line-height: 1.6;
  overflow: hidden;
  opacity: 0.6;
}

.doc-info {
  padding: 14px 16px;
  background: white;
}

.doc-title {
  font-size: 14px;
  font-weight: 500;
  color: #202124;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.doc-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #5f6368;
}

.doc-icon {
  font-size: 16px;
  color: #1a73e8;
  margin-right: 8px;
}

/* Editor Styles */
.docs-editor {
  background: #f9fbfd;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
}

.editor-toolbar {
  background: white;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dadce0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.doc-header-info {
  display: flex;
  flex-direction: column;
}

.doc-title-input {
  font-size: 18px;
  border: none;
  outline: none;
  color: #202124;
  padding: 2px 4px;
  border-radius: 4px;
  margin-bottom: 2px;
}

.doc-title-input:hover {
  border: 1px solid #dadce0;
}

.doc-menu-bar {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #5f6368;
}

.doc-menu-bar span {
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 2px;
}

.doc-menu-bar span:hover {
  background: #f1f3f4;
  color: #202124;
}

.share-btn {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 4px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.share-btn:hover {
  background: #1765cc;
  box-shadow: 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
}

.share-btn .material-icons {
  font-size: 18px;
}

.editor-tools {
  background: #edf2fa;
  padding: 6px 16px;
  border-bottom: 1px solid #dadce0;
  border-radius: 24px;
  margin: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.separator {
  width: 1px;
  height: 20px;
  background: #dadce0;
  margin: 0 8px;
}

.tool-btn {
  background: transparent;
  border: none;
  color: #444746;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
}

.tool-btn:hover {
  background: rgba(0,0,0,0.05);
}

.tool-btn .material-icons {
  font-size: 20px;
}

.font-select, .font-family-select {
  background: transparent;
  border: none;
  font-size: 14px;
  color: #202124;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.font-select:hover, .font-family-select:hover {
  background: rgba(0,0,0,0.05);
}

.editor-canvas {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  background: #f9fbfd;
}

.paper-sheet {
  background: white;
  width: 816px; /* A4 width approx */
  min-height: 1056px; /* A4 height approx */
  padding: 96px; /* A4 margins */
  box-shadow: 0 1px 3px rgba(60,64,67,0.15);
  margin-bottom: 24px;
}

.paper-content {
  font-size: 11pt;
  line-height: 1.5;
  color: #000;
  font-family: 'Arial', sans-serif;
}

@media (max-width: 900px) {
  .paper-sheet {
    width: 100%;
    padding: 40px 24px;
  }
  
  .editor-tools {
    overflow-x: auto;
  }
}
</style>