<template>
  <div class="min-h-screen w-full bg-[#121212] font-sans antialiased text-white pb-32">
    <!-- Top Navigation Pill -->
    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav class="ios-glass-nav px-1.5 py-1.5 rounded-full flex items-center gap-1 shadow-2xl border border-white/10">
        <router-link to="/" class="px-5 py-2.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all">
          Home
        </router-link>
        <div class="px-6 py-2.5 rounded-full bg-white/10 shadow-sm text-sm font-semibold text-white border border-white/5">
          Gallery
        </div>
        <router-link to="/diary" class="px-5 py-2.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all">
          Diary
        </router-link>
        <router-link to="/music" class="px-5 py-2.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all">
          Music
        </router-link>
      </nav>
    </div>

    <!-- Main Content -->
    <main class="pt-32 px-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-16 space-y-4">
        <h1 class="font-display text-5xl font-bold tracking-tight text-white">Visual Memories</h1>
        <p class="text-white/40 font-medium tracking-wide text-lg">Fragments of time, captured forever</p>
        
        <!-- Filter Tabs -->
        <div class="flex justify-center gap-2 mt-8">
          <button 
            v-for="filter in ['All', 'Favorites', 'Places', 'People']" 
            :key="filter"
            @click="currentFilter = filter.toLowerCase()"
            class="px-6 py-2 rounded-full text-sm font-medium transition-all border"
            :class="currentFilter === filter.toLowerCase() 
              ? 'bg-white text-black border-white' 
              : 'bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white'"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 flex justify-center">
        <div class="animate-spin size-8 border-2 border-primary/30 border-t-primary rounded-full"></div>
      </div>

      <!-- Masonry Grid -->
      <div v-else class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8 pb-20">
        <div 
          v-for="(image, index) in filteredImages" 
          :key="image.url" 
          class="break-inside-avoid mb-8 group cursor-pointer"
          @click="openModal(image)"
        >
          <div class="polaroid-frame bg-white p-3 pb-12 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-1 hover:z-10 relative">
            <!-- Image -->
            <div class="aspect-[4/5] w-full overflow-hidden bg-gray-100 relative">
              <img 
                :src="image.thumbnail || image.url" 
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                :alt="image.name"
              >
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
            
            <!-- Caption -->
            <div class="absolute bottom-3 left-4 right-4">
              <p class="font-handwritten text-gray-800 text-xl truncate transform -rotate-1 opacity-90">{{ image.name || 'Untitled Memory' }}</p>
              <p class="font-sans text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">{{ formatDate(image.uploadedAt) }}</p>
            </div>

            <!-- Sticker (Random decoration) -->
            <div v-if="index % 3 === 0" class="absolute -top-3 -right-3 size-8 rounded-full bg-yellow-300/80 shadow-sm z-20 transform rotate-12"></div>
            <div v-if="index % 5 === 0" class="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-6 bg-rose-200/50 transform -rotate-2 z-20 backdrop-blur-sm"></div>
          </div>
        </div>
      </div>
    </main>

    <!-- Lightbox Modal -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="selectedImage" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8" @click="selectedImage = null">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl"></div>
        <div class="relative max-w-5xl w-full max-h-full flex flex-col items-center" @click.stop>
          <img :src="selectedImage.url" class="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm" :alt="selectedImage.name">
          <div class="mt-6 text-center">
            <h3 class="text-white text-2xl font-display font-bold">{{ selectedImage.name }}</h3>
            <p class="text-white/50 mt-1">{{ formatDate(selectedImage.uploadedAt) }}</p>
          </div>
          <button @click="selectedImage = null" class="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors">
            <span class="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { fetchJsonCached } from '../lib/fetchJsonCached'

const images = ref([])
const loading = ref(true)
const currentFilter = ref('all')
const selectedImage = ref(null)
const featuredSet = ref(new Set())

const fetchImages = async () => {
  try {
    const data = await fetchJsonCached('/images.json')
    images.value = data
    
    // Load featured
    const { data: featuredData } = await supabase
      .from('featured_images')
      .select('url')
    
    if (featuredData) {
      featuredSet.value = new Set(featuredData.map(item => item.url))
    }
  } catch (error) {
    console.error('Failed to fetch images:', error)
  } finally {
    loading.value = false
  }
}

const filteredImages = computed(() => {
  if (currentFilter.value === 'favorites') {
    return images.value.filter(img => featuredSet.value.has(img.url))
  }
  return images.value
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown Date'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const openModal = (image) => {
  selectedImage.value = image
}

onMounted(() => {
  fetchImages()
})
</script>

<style scoped>
.polaroid-frame {
  backface-visibility: hidden;
}
</style>
