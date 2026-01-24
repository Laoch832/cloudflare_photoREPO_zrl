<template>
  <div class="music-layout">
    <!-- Sidebar (Desktop) -->
    <aside class="music-sidebar">
       <div class="sidebar-logo">
         <span class="material-icons">music_note</span> Music
       </div>
       
       <nav class="sidebar-nav">
         <div class="nav-item active">
            <span class="material-icons">home</span> Home
         </div>
         <div class="nav-item">
            <span class="material-icons">search</span> Browse
         </div>
         <div class="nav-item">
            <span class="material-icons">radio</span> Radio
         </div>
       </nav>

       <div class="sidebar-section">
         <div class="section-title">LIBRARY</div>
         <div class="nav-item"><span class="material-icons">favorite_border</span> Liked Songs</div>
         <div class="nav-item"><span class="material-icons">history</span> Recently Played</div>
         <div class="nav-item"><span class="material-icons">album</span> Albums</div>
       </div>
    </aside>

    <!-- Main Content -->
    <main class="music-main">
      <div class="content-container">
        <!-- Trending Header -->
        <section class="music-section">
           <h2 class="section-header">TRENDING <span class="sub-header">This week</span></h2>
           
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
           <h2 class="section-header">MADE FOR YOU</h2>
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
  background-color: #121212; /* Spotify Dark */
  color: #fff;
  padding-top: var(--vp-nav-height); /* Clear global nav */
}

/* Sidebar */
.music-sidebar {
  width: 240px;
  background-color: #000;
  padding: 24px;
  flex-shrink: 0;
  display: none; /* Hidden on mobile by default */
}

@media (min-width: 769px) {
  .music-sidebar {
    display: block;
    position: fixed;
    top: var(--vp-nav-height);
    bottom: 90px; /* Player height */
    left: 0;
    overflow-y: auto;
  }
  .music-main {
      margin-left: 240px;
  }
}

.sidebar-logo {
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  letter-spacing: -1px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
  color: #b3b3b3;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-item:hover, .nav-item.active {
  color: #fff;
}

.nav-item .material-icons {
  font-size: 24px;
}

.nav-item.active {
  border-left: 3px solid var(--primary-color);
  padding-left: 13px; /* Compensate for border */
}

.sidebar-section {
  margin-top: 32px;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #b3b3b3;
  letter-spacing: 1.5px;
  margin-bottom: 16px;
}

/* Main Content */
.music-main {
  flex: 1;
  padding: 32px;
  background: linear-gradient(180deg, #1e1e1e 0%, #121212 100%);
  padding-bottom: 120px; /* Space for player */
}

.section-header {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.sub-header {
  font-size: 14px;
  color: #b3b3b3;
  font-weight: 400;
  margin-left: 8px;
}

.section-desc {
  color: #b3b3b3;
  margin-top: -16px;
  margin-bottom: 24px;
  font-size: 14px;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.album-card {
  background: #181818;
  padding: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.album-card:hover {
  background: #282828;
}

.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 16px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circle-variant {
    border-radius: 50%; /* For radio/artist style */
}

.hover-play-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-color); /* Green in Spotify, keeping our brand color */
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.album-card:hover .hover-play-btn {
  opacity: 1;
  transform: translateY(0);
}

.card-title {
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-artist {
  font-size: 14px;
  color: #b3b3b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .music-main {
      padding: 16px;
  }
  .album-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
  }
}
</style>