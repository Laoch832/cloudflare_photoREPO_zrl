<template>
  <div class="font-display overflow-hidden text-white antialiased min-h-screen relative bg-black">
    <div class="fixed inset-0 z-0">
      <div class="absolute inset-0 environment-bg"></div>
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="absolute inset-0 grain-layer"></div>
    </div>
    
    <main class="relative z-10 min-h-screen w-full pt-24 pb-32 flex flex-col items-center">
      <div class="w-full max-w-7xl flex flex-col px-4 md:px-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 mt-8">
          <div class="max-w-xl">
            <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Visual Echoes</h1>
            <p class="text-white/40 text-lg md:text-xl font-light italic leading-relaxed">Capturing the silence between our shared glances.</p>
          </div>
          <div class="flex gap-3">
            <button class="ios-glass px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">Collections</button>
            <button class="bg-white text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-2xl active:scale-95">
              <span class="material-symbols-outlined text-[20px]">photo_camera</span>
              Add Memory
            </button>
          </div>
        </div>

        <!-- Image Grid - Mobile App Style -->
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div v-if="loading" class="flex items-center justify-center h-64">
            <div class="text-white/50">Loading memories...</div>
          </div>
          <div v-else-if="images.length === 0" class="flex items-center justify-center h-64">
             <div class="text-white/50">No memories found.</div>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 md:gap-2">
            <div v-for="(image, index) in images" :key="image.name" 
                 @click="openImage(image)"
                 class="aspect-square overflow-hidden cursor-pointer group relative">
              <img :src="image.thumbnail || image.url" 
                   :alt="image.name"
                   class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                   loading="lazy" />
              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-3">
                <p class="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate w-full">
                  {{ formatName(image.name) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Image Viewer Modal -->
    <div v-if="selectedImage" 
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
         @click.self="closeImage">
      <button @click="closeImage" 
              class="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10">
        <span class="material-symbols-outlined text-3xl">close</span>
      </button>
      
      <div class="relative max-w-[90vw] max-h-[90vh]">
        <img :src="selectedImage.url" 
             :alt="selectedImage.name"
             class="max-w-full max-h-[90vh] object-contain" />
        <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p class="text-white text-lg font-medium">{{ formatName(selectedImage.name) }}</p>
          <p class="text-white/50 text-sm">{{ formatDate(selectedImage.uploadedAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchJsonCached } from '../lib/fetchJsonCached'

const images = ref([])
const loading = ref(true)
const selectedImage = ref(null)

const formatName = (filename) => {
  return filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ")
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

const openImage = (image) => {
  selectedImage.value = image
}

const closeImage = () => {
  selectedImage.value = null
}

onMounted(async () => {
  try {
    images.value = await fetchJsonCached('/images.json')
  } catch (e) {
    console.error('Failed to load images:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.ios-glass {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 0.5px solid rgba(0, 0, 0, 0.05);
}

:global(.dark) .ios-glass {
  background: rgba(255, 255, 255, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
}

.environment-bg {
  background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXW2-dWMIb9nb69pFxqgWF7OjEVTqxBGud9l62LjCGje6QYLW0TpLpG3jOFlHv-z5CZD60v2dvnQA8g4NcGVXQm7Ka1ZGcr_c-npxxgI4vNovr6ZqcA-z7Jc5rqgHm42d0lIEpIKHeKL6MQsJFMafHXWiOjAxvw4Be6V-G5y61K5Pk6YQPA_M4ntbSc6J2j3J_rHlx_KFT1MoLg3izPeQz_LrngZ8IAbAZzPjEDzWhGFrvUaREvZ7mbwYC0o9q1n3bvITB34XG2Ic");
  background-size: cover;
  background-position: center;
  filter: blur(50px) brightness(0.5);
  transform: scale(1.15);
}

.grain-layer {
  background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuAhnN-c6-tvXKaxxtWEFk8ZQ6RmbkLBI9Tu3bsqNWc-EIPrnIwFFRSj6SdSMguirLBW_gm94P5Y2OfA3J2XQBfkhZgrYcHhvUEpBxEQiVEbD7hj4QtmWuNnHY71OiDBpv1kJQ9AmYeBR77LP1veXhxeixWY7W6W4nW_ZrfbKE-_2uQwCxxENnLox1oSeRRNOAl-gY0dU6I5uAL8epYCXkjqJrdRJdCMhSB6D7EsGHgN5HbhfD6GgiDGaqZyRtPPTn9ey14wZWXrObY);
  opacity: 0.04;
  pointer-events: none;
}
</style>
