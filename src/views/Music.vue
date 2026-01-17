<template>
  <div class="music-page container">
    <div class="header fade-in">
      <h1 class="cursive page-title">音乐墙</h1>
      <p class="subtitle">旋律里的故事</p>
    </div>

    <div class="music-wall fade-in" style="animation-delay: 0.2s">
      <div v-if="loading" class="loading-state">
        <span class="material-icons spin">music_note</span>
        <p>正在加载唱片...</p>
      </div>
      
      <div v-else-if="playlist.length === 0" class="empty-state">
        <p>还没有添加音乐...</p>
      </div>

      <div v-else class="cd-grid">
        <div 
          v-for="(track, index) in playlist" 
          :key="track.id" 
          class="cd-item"
          :class="{ active: currentTrack && currentTrack.id === track.id }"
          @click="playTrack(index)"
        >
          <div class="cd-wrapper">
            <div class="cd-disc" :class="{ spinning: currentTrack && currentTrack.id === track.id && isPlaying }">
              <img :src="track.cover || '/default-cover.png'" class="cd-cover" alt="Cover">
              <div class="cd-hole"></div>
            </div>
            <div class="cd-case"></div>
          </div>
          <div class="track-info">
            <h3 class="track-title">{{ track.title }}</h3>
            <p class="track-artist">{{ track.artist }}</p>
          </div>
          <div class="playing-indicator" v-if="currentTrack && currentTrack.id === track.id">
            <span class="material-icons">equalizer</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useMusic } from '../composables/useMusic'

const loading = ref(true)
const { playlist, playTrack, currentTrack, isPlaying, loadPlaylist } = useMusic()

onMounted(async () => {
  // If playlist is empty, try to fetch (though App.vue or Player usually does it)
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
.music-page {
  padding-bottom: 100px; /* Space for player */
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

.loading-state, .empty-state {
  text-align: center;
  padding: 60px;
  color: var(--text-light);
}

.spin {
  animation: spin 2s infinite linear;
}

/* CD Grid */
.cd-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 40px;
  padding: 20px;
}

.cd-item {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s;
}

.cd-item:hover {
  transform: translateY(-10px);
}

.cd-wrapper {
  width: 160px;
  height: 160px;
  margin: 0 auto 20px;
  position: relative;
}

.cd-disc {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #111;
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  overflow: hidden;
  transition: transform 0.3s;
}

.cd-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.cd-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: #f9fbfd; /* Match bg */
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.2);
}

.cd-disc.spinning {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.track-info {
  text-align: center;
}

.track-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  font-size: 0.85rem;
  color: var(--text-light);
}

.playing-indicator {
  position: absolute;
  top: -10px;
  right: 0;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .cd-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 20px;
    padding: 15px;
  }

  .cd-wrapper {
    width: 130px;
    height: 130px;
  }

  .cd-hole {
    width: 24px;
    height: 24px;
  }
  
  .track-title {
    font-size: 0.9rem;
  }
}
</style>