<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero fade-in">
      <div class="hero-content">
        <h1 class="cursive title">Our Love Story</h1>
        <div class="days-counter">
          <p>We have been in love for</p>
          <div class="days-number">{{ loveDays }}</div>
          <p>days</p>
        </div>
        <div class="scroll-hint">
          <span>Scroll to explore</span>
          <span class="material-icons">expand_more</span>
        </div>
      </div>
      <div class="hero-bg" :style="heroBgStyle"></div>
    </section>

    <div class="container content-grid">
      <!-- Latest Photo -->
      <section class="section slide-up" style="animation-delay: 0.2s">
        <div class="section-header">
          <h2 class="cursive">Latest Moment</h2>
          <router-link to="/gallery" class="view-all">View All <span class="material-icons">arrow_forward</span></router-link>
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
          Waiting for our first photo...
        </div>
      </section>

      <!-- Latest Note -->
      <section class="section slide-up" style="animation-delay: 0.4s">
        <div class="section-header">
          <h2 class="cursive">Her Thoughts</h2>
          <router-link to="/notes" class="view-all">Read More <span class="material-icons">arrow_forward</span></router-link>
        </div>

        <div class="note-card" v-if="latestNote">
          <div class="note-paper">
            <div class="note-date">{{ latestNote.date }}</div>
            <h3 class="note-title">{{ latestNote.filename.replace('.docx', '') }}</h3>
            <p class="note-excerpt">{{ latestNote.summary }}</p>
            <router-link :to="'/notes#' + latestNote.id" class="read-btn">Read full note</router-link>
          </div>
        </div>
        <div v-else class="empty-state">
          Waiting for the first note...
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
  return new Date(dateString).toLocaleDateString()
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
  height: 80vh;
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
  z-index: -1;
  filter: blur(2px);
  transition: opacity 1s ease;
}

[data-theme="dark"] .hero-bg {
  opacity: 0.1;
}

.hero-content {
  z-index: 1;
  padding: 20px;
}

.title {
  font-size: 5rem;
  color: var(--primary-dark);
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
}

.days-counter {
  font-size: 1.5rem;
  color: var(--text-main);
}

.days-number {
  font-size: 6rem;
  font-weight: bold;
  color: var(--accent-color);
  line-height: 1;
  margin: 10px 0;
  font-family: var(--font-heading);
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
  opacity: 0.7;
  animation: bounce 2s infinite;
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
  gap: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 2.5rem;
  color: var(--primary-dark);
}

.view-all {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-light);
}

.view-all:hover {
  color: var(--primary-color);
}

/* Photo Card */
.photo-card {
  background: white;
  padding: 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transform: rotate(-2deg);
  transition: transform 0.3s ease;
}

.photo-card:hover {
  transform: rotate(0) scale(1.02);
}

.photo-wrapper {
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
  aspect-ratio: 4/3;
}

.photo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}

/* Note Card */
.note-card {
  height: 100%;
}

.note-paper {
  background: #fff;
  padding: 30px;
  border-radius: 2px;
  box-shadow: var(--shadow-sm);
  position: relative;
  background-image: linear-gradient(#f1f1f1 1px, transparent 1px);
  background-size: 100% 2em;
  line-height: 2em;
  height: 100%;
  min-height: 300px;
  transform: rotate(1deg);
  transition: transform 0.3s ease;
}

.note-paper:hover {
  transform: rotate(0) translateY(-5px);
  box-shadow: var(--shadow-md);
}

.note-date {
  color: var(--text-light);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.note-title {
  font-size: 1.5rem;
  color: var(--text-main);
  margin-bottom: 16px;
  line-height: 1.4;
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
}

.read-btn:hover {
  color: var(--accent-color);
  border-color: var(--accent-color);
}

.empty-state {
  padding: 40px;
  text-align: center;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  color: var(--text-light);
  font-style: italic;
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
    font-size: 4rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  .photo-card, .note-paper {
    transform: rotate(0);
  }
}
</style>