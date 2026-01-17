<template>
  <div class="gallery-page container">
    <div class="header fade-in">
      <h1 class="cursive page-title anim-pulse">珍藏回忆</h1>
      <p class="subtitle">每一个瞬间，都值得被铭记</p>
      
      <!-- Filter Toolbar -->
      <div class="filter-bar slide-up" style="animation-delay: 0.1s">
        <button 
          class="filter-pill anim-squash" 
          :class="{ active: currentFilter === 'all' }"
          @click="currentFilter = 'all'"
        >
          全部
        </button>
        <button 
          class="filter-pill anim-squash" 
          :class="{ active: currentFilter === 'featured' }"
          @click="currentFilter = 'featured'"
        >
          <span class="material-icons star-icon">star</span> 精选
        </button>
      </div>
    </div>

    <div class="gallery-container fade-in" style="animation-delay: 0.2s">
      <div v-if="loading" class="loading-state">
        <span class="material-icons spin">favorite</span>
        <p>正在加载美好的回忆...</p>
      </div>
      
      <div v-else-if="Object.keys(groupedImages).length === 0" class="empty-state">
        <p v-if="currentFilter === 'featured'">还没有精选照片，去管理页面标记一些吧...</p>
        <p v-else>还没有照片，期待未来的点点滴滴...</p>
      </div>

      <div v-else class="timeline-view">
        <div v-for="(group, dateKey) in groupedImages" :key="dateKey" class="timeline-group">
          <div class="timeline-header sticky-header">
            <h3 class="date-title">
              <span class="month">{{ formatMonth(dateKey) }}</span>
              <span class="year">{{ formatYear(dateKey) }}</span>
            </h3>
            <div class="timeline-line"></div>
          </div>
          
          <div class="photo-grid">
            <div 
              v-for="(image, index) in group" 
              :key="image.name" 
              class="photo-item anim-hover-lift"
              @click="openModal(image.url)"
            >
              <div class="photo-wrapper">
                <ProgressiveImage 
                  :src="image.url" 
                  :thumbnail="image.thumbnail" 
                  :alt="image.name"
                  :delay="index * 20" 
                />
                <div class="hover-overlay">
                  <span class="material-icons">zoom_in</span>
                </div>
                <div v-if="isFeatured(image)" class="featured-badge">
                  <span class="material-icons">star</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <transition name="modal">
      <div class="modal" v-if="showModal" @click="closeModal">
        <button class="close-btn" @click.stop="closeModal">
          <span class="material-icons">close</span>
        </button>
        <div class="modal-content" @click.stop>
          <img :src="modalImageUrl" alt="Full size memory">
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ProgressiveImage from '../components/ProgressiveImage.vue'

const loading = ref(true)
const images = ref([])
const showModal = ref(false)
const modalImageUrl = ref('')
const currentFilter = ref('all')
const featuredSet = ref(new Set())

// Format headers
const formatMonth = (dateKey) => {
  const [year, month] = dateKey.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('zh-CN', { month: 'long' })
}

const formatYear = (dateKey) => {
  const [year] = dateKey.split('-')
  return year
}

const isFeatured = (image) => featuredSet.value.has(image.url)

// Group images by YYYY-MM
const groupedImages = computed(() => {
  const groups = {}
  
  // Filter first
  let filtered = images.value
  if (currentFilter.value === 'featured') {
    filtered = images.value.filter(img => featuredSet.value.has(img.url))
  }
  
  // Sort images by date descending first
  const sorted = [...filtered].sort((a, b) => {
    return new Date(b.uploadedAt) - new Date(a.uploadedAt)
  })

  sorted.forEach(image => {
    if (!image.uploadedAt) return
    const date = new Date(image.uploadedAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(image)
  })
  
  return groups
})

// Open modal
const openModal = (imageUrl) => {
  modalImageUrl.value = imageUrl
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

// Close modal
const closeModal = () => {
  showModal.value = false
  setTimeout(() => {
    modalImageUrl.value = ''
  }, 300)
  document.body.style.overflow = 'auto'
}

// Fetch images
const fetchImages = async () => {
  try {
    const response = await fetch('/images.json')
    if (!response.ok) throw new Error('Failed to load index')
    const data = await response.json()
    images.value = data
    
    // Load featured
    const stored = localStorage.getItem('featured_images')
    if (stored) {
      featuredSet.value = new Set(JSON.parse(stored))
    }
  } catch (error) {
    console.error('Failed to fetch images:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchImages()
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
.gallery-page {
  padding-bottom: 100px;
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

.filter-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.filter-pill {
  background: white;
  border: 1px solid var(--gray-300);
  padding: 8px 24px;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

[data-theme="dark"] .filter-pill {
  background: var(--bg-card);
  border-color: var(--gray-300);
}

.filter-pill:hover {
  background: var(--gray-100);
  transform: translateY(-1px);
}

.filter-pill.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.star-icon {
  font-size: 18px;
}

.featured-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #ffc107;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.featured-badge .material-icons {
  font-size: 16px;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px;
  color: var(--text-tertiary);
}

.spin {
  animation: spin 2s infinite linear;
  font-size: 32px;
  color: var(--primary-color);
  margin-bottom: 16px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Timeline Layout */
.timeline-view {
  max-width: 1200px;
  margin: 0 auto;
}

.timeline-group {
  margin-bottom: 48px;
}

.timeline-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-top: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 10;
  top: 60px; /* Adjust based on navbar height */
}

.sticky-header {
  position: sticky;
}

[data-theme="dark"] .timeline-header {
  background: rgba(43, 10, 18, 0.9);
}

.date-title {
  display: flex;
  align-items: baseline;
  gap: 12px;
  min-width: 150px;
  color: var(--text-main);
  margin: 0;
}

.month {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--primary-dark);
}

.year {
  font-size: 1.2rem;
  color: var(--text-light);
  font-weight: 400;
}

.timeline-line {
  height: 1px;
  flex: 1;
  background: linear-gradient(to right, var(--primary-color), transparent);
  opacity: 0.3;
  margin-left: 16px;
}

/* Google Photos Grid Style */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 4px; /* Minimal gap like Google Photos */
}

.photo-item {
  aspect-ratio: 1; /* Square tiles */
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background: #f0f0f0;
}

.photo-wrapper {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

/* Hover Effect */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.hover-overlay .material-icons {
  color: white;
  font-size: 32px;
  transform: scale(0.8);
  transition: transform 0.2s ease;
}

.photo-item:hover .hover-overlay {
  opacity: 1;
}

.photo-item:hover .material-icons {
  transform: scale(1);
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95); /* Darker background */
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.modal-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: none;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  padding: 12px;
  z-index: 2001;
  border-radius: 50%;
  display: flex;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 columns on mobile */
    gap: 2px;
  }
  
  .timeline-header {
    top: 50px;
  }
  
  .month {
    font-size: 1.4rem;
  }
  
  .year {
    font-size: 1rem;
  }
}
</style>