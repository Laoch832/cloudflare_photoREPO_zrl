<template>
  <div class="manager-page container fade-in">
    <header class="manager-header">
      <div class="header-left">
        <h1 class="page-title">内容管理</h1>
        <p class="subtitle">管理您的数字资产</p>
      </div>
      <div class="header-right">
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="tab-btn anim-squash" 
            :class="{ active: currentTab === tab.id }"
            @click="currentTab = tab.id"
          >
            <span class="material-icons">{{ tab.icon }}</span>
            {{ tab.name }}
          </button>
        </div>
      </div>
    </header>

    <div class="manager-content">
      <!-- Notes Manager -->
      <transition name="fade" mode="out-in">
        <div v-if="currentTab === 'notes'" class="tab-pane">
          <div class="toolbar">
            <div class="search-box smooth-transition">
              <span class="material-icons">search</span>
              <input v-model="noteSearch" placeholder="搜索日记/文档...">
            </div>
            <button class="action-btn primary anim-squash" @click="createNote">
              <span class="material-icons">add</span> 新建
            </button>
          </div>

          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>标题</th>
                  <th>摘要</th>
                  <th>日期</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="note in filteredNotes" :key="note.id" class="anim-hover-lift">
                  <td class="col-title">{{ note.title || '无标题' }}</td>
                  <td class="col-summary">{{ getSummary(note.content) }}</td>
                  <td class="col-date">{{ formatDate(note.created_at) }}</td>
                  <td>
                    <span class="status-badge success">已发布</span>
                  </td>
                  <td class="col-actions">
                    <button class="icon-btn" title="编辑" @click="editNote(note)">
                      <span class="material-icons">edit</span>
                    </button>
                    <button class="icon-btn danger" title="删除" @click="deleteNote(note.id)">
                      <span class="material-icons">delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="filteredNotes.length === 0" class="empty-state">
              <span class="material-icons">inbox</span>
              <p>暂无数据</p>
            </div>
          </div>
        </div>

        <!-- Images Manager -->
        <div v-else class="tab-pane">
          <div class="toolbar">
             <div class="filter-group">
               <button 
                 class="filter-btn anim-squash" 
                 :class="{ active: imageFilter === 'all' }"
                 @click="imageFilter = 'all'"
               >全部</button>
               <button 
                 class="filter-btn anim-squash" 
                 :class="{ active: imageFilter === 'featured' }"
                 @click="imageFilter = 'featured'"
               >精选</button>
             </div>
             <div class="actions">
                <label class="action-btn primary anim-squash upload-btn">
                  <span class="material-icons">cloud_upload</span> 上传图片
                  <input type="file" multiple @change="handleUpload" accept="image/*" style="display:none">
                </label>
             </div>
          </div>

          <div class="image-grid-manager">
            <div 
              v-for="img in filteredImages" 
              :key="img.url" 
              class="img-card anim-hover-lift"
              :class="{ selected: selectedImages.includes(img.url) }"
              @click="toggleSelection(img.url)"
            >
              <div class="img-wrapper">
                <img :src="img.thumbnail || img.url" loading="lazy">
                <div class="img-overlay">
                  <button 
                    class="fav-btn anim-squash" 
                    :class="{ active: isFeatured(img) }"
                    @click.stop="toggleFeatured(img)"
                  >
                    <span class="material-icons">{{ isFeatured(img) ? 'star' : 'star_border' }}</span>
                  </button>
                </div>
              </div>
              <div class="img-meta">
                <span class="img-name">{{ img.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentTab = ref('notes')
const tabs = [
  { id: 'notes', name: '文章管理', icon: 'article' },
  { id: 'images', name: '图片管理', icon: 'image' }
]

// Notes Logic
const notes = ref([])
const noteSearch = ref('')

const fetchNotes = async () => {
  const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
  notes.value = data || []
}

const filteredNotes = computed(() => {
  if (!noteSearch.value) return notes.value
  const q = noteSearch.value.toLowerCase()
  return notes.value.filter(n => 
    (n.title && n.title.toLowerCase().includes(q)) || 
    (n.content && n.content.toLowerCase().includes(q))
  )
})

const getSummary = (html) => {
  const text = html.replace(/<[^>]+>/g, '')
  return text.length > 30 ? text.substring(0, 30) + '...' : text
}

const formatDate = (str) => new Date(str).toLocaleDateString('zh-CN')

const deleteNote = async (id) => {
  if (!confirm('确定删除?')) return
  await supabase.from('notes').delete().eq('id', id)
  fetchNotes()
}

const createNote = () => {
  // Redirect to Diary or open modal (simplification: go to Diary)
  router.push('/diary')
}

const editNote = (note) => {
  // In a real app, this would open an editor. 
  // For now, we reuse Diary logic or just alert
  alert('请前往日记页面进行编辑 (功能开发中)')
}

// Images Logic
const images = ref([])
const featuredImages = ref(new Set())
const imageFilter = ref('all')
const selectedImages = ref([])

const fetchImages = async () => {
  try {
    const res = await fetch('/images.json')
    images.value = await res.json()
    
    // Load featured from localStorage for now (Simulating DB)
    const stored = localStorage.getItem('featured_images')
    if (stored) {
      featuredImages.value = new Set(JSON.parse(stored))
    }
  } catch (e) {
    console.error(e)
  }
}

const filteredImages = computed(() => {
  if (imageFilter.value === 'featured') {
    return images.value.filter(img => featuredImages.value.has(img.url))
  }
  return images.value
})

const isFeatured = (img) => featuredImages.value.has(img.url)

const toggleFeatured = (img) => {
  if (featuredImages.value.has(img.url)) {
    featuredImages.value.delete(img.url)
  } else {
    featuredImages.value.add(img.url)
  }
  // Save
  localStorage.setItem('featured_images', JSON.stringify([...featuredImages.value]))
}

const handleUpload = (e) => {
  alert('文件系统同步功能需要本地环境支持。在 Web 端，此功能演示了 UI 交互。')
}

const toggleSelection = (url) => {
  const idx = selectedImages.value.indexOf(url)
  if (idx > -1) selectedImages.value.splice(idx, 1)
  else selectedImages.value.push(url)
}

onMounted(() => {
  fetchNotes()
  fetchImages()
})
</script>

<style scoped>
.manager-page {
  padding-top: 40px;
  padding-bottom: 80px;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--gray-300);
}

.page-title {
  font-size: var(--text-3xl);
  color: var(--text-primary);
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-tertiary);
}

.tabs {
  display: flex;
  gap: 12px;
  background: var(--gray-100);
  padding: 4px;
  border-radius: var(--radius-lg);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  transition: all 0.2s;
}

.tab-btn.active {
  background: white;
  color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid var(--gray-300);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  width: 300px;
}

.search-box:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.1);
}

.search-box input {
  border: none;
  outline: none;
  margin-left: 8px;
  width: 100%;
  color: var(--text-primary);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: var(--radius-full);
  border: none;
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: var(--primary-color);
  color: white;
}

.action-btn.primary:hover {
  background: var(--primary-dark);
}

.data-table-wrapper {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 16px 24px;
  text-align: left;
  border-bottom: 1px solid var(--gray-100);
}

.data-table th {
  background: var(--gray-100);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
}

.col-title {
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.col-summary {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
}

.status-badge.success {
  background: #e6f7ff;
  color: #1890ff;
}

.icon-btn {
  background: transparent;
  border: none;
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--gray-100);
}

.icon-btn.danger:hover {
  color: var(--error);
  background: #fff1f0;
}

/* Image Grid */
.image-grid-manager {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.img-card {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: white;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.img-card.selected {
  border-color: var(--primary-color);
}

.img-wrapper {
  position: relative;
  aspect-ratio: 1;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
}

.fav-btn {
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  display: flex;
}

.fav-btn.active {
  color: #ffc107;
  background: white;
}

.img-meta {
  padding: 12px;
}

.img-name {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 6px 16px;
  border-radius: var(--radius-full);
  border: 1px solid var(--gray-300);
  background: white;
  cursor: pointer;
  color: var(--text-secondary);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

[data-theme="dark"] .manager-header {
  border-bottom-color: var(--gray-300);
}

[data-theme="dark"] .tabs {
  background: var(--gray-100);
}

[data-theme="dark"] .tab-btn.active {
  background: var(--bg-card);
}

[data-theme="dark"] .data-table-wrapper {
  background: var(--bg-card);
}

[data-theme="dark"] .data-table th {
  background: var(--gray-100);
}

[data-theme="dark"] .data-table td {
  border-bottom-color: var(--gray-300);
}

[data-theme="dark"] .img-card {
  background: var(--bg-card);
}
</style>