<template>
  <div class="music-layout">
    <!-- Main Content -->
    <main class="music-main">
      <div class="content-container">
        <!-- Trending Header -->
        <section class="music-section">
           <h2 class="section-header">Trending <span class="sub-header">This week</span></h2>
           
           <!-- Horizontal Grid -->
           <div class="album-grid">
              <div 
                v-for="(track, index) in playlist" 
                :key="track.id" 
                class="album-card"
                @click="playTrack(index)"
              >
                 <div class="card-image">
                    <img :src="track.cover || '/default-cover.png'" loading="lazy">
                    <div class="hover-play-btn">
                       <span class="material-icons">play_arrow</span>
                    </div>
                 </div>
                 <div class="card-info">
                    <div class="card-title">{{ track.title }}</div>
                    <div class="card-artist">{{ track.artist }}</div>
                 </div>
              </div>
           </div>
        </section>

        <!-- Made For You -->
        <section class="music-section">
           <h2 class="section-header">Made For You</h2>
           <p class="section-desc">Inspired by your recent activity.</p>
           
           <div class="album-grid">
              <!-- Mock Data (Reusing playlist for visual fill) -->
              <div 
                v-for="(track, index) in [...playlist].reverse()" 
                :key="'mix-'+track.id" 
                class="album-card"
                 @click="playTrack(playlist.length - 1 - index)"
              >
                 <div class="card-image circle-variant">
                    <img :src="track.cover || '/default-cover.png'" loading="lazy">
                    <div class="hover-play-btn">
                       <span class="material-icons">play_arrow</span>
                    </div>
                 </div>
                 <div class="card-info">
                    <div class="card-title">Daily Mix {{ index + 1 }}</div>
                    <div class="card-artist">{{ track.artist }} Radio</div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useMusic } from '../composables/useMusic'

const loading = ref(true)
const { playlist, playTrack, loadPlaylist } = useMusic()

onMounted(async () => {
  if (playlist.value.length === 0) {
    try {
      const res = await fetch('/music.json')
      const tracks = await res.json()
      loadPlaylist(tracks)
    } catch (e) {
      console.error(e)
    }
  }
  loading.value = false
})
</script>

<style scoped>
.music-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-body); /* Standard white/light bg */
  color: var(--text-primary);
  padding-top: var(--vp-nav-height);
}

/* Main Content */
.music-main {
  flex: 1;
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 120px; /* Space for player */
}

.section-header {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
  text-transform: uppercase;
}

.sub-header {
  font-size: 16px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-left: 8px;
  text-transform: none;
}

.section-desc {
  color: var(--text-secondary);
  margin-top: -16px;
  margin-bottom: 32px;
  font-size: 15px;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
}

.album-card {
  background: transparent;
  padding: 0;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.album-card:hover {
  transform: translateY(-5px);
}

.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: box-shadow 0.3s ease;
}

.album-card:hover .card-image {
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circle-variant {
    border-radius: 50%;
}

.hover-play-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #000; /* Black button like Home page */
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.album-card:hover .hover-play-btn {
  opacity: 1;
  transform: translateY(0);
}

.card-title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-artist {
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .music-main {
      padding: 20px;
  }
  .album-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 20px;
  }
}
</style>