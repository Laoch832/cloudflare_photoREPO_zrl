<template>
  <div class="container">
    <div class="section-card">
      <h1>图库</h1>
      <div id="gallery-container" class="gallery-grid">
        <div v-if="loading" style="text-align: center; grid-column: 1 / -1; color: var(--secondary-text);">Loading...</div>
        <div v-else-if="images.length === 0" style="text-align: center; grid-column: 1 / -1; color: var(--secondary-text);">暂无图片</div>
        <div 
          v-for="image in images" 
          :key="image.name" 
          class="gallery-item ripple"
          @click="openModal(image.url)"
        >
          <img :src="image.url" :alt="image.name" loading="lazy">
          <div class="gallery-item-info">
            <div class="gallery-item-title">{{ image.name }}</div>
            <div class="gallery-item-date">{{ formatDate(image.uploadedAt) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Image Modal -->
  <div id="imageModal" class="modal" v-if="showModal">
    <span class="modal-close" @click="closeModal">&times;</span>
    <img class="modal-content" :src="modalImageUrl" :alt="'Preview'">
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const images = ref([])
const showModal = ref(false)
const modalImageUrl = ref('')

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Open modal
const openModal = (imageUrl) => {
  modalImageUrl.value = imageUrl
  showModal.value = true
  // Prevent scrolling when modal is open
  document.body.style.overflow = 'hidden'
}

// Close modal
const closeModal = () => {
  showModal.value = false
  modalImageUrl.value = ''
  // Allow scrolling when modal is closed
  document.body.style.overflow = 'auto'
}

// Fetch images data
const fetchImages = async () => {
  try {
    const response = await fetch('/images.json')
    const data = await response.json()
    images.value = data
  } catch (error) {
    console.error('Failed to fetch images:', error)
  } finally {
    loading.value = false
  }
}

// Close modal when clicking outside
const handleClickOutside = (event) => {
  if (event.target.id === 'imageModal') {
    closeModal()
  }
}

// Initialize component
onMounted(() => {
  fetchImages()
  // Add event listener for clicking outside modal
  window.addEventListener('click', handleClickOutside)
})

// Cleanup event listener
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  // Make sure scrolling is enabled when component is unmounted
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 100px auto 40px;
  padding: 0 24px;
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

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.gallery-item {
  background: var(--bg-color);
  border-radius: var(--md-sys-shape-corner-medium);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;
  cursor: pointer;
}

.gallery-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.gallery-item-info {
  padding: 16px;
}

.gallery-item-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gallery-item-date {
  font-size: 12px;
  color: var(--secondary-text);
}

/* Modal for image preview */
.modal {
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.9);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
  cursor: pointer;
}

.modal-close:hover, .modal-close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

/* Ripple Effect */
.ripple {
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}
.ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .5s, opacity 1s;
}
.ripple:active:after {
  transform: scale(0, 0);
  opacity: .2;
  transition: 0s;
}

@media (max-width: 800px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
