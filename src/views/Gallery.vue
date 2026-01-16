<template>
  <div class="gallery-page container">
    <div class="header fade-in">
      <h1 class="cursive page-title">Our Memories</h1>
      <p class="subtitle">Every moment with you is a treasure</p>
    </div>

    <div class="gallery-container fade-in" style="animation-delay: 0.2s">
      <div v-if="loading" class="loading-state">
        <span class="material-icons spin">favorite</span>
        <p>Loading sweet memories...</p>
      </div>
      
      <div v-else-if="images.length === 0" class="empty-state">
        <p>No photos yet. Let's make some memories!</p>
      </div>

      <div v-else class="masonry-grid">
        <div 
          v-for="(image, index) in images" 
          :key="image.name" 
          class="gallery-item"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="openModal(image.url)"
        >
          <div class="polaroid">
            <div class="image-wrapper">
              <img :src="image.url" :alt="image.name" loading="lazy">
            </div>
            <div class="caption">
              <span class="date">{{ formatDate(image.uploadedAt) }}</span>
              <span class="heart-icon">❤</span>
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
import { ref, onMounted, onUnmounted } from 'vue'

const loading = ref(true)
const images = ref([])
const showModal = ref(false)
const modalImageUrl = ref('')

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'Unforgotten'
  return new Date(dateString).toLocaleDateString()
}

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
    const data = await response.json()
    // Sort by date descending if possible, assuming data has dates or use filename
    // data.sort(...) 
    images.value = data
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
  padding-bottom: 60px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 4rem;
  color: var(--primary-dark);
  margin-bottom: 10px;
}

.subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px;
  color: var(--text-light);
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

/* Masonry Grid */
.masonry-grid {
  column-count: 3;
  column-gap: 24px;
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 24px;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
  cursor: pointer;
}

@keyframes fadeInUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.polaroid {
  background: white;
  padding: 12px 12px 40px 12px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  position: relative;
  border-radius: 2px;
}

[data-theme="dark"] .polaroid {
  background: var(--card-bg);
}

.polaroid:hover {
  transform: translateY(-5px) rotate(1deg);
  box-shadow: var(--shadow-lg);
  z-index: 10;
}

.image-wrapper {
  width: 100%;
  overflow: hidden;
  background: #f0f0f0;
}

.image-wrapper img {
  width: 100%;
  display: block;
  transition: transform 0.5s ease;
}

.polaroid:hover img {
  transform: scale(1.05);
}

.caption {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
  font-family: 'Indie Flower', cursive; /* Fallback to cursive */
  color: var(--text-main);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.heart-icon {
  color: var(--primary-color);
  font-size: 14px;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  max-width: 90%;
  max-height: 90vh;
}

.modal-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  border-radius: 4px;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 10px;
  z-index: 2001;
}

.close-btn span {
  font-size: 32px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .masonry-grid {
    column-count: 2;
  }
}

@media (max-width: 600px) {
  .masonry-grid {
    column-count: 1;
  }
  
  .page-title {
    font-size: 3rem;
  }
}
</style>