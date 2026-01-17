<template>
  <div class="diary-page">
    <div class="container diary-container">
      <header class="diary-header">
        <h1>我的日记</h1>
        <p class="subtitle">记录每一个值得铭记的瞬间</p>
      </header>

      <!-- Admin: Post New Diary -->
      <div v-if="isAdmin" class="post-box slide-up">
        <h3><span class="material-icons">edit_note</span> 写日记</h3>
        <div class="input-group">
          <input v-model="newTitle" type="text" placeholder="标题（可选）" class="diary-input title-input smooth-transition">
        </div>
        <div class="input-group">
          <textarea 
            v-model="newContent" 
            placeholder="今天发生了什么..." 
            class="diary-input content-input smooth-transition"
          ></textarea>
        </div>
        <div class="post-actions">
          <button class="post-btn anim-squash" @click="publishDiary" :disabled="publishing">
            <span v-if="publishing" class="spinner-sm"></span>
            {{ publishing ? '发布中...' : '发布日记' }}
          </button>
        </div>
      </div>

      <!-- Diary List -->
      <div class="diary-list">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
        </div>
        
        <div v-else-if="notes.length === 0" class="empty-state">
          <span class="material-icons">auto_stories</span>
          <p>暂无日记，静待落笔。</p>
        </div>

        <div v-else class="timeline">
          <div 
            v-for="(note, index) in notes" 
            :key="note.id" 
            class="timeline-item fade-in"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="timeline-dot"></div>
            <div class="diary-card anim-hover-lift">
              <div class="diary-date">
                <span class="day">{{ formatDateDay(note.created_at) }}</span>
                <span class="month-year">{{ formatDateMonth(note.created_at) }}</span>
              </div>
              <div class="diary-content-wrapper">
                <h3 v-if="note.title" class="diary-title">{{ note.title }}</h3>
                <div class="diary-text" v-html="formatContent(note.content)"></div>
                
                <div v-if="isAdmin" class="diary-footer">
                  <button class="delete-btn anim-squash" @click="deleteDiary(note.id)">
                    <span class="material-icons">delete_outline</span> 删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  if (!newContent.value.trim()) return alert('写点什么吧...')
  
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
    alert('发布成功！')
  } catch (error) {
    alert('发布失败: ' + error.message)
  } finally {
    publishing.value = false
  }
}

// Delete Diary
const deleteDiary = async (id) => {
  if (!confirm('确定要删除这条日记吗？')) return
  
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      
    if (error) throw error
    
    // Remove locally
    notes.value = notes.value.filter(n => n.id !== id)
  } catch (error) {
    alert('删除失败: ' + error.message)
  }
}

// Formatters
const formatDateDay = (dateStr) => {
  return new Date(dateStr).getDate()
}

const formatDateMonth = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}

const formatContent = (text) => {
  if (!text) return ''
  // Simple nl2br
  return text.replace(/\n/g, '<br>')
}

onMounted(() => {
  checkAdmin()
  fetchNotes()
  
  // Listen for auth changes (login/logout)
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

<style scoped>
.diary-page {
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 60px;
  background-color: var(--bg-color);
  color: var(--text-main);
}

.diary-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.diary-header {
  text-align: center;
  margin-bottom: 40px;
}

.diary-header h1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-light);
  font-size: 1rem;
}

/* Post Box */
.post-box {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
}

[data-theme="dark"] .post-box {
  background: rgba(30, 30, 30, 0.8);
  border-color: rgba(255,255,255,0.1);
}

.post-box h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 1.1rem;
  color: var(--primary-color);
}

.diary-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 12px;
  font-family: inherit;
  outline: none;
  color: inherit;
}

.title-input {
  font-size: 1.2rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  margin-bottom: 12px;
}

[data-theme="dark"] .title-input {
  border-bottom-color: rgba(255,255,255,0.1);
}

.content-input {
  min-height: 120px;
  resize: vertical;
  font-size: 1rem;
  line-height: 1.6;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.post-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.post-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.post-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(0,0,0,0.1);
}

[data-theme="dark"] .timeline::before {
  background: rgba(255,255,255,0.1);
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  padding-left: 20px;
}

.timeline-dot {
  position: absolute;
  left: -25px; /* Adjust based on padding and line width */
  top: 20px;
  width: 12px;
  height: 12px;
  background: var(--primary-color);
  border-radius: 50%;
  border: 3px solid var(--bg-color);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
}

[data-theme="dark"] .timeline-dot {
  border-color: var(--bg-color);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.2);
}

.diary-card {
  display: flex;
  gap: 20px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

[data-theme="dark"] .diary-card {
  background: #252525;
}

.diary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

@media (max-width: 600px) {
  .diary-card {
    flex-direction: column;
    gap: 12px;
  }
}

.diary-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  text-align: center;
  padding-right: 20px;
  border-right: 1px solid rgba(0,0,0,0.1);
}

[data-theme="dark"] .diary-date {
  border-right-color: rgba(255,255,255,0.1);
}

@media (max-width: 600px) {
  .diary-date {
    flex-direction: row;
    gap: 8px;
    border-right: none;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    padding-bottom: 12px;
    padding-right: 0;
    justify-content: flex-start;
  }
}

.day {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
}

.month-year {
  font-size: 0.85rem;
  color: var(--text-light);
  margin-top: 4px;
}

.diary-content-wrapper {
  flex: 1;
}

.diary-title {
  margin: 0 0 12px;
  font-size: 1.2rem;
  color: var(--text-color);
}

.diary-text {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-color);
  white-space: pre-wrap;
}

.diary-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  background: transparent;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #ff4d4d;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
