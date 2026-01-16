<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="cursive title slide-up" style="animation-delay: 0.1s">我喜欢你，默默地</h1>
        <div class="days-counter slide-up" style="animation-delay: 0.3s">
          <p class="counter-label">这份心意已经藏了</p>
          <div class="days-number">{{ loveDays }}</div>
          <p class="counter-label">天</p>
        </div>
        <div class="scroll-hint fade-in" style="animation-delay: 1.5s">
          <span>关于你的点滴</span>
          <span class="material-icons bounce">expand_more</span>
        </div>
      </div>
      <div class="hero-bg" :style="heroBgStyle"></div>
      <div class="hero-overlay"></div>
    </section>

    <div class="container content-grid">
      <!-- Latest Photo -->
      <section class="section slide-up" style="animation-delay: 0.5s">
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
      <section class="section slide-up" style="animation-delay: 0.7s">
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
  height: 90vh;
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
  opacity: 0.15;
  z-index: -2;
  filter: blur(8px);
  transform: scale(1.1);
  transition: opacity 1s ease;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 0%, var(--bg-color) 90%);
  z-index: -1;
}

[data-theme="dark"] .hero-bg {
  opacity: 0.1;
}

.hero-content {
  z-index: 1;
  padding: 40px;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

[data-theme="dark"] .hero-content {
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.05);
}

.title {
  font-size: 5rem;
  color: var(--primary-dark);
  margin-bottom: 20px;
  text-shadow: 0 4px 12px rgba(255, 77, 109, 0.15);
  font-weight: normal;
  line-height: 1.2;
}

.days-counter {
  margin: 30px 0;
}

.counter-label {
  font-size: 1.2rem;
  color: var(--text-light);
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.days-number {
  font-size: 8rem;
  font-weight: 300;
  color: var(--accent-color);
  line-height: 1;
  margin: 10px 0;
  font-family: 'Helvetica Neue', sans-serif;
  text-shadow: 2px 4px 0px rgba(0,0,0,0.05);
}

.scroll-hint {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-light);
  opacity: 0.6;
  font-size: 0.9rem;
  gap: 8px;
}

.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-10px);}
  60% {transform: translateY(-5px);}
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  padding-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 2.5rem;
  color: var(--primary-dark);
  font-weight: normal;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-light);
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.5);
}

.view-all:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(5px);
}

/* Photo Card */
.photo-card {
  background: white;
  padding: 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transform: rotate(-2deg);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
}

.photo-card:hover {
  transform: rotate(0) scale(1.02) translateY(-10px);
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
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.photo-card:hover img {
  transform: scale(1.1);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  color: white;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.4s ease;
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
  padding: 40px;
  border-radius: 4px;
  box-shadow: var(--shadow-sm);
  position: relative;
  background-image: linear-gradient(#f1f1f1 1px, transparent 1px);
  background-size: 100% 2em;
  line-height: 2em;
  height: 100%;
  min-height: 350px;
  transform: rotate(1deg);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.note-paper:hover {
  transform: rotate(0) translateY(-10px);
  box-shadow: var(--shadow-lg);
}

.note-date {
  color: var(--text-light);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 16px;
  font-family: monospace;
  opacity: 0.7;
}

.note-title {
  font-size: 1.8rem;
  color: var(--text-main);
  margin-bottom: 20px;
  line-height: 1.4;
  font-weight: 600;
}

.note-excerpt {
  color: var(--text-main);
  opacity: 0.8;
  margin-bottom: 30px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 1.05rem;
}

.read-btn {
  display: inline-block;
  color: var(--primary-dark);
  font-weight: 600;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 4px;
  font-size: 1rem;
  transition: all 0.3s;
}

.read-btn:hover {
  color: var(--accent-color);
  border-color: var(--accent-color);
  padding-left: 10px;
}

.empty-state {
  padding: 80px;
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
    font-size: 3.5rem;
  }
  
  .days-number {
    font-size: 5rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .photo-card, .note-paper {
    transform: rotate(0);
  }
  
  .hero {
    height: 80vh;
  }
  
  .hero-content {
    padding: 20px;
    margin: 0 16px;
  }
}
</style>