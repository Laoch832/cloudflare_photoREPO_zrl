<template>
  <div class="notes-page">
    <!-- Google Docs Header -->
    <header class="docs-header fade-in">
      <div class="header-left">
        <div class="docs-logo">
          <span class="material-icons logo-icon">description</span>
        </div>
        <h1 class="docs-title">心事文档</h1>
      </div>
      <div class="header-center">
        <div class="search-bar">
          <span class="material-icons search-icon">search</span>
          <input type="text" placeholder="搜索心事..." v-model="searchQuery">
        </div>
      </div>
      <div class="header-right">
        <button class="icon-btn" title="列表视图" @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'">
          <span class="material-icons">{{ viewMode === 'grid' ? 'view_list' : 'grid_view' }}</span>
        </button>
        <button class="icon-btn" title="排序" @click="toggleSort">
          <span class="material-icons">sort_by_alpha</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="docs-container fade-in" style="animation-delay: 0.1s">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>正在加载文档...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredNotes.length === 0" class="empty-state">
        <img src="https://ssl.gstatic.com/docs/doclist/images/empty_state_1.png" alt="No docs" class="empty-img">
        <p>没有找到相关的心事...</p>
      </div>

      <!-- Document Grid/List -->
      <div v-else-if="!selectedNote" class="docs-grid" :class="{ 'list-view': viewMode === 'list' }">
        <div class="section-title">最近打开</div>
        
        <div class="grid-wrapper">
          <div 
            v-for="note in filteredNotes" 
            :key="note.id" 
            class="doc-card"
            @click="openNote(note)"
          >
            <div class="doc-preview">
              <div class="doc-content-preview">
                {{ note.summary }}
              </div>
            </div>
            <div class="doc-info">
              <div class="doc-title">{{ note.filename.replace('.docx', '') }}</div>
              <div class="doc-meta">
                <span class="doc-icon material-icons">article</span>
                <span class="doc-date">上次修改：{{ formatDate(note.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Editor View -->
      <div v-else class="doc-editor slide-up">
        <div class="editor-toolbar">
          <button class="back-btn" @click="closeNote">
            <span class="material-icons">arrow_back</span>
          </button>
          <div class="editor-title">
            <h2>{{ selectedNote.filename.replace('.docx', '') }}</h2>
            <div class="editor-meta">
              <span>文件</span>
              <span>编辑</span>
              <span>查看</span>
              <span>帮助</span>
            </div>
          </div>
          <div class="editor-actions">
            <span class="material-icons">comment</span>
            <button class="share-btn">
              <span class="material-icons">lock</span> 仅我可见
            </button>
          </div>
        </div>
        
        <div class="editor-content-wrapper">
          <div class="editor-paper">
            <div class="paper-content" v-html="selectedNote.content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const loading = ref(true)
const notes = ref([])
const selectedNote = ref(null)
const searchQuery = ref('')
const viewMode = ref('grid') // 'grid' or 'list'
const sortDesc = ref(true)

// Computed
const filteredNotes = computed(() => {
  let result = [...notes.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(note => 
      note.filename.toLowerCase().includes(query) || 
      note.summary.toLowerCase().includes(query)
    )
  }
  
  return result.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return sortDesc.value ? dateB - dateA : dateA - dateB
  })
})

// Methods
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const toggleSort = () => {
  sortDesc.value = !sortDesc.value
}

const openNote = (note) => {
  selectedNote.value = note
  window.scrollTo(0, 0)
}

const closeNote = () => {
  selectedNote.value = null
}

// Fetch notes
const fetchNotes = async () => {
  try {
    const response = await fetch('/notes.json')
    const data = await response.json()
    notes.value = data
    
    // Check hash for direct link
    const hash = window.location.hash.substring(1)
    if (hash) {
      const found = data.find(n => n.id === hash)
      if (found) openNote(found)
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
.notes-page {
  min-height: 100vh;
  background-color: #f9fbfd;
  color: #1f1f1f;
}

[data-theme="dark"] .notes-page {
  background-color: #1e1e1e;
  color: #e3e3e3;
}

/* Header */
.docs-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  z-index: 100;
  height: 64px;
}

[data-theme="dark"] .docs-header {
  background: #2d2d2d;
  border-bottom: 1px solid #444;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 200px;
}

.docs-logo {
  color: #4285f4;
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.logo-icon {
  font-size: 36px;
}

.docs-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #444746;
}

[data-theme="dark"] .docs-title {
  color: #e3e3e3;
}

.header-center {
  flex: 1;
  max-width: 720px;
  margin: 0 20px;
}

.search-bar {
  background: #f0f4f9;
  border-radius: 24px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

[data-theme="dark"] .search-bar {
  background: #3c4043;
}

.search-bar:focus-within {
  background: white;
  box-shadow: 0 1px 6px rgba(0,0,0,0.2);
}

[data-theme="dark"] .search-bar:focus-within {
  background: #303134;
}

.search-icon {
  color: #444746;
  margin-right: 12px;
}

.search-bar input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 1rem;
  outline: none;
  color: inherit;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.icon-btn {
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  color: #444746;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: rgba(0,0,0,0.05);
}

[data-theme="dark"] .icon-btn {
  color: #e3e3e3;
}

[data-theme="dark"] .icon-btn:hover {
  background: rgba(255,255,255,0.1);
}

/* Dashboard */
.docs-container {
  padding: 24px;
  padding-bottom: 100px; /* Clear bottom nav */
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 1rem;
  font-weight: 500;
  color: #444746;
  margin-bottom: 16px;
}

[data-theme="dark"] .section-title {
  color: #e3e3e3;
}

.grid-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.list-view .grid-wrapper {
  display: flex;
  flex-direction: column;
}

.doc-card {
  border: 1px solid #dadce0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  height: 280px;
  display: flex;
  flex-direction: column;
}

[data-theme="dark"] .doc-card {
  background: #303134;
  border-color: #5f6368;
}

.doc-card:hover {
  border-color: #4285f4;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}

.doc-preview {
  flex: 1;
  background: #fff;
  padding: 16px;
  overflow: hidden;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
}

[data-theme="dark"] .doc-preview {
  background: #3c4043;
  border-color: #5f6368;
}

.doc-content-preview {
  font-size: 0.6rem;
  color: #5f6368;
  line-height: 1.6;
  transform: scale(0.9);
  transform-origin: top left;
  width: 110%;
}

[data-theme="dark"] .doc-content-preview {
  color: #bdc1c6;
}

.doc-info {
  padding: 12px 16px;
  height: 72px;
}

.doc-title {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1f1f1f;
}

[data-theme="dark"] .doc-title {
  color: #e3e3e3;
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #5f6368;
}

[data-theme="dark"] .doc-meta {
  color: #9aa0a6;
}

.doc-icon {
  font-size: 16px;
  color: #4285f4;
}

/* List View Overrides */
.list-view .doc-card {
  height: 48px;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  border: none;
  border-bottom: 1px solid #dadce0;
  border-radius: 0;
}

[data-theme="dark"] .list-view .doc-card {
  border-color: #5f6368;
}

.list-view .doc-preview {
  display: none;
}

.list-view .doc-info {
  height: auto;
  padding: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-view .doc-title {
  margin: 0;
  font-size: 0.95rem;
  flex: 1;
}

/* Editor View */
.doc-editor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #f9fbfd;
  z-index: 200;
  display: flex;
  flex-direction: column;
}

[data-theme="dark"] .doc-editor {
  background: #1e1e1e;
}

.editor-toolbar {
  height: 64px;
  background: white;
  border-bottom: 1px solid #dadce0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
}

[data-theme="dark"] .editor-toolbar {
  background: #2d2d2d;
  border-color: #444;
}

.back-btn {
  background: transparent;
  border: none;
  color: #4285f4;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
}

.back-btn:hover {
  background: rgba(66, 133, 244, 0.1);
}

.editor-title h2 {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  color: #1f1f1f;
}

[data-theme="dark"] .editor-title h2 {
  color: #e3e3e3;
}

.editor-meta {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: #5f6368;
  margin-top: 4px;
}

.editor-meta span {
  cursor: pointer;
}

.editor-meta span:hover {
  color: #1f1f1f;
}

.editor-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 24px;
  color: #5f6368;
}

.share-btn {
  background: #c2e7ff;
  color: #001d35;
  border: none;
  padding: 8px 24px;
  border-radius: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.share-btn:hover {
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.editor-content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  padding-bottom: 100px; /* Clear bottom nav */
  display: flex;
  justify-content: center;
}

.editor-paper {
  background: white;
  width: 816px; /* A4 width */
  min-height: 1056px; /* A4 height */
  padding: 96px;
  box-shadow: 0 0 16px rgba(0,0,0,0.08);
  margin-bottom: 40px;
}

[data-theme="dark"] .editor-paper {
  background: #303134;
  color: #e3e3e3;
}

.paper-content {
  font-family: 'Times New Roman', serif;
  font-size: 1.1rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .header-center {
    display: none;
  }
  
  .editor-paper {
    width: 100%;
    padding: 24px;
    min-height: auto;
  }
  
  .editor-meta {
    display: none;
  }
}
</style>