<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero fade-in">
      <div class="hero-content">
        <h1 class="cursive title">我喜欢你，默默地</h1>
        <div class="days-counter">
          <p>这份心意已经藏了</p>
          <div class="days-number">{{ loveDays }}</div>
          <p>天</p>
        </div>
        <div class="scroll-hint">
          <span>关于你的点滴</span>
          <span class="material-icons">expand_more</span>
        </div>
      </div>
      <div class="hero-bg" :style="heroBgStyle"></div>
    </section>

    <div class="container content-grid">
      <!-- Latest Photo -->
      <section class="section slide-up" style="animation-delay: 0.2s">
        <div class="section-header">
          <h2 class="cursive">定格瞬间</h2>
          <router-link to="/gallery" class="view-all">查看更多 <span class="material-icons">arrow_forward</span></router-link>
        </div>
        
        <div class="photo-card" v-if="randomPhoto">
          <div class="photo-wrapper">
            <img :src="randomPhoto.url" :alt="randomPhoto.name" loading="lazy">
            <div class="photo-overlay">
              <span>{{ formatDate(randomPhoto.uploadedAt) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          还没有关于你的照片...
        </div>
      </section>

      <!-- Latest Note -->
      <section class="section slide-up" style="animation-delay: 0.4s">
        <div class="section-header">
          <h2 class="cursive">心事</h2>
          <router-link to="/notes" class="view-all">阅读更多 <span class="material-icons">arrow_forward</span></router-link>
        </div>

        <div class="note-card" v-if="latestNote">
          <div class="note-paper">
            <div class="note-date">{{ latestNote.date }}</div>
            <h3 class="note-title">{{ latestNote.filename.replace('.docx', '') }}</h3>
            <p class="note-excerpt">{{ latestNote.summary }}</p>
            <router-link :to="'/notes#' + latestNote.id" class="read-btn">展开阅读</router-link>
          </div>
        </div>
        <div v-else class="empty-state">
          还没有写下心事...
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const loading = ref(true)
const images = ref([])
const notes = ref([])
const randomPhoto = ref(null)

// Calculate love days
const loveDays = computed(() => {
  const startDate = new Date('2024-10-01') // Replace with your date
  const today = new Date()
  const diffTime = Math.abs(today - startDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Get latest note
const latestNote = computed(() => {
  if (notes.value.length === 0) return null
  return [...notes.value].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
})

// Dynamic hero background
const heroBgStyle = computed(() => {
  if (randomPhoto.value) {
    return {
      backgroundImage: `url(${randomPhoto.value.url})`
    }
  }
  return {}
})

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// Fetch data
const fetchData = async () => {
  try {
    const [imgRes, noteRes] = await Promise.all([
      fetch('/images.json'),
      fetch('/notes.json')
    ])
    
    const imgData = await imgRes.json()
    const noteData = await noteRes.json()
    
    images.value = imgData
    notes.value = noteData
    
    if (imgData.length > 0) {
      // Pick a random photo for hero bg or display
      const randomIndex = Math.floor(Math.random() * imgData.length)
      randomPhoto.value = imgData[randomIndex]
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  height: 85vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  margin-top: -80px; /* Offset navbar height */
  margin-bottom: 60px;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  z-index: -1;
  filter: blur(4px);
  transition: opacity 1s ease;
  transform: scale(1.1); /* Prevent white edges from blur */
}

[data-theme="dark"] .hero-bg {
  opacity: 0.08;
}

.hero-content {
  z-index: 1;
  padding: 20px;
  max-width: 800px;
}

.title {
  font-size: 4.5rem;
  color: var(--primary-dark);
  margin-bottom: 40px;
  text-shadow: 2px 2px 8px rgba(255, 255, 255, 0.8);
  font-weight: normal;
  line-height: 1.2;
}

.days-counter {
  font-size: 1.4rem;
  color: var(--text-main);
  opacity: 0.9;
}

.days-number {
  font-size: 5rem;
  font-weight: bold;
  color: var(--accent-color);
  line-height: 1.1;
  margin: 10px 0;
  font-family: var(--font-body); /* Use body font for numbers */
}

.scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-light);
  opacity: 0.6;
  font-size: 0.9rem;
  animation: bounce 2s infinite;
  gap: 8px;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {transform: translateX(-50%) translateY(0);}
  40% {transform: translateX(-50%) translateY(-10px);}
  60% {transform: translateX(-50%) translateY(-5px);}
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  padding-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 2.2rem;
  color: var(--primary-dark);
  font-weight: normal;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-light);
  transition: all 0.2s;
}

.view-all:hover {
  color: var(--primary-color);
  gap: 8px;
}

/* Photo Card */
.photo-card {
  background: white;
  padding: 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transform: rotate(-2deg);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.photo-card:hover {
  transform: rotate(0) scale(1.02);
  box-shadow: var(--shadow-lg);
}

.photo-wrapper {
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #f8f8f8;
}

.photo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.photo-card:hover img {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
  color: white;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-card:hover .photo-overlay {
  opacity: 1;
}

/* Note Card */
.note-card {
  height: 100%;
}

.note-paper {
  background: #fff;
  padding: 32px;
  border-radius: 2px;
  box-shadow: var(--shadow-sm);
  position: relative;
  background-image: linear-gradient(#f1f1f1 1px, transparent 1px);
  background-size: 100% 2em;
  line-height: 2em;
  height: 100%;
  min-height: 320px;
  transform: rotate(1deg);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
}

.note-paper:hover {
  transform: rotate(0) translateY(-4px);
  box-shadow: var(--shadow-md);
}

.note-date {
  color: var(--text-light);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 12px;
  font-family: monospace;
}

.note-title {
  font-size: 1.6rem;
  color: var(--text-main);
  margin-bottom: 16px;
  line-height: 1.4;
  font-weight: 600;
}

.note-excerpt {
  color: var(--text-main);
  opacity: 0.8;
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-btn {
  display: inline-block;
  color: var(--primary-dark);
  font-weight: 600;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 2px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.read-btn:hover {
  color: var(--accent-color);
  border-color: var(--accent-color);
}

.empty-state {
  padding: 60px;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-md);
  color: var(--text-light);
  font-style: italic;
  border: 2px dashed rgba(0,0,0,0.05);
}

[data-theme="dark"] .photo-card,
[data-theme="dark"] .note-paper {
  background-color: var(--card-bg);
}

[data-theme="dark"] .note-paper {
  background-image: linear-gradient(#3a3a3a 1px, transparent 1px);
}

@media (max-width: 768px) {
  .title {
    font-size: 3rem;
  }
  
  .days-number {
    font-size: 4rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  .photo-card, .note-paper {
    transform: rotate(0);
  }
  
  .hero {
    height: 75vh;
  }
}
</style>