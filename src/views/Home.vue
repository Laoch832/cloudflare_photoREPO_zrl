<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-text">
        <h1 class="main-title">高岭之花</h1>
        <h2 class="sub-title">世界最好的女孩</h2>
        <p class="tag"># The world 1st girl</p>
        <router-link to="/gallery" class="black-pill-btn">
          Fetch more photos
        </router-link>
      </div>
      <div class="hero-image-wrapper">
        <ProgressiveImage 
          v-if="randomPhoto"
          :src="randomPhoto.url" 
          :thumbnail="randomPhoto.thumbnail" 
          :alt="randomPhoto.name"
          class="hero-image"
        />
        <div v-else class="placeholder-image"></div>
      </div>
    </section>

    <!-- Content Grid -->
    <section class="content-section">
      <!-- Item 1: Note/Diary -->
      <div class="grid-item text-left" v-if="latestNote">
        <div class="item-content">
          <h3 class="item-title">追光</h3>
          <p class="item-meta">(正文部分)</p>
          <p class="item-excerpt">{{ latestNote.summary }}</p>
          <router-link :to="'/notes#' + latestNote.id" class="black-rect-btn">
            前往日记本查看全文
          </router-link>
        </div>
      </div>
      
      <!-- Item 2: Image -->
      <div class="grid-item image-right" v-if="featuredImages[0]">
         <ProgressiveImage 
          :src="featuredImages[0].url" 
          :thumbnail="featuredImages[0].thumbnail" 
          class="content-image noise-effect"
        />
      </div>

      <!-- Item 3: Image -->
      <div class="grid-item image-left" v-if="featuredImages[1]">
         <ProgressiveImage 
          :src="featuredImages[1].url" 
          :thumbnail="featuredImages[1].thumbnail" 
          class="content-image blur-effect"
        />
      </div>

      <!-- Item 4: Note/Diary -->
      <div class="grid-item text-right" v-if="secondNote">
        <div class="item-content">
          <h3 class="item-title">追光</h3>
          <p class="item-meta">(正文部分)</p>
          <p class="item-excerpt">{{ secondNote.summary }}</p>
          <router-link :to="'/notes#' + secondNote.id" class="black-rect-btn">
            前往日记本查看全文
          </router-link>
        </div>
      </div>
    </section>

    <!-- Big Footer Text -->
    <div class="big-footer">
      Lookingforward Forever.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ProgressiveImage from '../components/ProgressiveImage.vue'

const loading = ref(true)
const images = ref([])
const notes = ref([])
const randomPhoto = ref(null)

const featuredImages = computed(() => {
  if (images.value.length < 2) return []
  // Return different images than randomPhoto if possible
  return images.value.filter(img => img !== randomPhoto.value).slice(0, 2)
})

const latestNote = computed(() => {
  if (notes.value.length === 0) return null
  return [...notes.value].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
})

const secondNote = computed(() => {
  if (notes.value.length < 2) return null
  return [...notes.value].sort((a, b) => new Date(b.date) - new Date(a.date))[1]
})

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
.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #000;
}

/* Hero Section */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 120px;
  padding-top: 40px;
}

.hero-text {
  flex: 1;
  padding-right: 40px;
}

.main-title {
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.sub-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}

.tag {
  color: #666;
  font-size: 16px;
  margin-bottom: 32px;
}

.hero-image-wrapper {
  flex: 1;
  max-width: 500px;
}

.hero-image {
  width: 100%;
  border-radius: 0; /* Sharp corners as per design usually, or slight rounded */
  object-fit: cover;
  aspect-ratio: 4/3;
}

/* Buttons */
.black-pill-btn {
  display: inline-block;
  background-color: #000;
  color: #fff;
  padding: 10px 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
}

.black-pill-btn:hover {
  transform: scale(1.05);
}

.black-rect-btn {
  display: inline-block;
  background-color: #000;
  color: #fff;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s;
}

.black-rect-btn:hover {
  opacity: 0.8;
}

/* Content Grid */
.content-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 80px 40px;
  margin-bottom: 120px;
}

.grid-item {
  display: flex;
  flex-direction: column;
}

.item-content {
  max-width: 400px;
}

.item-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.item-meta {
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
}

.item-excerpt {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-image {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  border-radius: 8px;
}

.noise-effect {
  filter: contrast(1.1) brightness(1.1);
  /* Note: True noise requires SVG or canvas, simple filter here */
}

/* Alignment Helpers */
.text-left {
  align-items: flex-start;
  justify-content: center;
}

.text-right {
  align-items: flex-start; /* Design shows text aligned left even in right column usually */
  justify-content: center;
}

.image-right {
  align-items: flex-end;
}

.image-left {
  align-items: flex-start;
}

/* Footer */
.big-footer {
  font-size: 48px;
  font-weight: 900;
  text-align: left;
  letter-spacing: -0.02em;
  margin-top: 80px;
  border-top: 1px solid #eee;
  padding-top: 40px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column-reverse;
    gap: 40px;
  }
  
  .hero-text {
    padding-right: 0;
  }
  
  .main-title {
    font-size: 42px;
  }
  
  .content-section {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  .image-right {
    align-items: flex-start;
  }
  
  .big-footer {
    font-size: 32px;
  }
}
</style>