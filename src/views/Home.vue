<template>
  <div class="container">
    <!-- Left Column: Intro & Carousel Placeholder -->
    <div class="main-column">
      <div class="section-card">
        <h1>暗恋日记</h1>
        <div class="photo-frame">
          <img v-if="randomPhoto" :src="randomPhoto.url" :alt="randomPhoto.name" loading="lazy">
        </div>
      </div>

      <div class="section-card">
        <h2>小笔记</h2>
        <div id="notes-container" class="notes-list">
          <div v-if="loading" style="text-align: center; color: var(--secondary-text);">Loading...</div>
          <div v-else-if="latestNote" class="note-item">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div style="font-weight:500;">{{ latestNote.filename.replace('.docx', '') }}</div>
              <div class="note-date" style="margin:0;">{{ latestNote.date }}</div>
            </div>
            <div class="note-content" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
              {{ latestNote.summary }}
            </div>
            <router-link :to="'/notes#' + latestNote.id" style="display:inline-block; margin-top:12px; font-size:14px; color:var(--md-sys-color-primary); text-decoration:none; font-weight: 500;">阅读全文 →</router-link>
          </div>
          <div v-else style="text-align: center; color: var(--secondary-text);">暂无笔记</div>
        </div>
      </div>
    </div>

    <!-- Right Column: Stats & Links -->
    <aside class="side-column">
      <div class="section-card">
        <h2>数据统计</h2>
        <div class="stat-grid">
          <div class="stat-item">
            <div class="stat-value">{{ imageCount }}</div>
            <div class="stat-label">照片数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ loveDays }}</div>
            <div class="stat-label">暗恋天数</div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const loading = ref(true)
const images = ref([])
const notes = ref([])
const randomPhoto = ref(null)
const views = ref(0)

// Calculate love days
const loveDays = computed(() => {
  const startDate = new Date('2024-10-01')
  const today = new Date()
  const diffTime = Math.abs(today - startDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Get image count
const imageCount = computed(() => images.value.length)

// Get latest note
const latestNote = computed(() => {
  if (notes.value.length === 0) return null
  return [...notes.value].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
})

// Fetch images data
const fetchImages = async () => {
  try {
    const response = await fetch('/images.json')
    const data = await response.json()
    images.value = data
    
    // Set random photo
    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length)
      randomPhoto.value = data[randomIndex]
    }
  } catch (error) {
    console.error('Failed to fetch images:', error)
  }
}

// Fetch notes data
const fetchNotes = async () => {
  try {
    const response = await fetch('/notes.json')
    const data = await response.json()
    notes.value = data
  } catch (error) {
    console.error('Failed to fetch notes:', error)
  }
}

// Fetch views count
const fetchViews = async () => {
  try {
    const response = await fetch('/api/view-count')
    const data = await response.json()
    views.value = data.count
  } catch (error) {
    console.error('Failed to fetch views:', error)
  }
}

// Initialize component
onMounted(async () => {
  loading.value = true
  
  // Load images first (critical for hero image)
  await fetchImages()
  
  // Load notes in background
  fetchNotes()
  
  // Load views count
  fetchViews()
  
  loading.value = false
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 100px auto 40px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
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

.main-column {
  grid-column: 1;
}

.side-column {
  grid-column: 2;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  background: var(--bg-color);
  padding: 20px;
  border-radius: var(--md-sys-shape-corner-medium);
  text-align: center;
  border: 1px solid var(--md-sys-color-outline);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--md-sys-color-primary);
}

.stat-label {
  font-size: 14px;
  color: var(--secondary-text);
  margin-top: 4px;
}

.photo-frame {
  width: 100%;
  height: 400px;
  border-radius: var(--md-sys-shape-corner-medium);
  overflow: hidden;
  background: var(--md-sys-color-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 16px;
  border: 4px solid var(--md-sys-color-primary-container);
}

.photo-frame img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-frame img:hover {
  transform: scale(1.02);
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.note-item {
  padding: 16px;
  background: var(--bg-color);
  border-radius: var(--md-sys-shape-corner-medium);
  border-left: 4px solid var(--md-sys-color-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.note-item:hover {
  background: var(--md-sys-color-surface-variant);
}

.note-date {
  font-size: 12px;
  color: var(--secondary-text);
  margin-bottom: 8px;
  font-weight: 500;
}

.note-content {
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.6;
}

@media (max-width: 800px) {
  .container {
    grid-template-columns: 1fr;
  }
  
  .main-column,
  .side-column {
    grid-column: 1;
  }
}
</style>
