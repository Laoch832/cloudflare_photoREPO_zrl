<template>
  <div class="notes-page">
    <div class="container">
      <!-- Toolbar -->
      <div class="notes-toolbar fade-in">
        <div class="toolbar-left">
          <h1 class="page-title">心事文档</h1>
          <div class="search-bar smooth-transition">
            <span class="material-icons search-icon">search</span>
            <input type="text" placeholder="搜索心事..." v-model="searchQuery">
          </div>
        </div>
        <div class="toolbar-right">
          <button v-if="isAdmin" class="action-btn create-btn anim-squash" @click="showCreateModal = true">
            <span class="material-icons">add</span> 新建
          </button>
          <div class="view-controls">
            <button class="icon-btn anim-squash" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
              <span class="material-icons">grid_view</span>
            </button>
            <button class="icon-btn anim-squash" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
              <span class="material-icons">view_list</span>
            </button>
            <button class="icon-btn anim-squash" @click="toggleSort" title="排序">
              <span class="material-icons">sort_by_alpha</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Create Modal -->
      <div v-if="showCreateModal" class="modal-overlay">
        <div class="modal-card">
          <h3>写下新的心事</h3>
          <input v-model="newNoteTitle" placeholder="标题" class="modal-input smooth-transition">
          <textarea v-model="newNoteContent" placeholder="内容..." class="modal-textarea smooth-transition"></textarea>
          <div class="modal-actions">
            <button @click="showCreateModal = false" class="cancel-btn anim-squash">取消</button>
            <button @click="createNote" class="confirm-btn anim-squash" :disabled="saving">
              {{ saving ? '发布中...' : '发布' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="docs-container fade-in" style="animation-delay: 0.1s">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>正在加载文档...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredNotes.length === 0" class="empty-state">
          <span class="material-icons empty-icon">description</span>
          <p>没有找到相关的心事...</p>
        </div>

        <!-- Document Grid/List -->
        <div v-else-if="!selectedNote" class="docs-grid" :class="{ 'list-view': viewMode === 'list' }">
          <div class="grid-wrapper">
            <div 
              v-for="note in filteredNotes" 
              :key="note.id" 
              class="doc-card anim-hover-lift"
              @click="openNote(note)"
            >
              <div class="doc-preview">
                <div class="doc-content-preview">
                  {{ note.summary }}
                </div>
              </div>
              <div class="doc-info">
                <div class="doc-title">{{ note.title }}</div>
                <div class="doc-meta">
                  <span class="doc-date">{{ formatDate(note.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Document Editor View -->
        <div v-else class="doc-editor slide-up">
          <div class="editor-toolbar container">
            <button class="back-btn anim-squash" @click="closeNote">
              <span class="material-icons">arrow_back</span> 返回列表
            </button>
            <div class="editor-title">
              <h2>{{ selectedNote.title }}</h2>
              <span class="editor-date">{{ formatDate(selectedNote.created_at) }}</span>
            </div>
            <div class="editor-actions">
              <button class="share-btn anim-squash" @click="copyShareLink">
                <span class="material-icons">share</span> 分享
              </button>
            </div>
          </div>
          
          <div class="editor-content-wrapper container">
            <div class="editor-paper">
              <div class="paper-content" v-html="selectedNote.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { supabase } from '../lib/supabase'

const loading = ref(true)
const notes = ref([])
const selectedNote = ref(null)
const searchQuery = ref('')
const viewMode = ref('grid') // 'grid' or 'list'
const sortDesc = ref(true)
const isAdmin = ref(false)
const showCreateModal = ref(false)
const newNoteTitle = ref('')
const newNoteContent = ref('')
const saving = ref(false)

// Computed
const filteredNotes = computed(() => {
  let result = [...notes.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.summary.toLowerCase().includes(query)
    )
  }
  
  return result.sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return sortDesc.value ? dateB - dateA : dateA - dateB
  })
})

// Methods
const checkAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user && user.email === '2730377018@qq.com') {
    isAdmin.value = true
  }
}

const createNote = async () => {
  if (!newNoteTitle.value) return alert('请输入标题')
  
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
    
    alert('发布成功！')
    showCreateModal.value = false
    newNoteTitle.value = ''
    newNoteContent.value = ''
    fetchNotes()
  } catch (error) {
    alert('发布失败: ' + error.message)
  } finally {
    saving.value = false
  }
}

const copyShareLink = () => {
  const url = `${window.location.origin}/notes#${selectedNote.value.id}`
  navigator.clipboard.writeText(url).then(() => {
    alert('链接已复制到剪贴板！')
  }).catch(() => {
    alert('复制失败，请手动复制地址栏链接')
  })
}

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
    // Fetch from Supabase first
    const { data: dbNotes, error } = await supabase
      .from('notes')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      
    let allNotes = []
    
    if (!error && dbNotes) {
      allNotes = dbNotes.map(n => ({
        id: n.id,
        title: n.title, // Standardized
        content: n.content,
        summary: n.summary || n.content.substring(0, 100).replace(/<[^>]*>/g, '') + '...',
        created_at: n.created_at // Standardized
      }))
    }

    // Fetch from local JSON (legacy) - Map to standard structure
    try {
      const response = await fetch('/notes.json')
      const localData = await response.json()
      const mappedLocal = localData.map(n => ({
        id: n.id,
        title: n.filename ? n.filename.replace('.docx', '') : n.id,
        content: n.content,
        summary: n.summary,
        created_at: n.date
      }))
      allNotes = [...allNotes, ...mappedLocal]
    } catch (e) {
      console.warn('No local notes.json found')
    }
    
    notes.value = allNotes
    
    // Check hash for direct link
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
.notes-page {
  min-height: 100vh;
  background-color: #fff; /* White background per request */
  color: var(--text-primary);
  padding-top: 40px; /* Space from global nav */
}

/* Toolbar */
.notes-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
}

.search-bar {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  transition: all 0.2s;
}

.search-bar:focus-within {
  background: #fff;
  box-shadow: 0 0 0 2px var(--primary-color);
}

.search-icon {
  color: #888;
  margin-right: 12px;
}

.search-bar input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 14px;
  outline: none;
  color: inherit;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-controls {
  display: flex;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
}

.icon-btn {
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(0,0,0,0.05);
  color: #000;
}

.icon-btn.active {
  background: #fff;
  color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
}

/* Docs Grid */
.docs-container {
  padding-bottom: 120px;
}

.grid-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.list-view .grid-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.doc-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 320px;
  display: flex;
  flex-direction: column;
}

.doc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  border-color: transparent;
}

.doc-preview {
  flex: 1;
  background: #fafafa;
  padding: 24px;
  overflow: hidden;
  position: relative;
  font-family: 'Times New Roman', serif;
}

.doc-content-preview {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
}

.doc-info {
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #f5f5f5;
}

.doc-title {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-meta {
  font-size: 12px;
  color: #999;
}

/* List View Overrides */
.list-view .doc-card {
  height: 72px;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
}

.list-view .doc-preview {
  display: none;
}

.list-view .doc-info {
  border: none;
  padding: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-view .doc-title {
  margin: 0;
  font-size: 15px;
}

/* Editor */
.doc-editor {
  position: fixed;
  top: var(--vp-nav-height); /* Below global nav */
  left: 0;
  width: 100%;
  height: calc(100vh - var(--vp-nav-height));
  background: #f9f9f9;
  z-index: 900;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.back-btn {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  cursor: pointer;
  color: #666;
}

.back-btn:hover {
  color: #000;
}

.editor-title {
  text-align: center;
}

.editor-title h2 {
  font-size: 16px;
  margin: 0;
  font-weight: 700;
}

.editor-date {
  font-size: 12px;
  color: #999;
}

.share-btn {
  background: #000;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.editor-content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.editor-paper {
  background: #fff;
  width: 100%;
  max-width: 800px;
  min-height: 1000px;
  padding: 80px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border-radius: 4px;
}

.paper-content {
  font-family: 'Georgia', serif;
  font-size: 18px;
  line-height: 1.8;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.2;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.modal-input, .modal-textarea {
  width: 100%;
  padding: 12px;
  margin: 16px 0;
  border: 1px solid #dadce0;
  border-radius: 8px;
  font-family: inherit;
}

.modal-textarea {
  min-height: 200px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.confirm-btn {
  background: #000;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #dadce0;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  color: inherit;
}

@media (max-width: 768px) {
  .notes-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-left {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-bar {
    max-width: 100%;
  }
  
  .editor-paper {
    padding: 30px;
  }
}
</style>