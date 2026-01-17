<template>
  <transition name="player-fly">
    <div 
      v-if="currentTrack" 
      class="music-player" 
      :class="{ minimized: isMinimized }"
      @click="expandPlayer"
    >
      <!-- Minimized View (Navbar Pill) -->
      <div v-if="isMinimized" class="minimized-content">
        <div class="mini-visualizer">
          <div class="bar" :class="{ animating: isPlaying }"></div>
          <div class="bar" :class="{ animating: isPlaying }"></div>
          <div class="bar" :class="{ animating: isPlaying }"></div>
        </div>
        <span class="mini-title">{{ currentTrack.title }}</span>
        <button class="mini-btn" @click.stop="togglePlay">
          <span class="material-icons">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
        </button>
      </div>

      <!-- Expanded View (Floating Card) -->
      <div v-else class="expanded-content">
        <div class="player-header">
          <button class="minimize-btn" @click.stop="toggleMinimize">
            <span class="material-icons">expand_more</span>
          </button>
        </div>
        
        <div class="album-art">
          <img :src="currentTrack.cover || '/default-cover.png'" alt="Album Art" :class="{ spinning: isPlaying }">
          <div class="vinyl-center"></div>
        </div>

        <div class="track-info">
          <h3>{{ currentTrack.title }}</h3>
          <p>{{ currentTrack.artist }}</p>
        </div>

        <div class="controls">
          <button class="control-btn small" @click.stop="toggleShuffle" :class="{ active: isShuffled }">
            <span class="material-icons">shuffle</span>
          </button>
          <button class="control-btn" @click.stop="prevTrack">
            <span class="material-icons">skip_previous</span>
          </button>
          <button class="control-btn play-btn" @click.stop="togglePlay">
            <span class="material-icons">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
          </button>
          <button class="control-btn" @click.stop="nextTrack">
            <span class="material-icons">skip_next</span>
          </button>
          <button class="control-btn small">
            <span class="material-icons">favorite_border</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMusic } from '../composables/useMusic'

const { 
  currentTrack, 
  isPlaying, 
  isMinimized, 
  isShuffled,
  togglePlay, 
  nextTrack, 
  prevTrack, 
  toggleMinimize,
  toggleShuffle,
  loadPlaylist,
  playTrack
} = useMusic()

const expandPlayer = () => {
  if (isMinimized.value) {
    toggleMinimize()
  }
}

// Fetch music on mount
onMounted(async () => {
  if (!currentTrack.value) {
    try {
      const res = await fetch('/music.json')
      const tracks = await res.json()
      if (tracks.length > 0) {
        loadPlaylist(tracks)
        // Auto play first track (might be blocked by browser policy without interaction, but user asked for it)
        // We'll try, but usually needs a click.
        // Actually user said "Open automatically play". 
        // We'll try to play immediately.
        setTimeout(() => {
           playTrack(0)
        }, 1000)
      }
    } catch (e) {
      console.error('Failed to load music:', e)
    }
  }
})
</script>

<style scoped>
.music-player {
  position: fixed;
  z-index: 1000;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

/* Expanded State */
.music-player:not(.minimized) {
  bottom: 30px;
  right: 30px;
  width: 300px;
  height: 450px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

[data-theme="dark"] .music-player:not(.minimized) {
  background: rgba(30, 30, 30, 0.85);
  border-color: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Minimized State */
.music-player.minimized {
  top: 14px; /* Align with navbar */
  right: 180px; /* Position next to other nav items */
  width: 180px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

[data-theme="dark"] .music-player.minimized {
  background: rgba(50, 50, 50, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Expanded Content */
.player-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.minimize-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 4px;
}

.album-art {
  width: 220px;
  height: 220px;
  margin: 0 auto 20px;
  position: relative;
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.album-art img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  animation: spin 10s linear infinite;
  animation-play-state: paused;
}

.album-art img.spinning {
  animation-play-state: running;
}

.vinyl-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: #1a1a1a;
  border-radius: 50%;
  border: 2px solid white;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.track-info {
  text-align: center;
  margin-bottom: 20px;
}

.track-info h3 {
  font-size: 1.2rem;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-info p {
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.control-btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(0,0,0,0.05);
}

.control-btn.active {
  color: var(--primary-color);
}

.play-btn {
  background: var(--primary-color);
  color: white;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.4);
}

.play-btn:hover {
  background: var(--primary-dark);
  transform: scale(1.1);
}

/* Minimized Content */
.minimized-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.mini-visualizer {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 16px;
}

.bar {
  width: 3px;
  background: var(--primary-color);
  height: 4px;
  border-radius: 1px;
}

.bar.animating {
  animation: visualize 0.5s ease-in-out infinite alternate;
}

.bar:nth-child(2) { animation-delay: 0.1s; }
.bar:nth-child(3) { animation-delay: 0.2s; }

@keyframes visualize {
  from { height: 4px; }
  to { height: 16px; }
}

.mini-title {
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  font-weight: 500;
}

.mini-btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .music-player:not(.minimized) {
    width: 90%;
    max-width: 350px;
    right: 50%;
    transform: translateX(50%);
    bottom: 100px; /* Above the bottom nav */
    height: auto;
    min-height: 400px;
  }
  
  .music-player.minimized {
    right: 60px; /* Left of theme button */
    top: 18px; /* Align with navbar center */
    width: auto;
    max-width: 140px;
    padding: 0 8px;
    height: 36px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
  
  .music-player.minimized .mini-title {
    display: block; /* Show title */
    font-size: 0.75rem;
    max-width: 80px;
  }
  
  .music-player.minimized .mini-btn {
    display: flex;
    padding: 2px;
  }
  
  .music-player.minimized .mini-visualizer {
    display: none; /* Hide visualizer to save space */
  }
}
</style>