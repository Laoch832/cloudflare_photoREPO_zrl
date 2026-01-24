<template>
  <div class="music-page container">
    <div class="header">
      <h1 class="page-title">Music Library</h1>
      <p class="subtitle">{{ playlist.length }} songs</p>
    </div>

    <div class="loading-state" v-if="loading">
      <div class="spinner"></div>
    </div>

    <div class="song-list" v-else>
      <div 
        v-for="(track, index) in playlist" 
        :key="track.id" 
        class="song-item"
        :class="{ active: currentTrack && currentTrack.id === track.id }"
        @click="playTrack(index)"
      >
        <div class="song-cover">
          <img :src="track.cover || '/default-cover.png'" loading="lazy" alt="cover">
          <div class="playing-overlay" v-if="currentTrack && currentTrack.id === track.id && isPlaying">
            <div class="bar-wave">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
        </div>
        <div class="song-info">
          <h3 class="song-title">{{ track.title }}</h3>
          <p class="song-artist">{{ track.artist }}</p>
        </div>
        <div class="song-actions">
          <button class="action-btn">
            <span class="material-icons">more_horiz</span>
          </button>
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
  padding-top: 40px;
  padding-bottom: 120px;
}

.header {
  margin-bottom: 32px;
  padding-left: 16px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
}

.subtitle {
  color: #888;
  font-size: 16px;
}

.song-list {
  display: flex;
  flex-direction: column;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.song-item:hover {
  background-color: rgba(0,0,0,0.03);
}

.song-item.active {
  background-color: rgba(255, 77, 109, 0.08);
}

.song-cover {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 16px;
  position: relative;
  background-color: #eee;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bar-wave {
  display: flex;
  align-items: flex-end;
  height: 16px;
  gap: 2px;
}

.bar-wave span {
  width: 3px;
  background: #fff;
  animation: wave 1s infinite ease-in-out;
}

.bar-wave span:nth-child(1) { animation-delay: 0.0s; height: 60%; }
.bar-wave span:nth-child(2) { animation-delay: 0.1s; height: 100%; }
.bar-wave span:nth-child(3) { animation-delay: 0.2s; height: 50%; }
.bar-wave span:nth-child(4) { animation-delay: 0.3s; height: 80%; }

@keyframes wave {
  0%, 100% { height: 20%; }
  50% { height: 100%; }
}

.song-info {
  flex: 1;
  min-width: 0; /* Allow truncation */
}

.song-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-main);
}

.song-item.active .song-title {
  color: var(--primary-color);
}

.song-artist {
  font-size: 14px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.song-item:hover .song-actions {
  opacity: 1;
}

.action-btn {
  background: transparent;
  border: none;
  color: #888;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background-color: rgba(0,0,0,0.05);
  color: #000;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #eee;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Dark Mode */
[data-theme="dark"] .song-item:hover {
  background-color: rgba(255,255,255,0.05);
}

[data-theme="dark"] .song-item.active {
  background-color: rgba(255, 77, 109, 0.15);
}

[data-theme="dark"] .page-title {
  color: #fff;
}

[data-theme="dark"] .song-title {
  color: #eee;
}

[data-theme="dark"] .song-item.active .song-title {
  color: var(--primary-color);
}
</style>