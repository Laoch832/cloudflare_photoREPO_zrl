<template>
  <div class="progressive-image" :class="{ loaded: isLoaded }" ref="container">
    <img 
      v-if="thumbnail" 
      :src="thumbnail" 
      class="thumbnail" 
      alt="" 
      aria-hidden="true"
    >
    <img 
      v-if="shouldLoad"
      :src="src" 
      :alt="alt" 
      class="full-image" 
      @load="onLoad"
      loading="lazy"
      decoding="async"
    >
    <div v-if="!thumbnail && !isLoaded" class="placeholder">
      <span class="material-icons spin">favorite</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Image'
  },
  delay: {
    type: Number,
    default: 0
  }
})

const container = ref(null)
const shouldLoad = ref(false)
const isLoaded = ref(false)
let observer = null
let delayTimer = 0

const onLoad = () => {
  isLoaded.value = true
}

onMounted(() => {
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) {
        // Delay loading to prioritize other content (like docs)
        delayTimer = setTimeout(() => {
          shouldLoad.value = true
          delayTimer = 0
        }, props.delay)
        observer.disconnect()
      }
    }, {
      rootMargin: '50px' // Start loading slightly before
    })
    
    if (container.value) {
      observer.observe(container.value)
    }
  } else {
    // Fallback for old browsers
    shouldLoad.value = true
  }
})

onUnmounted(() => {
  if (delayTimer) {
    clearTimeout(delayTimer)
    delayTimer = 0
  }
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.progressive-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f0f0f0;
}

.thumbnail, .full-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.8s ease;
}

.thumbnail {
  filter: blur(10px);
  transform: scale(1.1); /* Prevent white edges from blur */
  opacity: 1;
  z-index: 1;
}

.full-image {
  opacity: 0;
  z-index: 2;
}

.loaded .full-image {
  opacity: 1;
}

.loaded .thumbnail {
  opacity: 0;
}

.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  z-index: 0;
}

.spin {
  animation: spin 2s infinite linear;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
