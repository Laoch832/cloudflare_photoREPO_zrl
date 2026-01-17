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

      <!-- Expanded View (Slim Progress Bar Player) -->
      <div v-else class="expanded-content">
        <!-- Top: Progress Bar -->
        <div class="progress-container" @click.stop="seekTo">
          <div class="progress-bg"></div>
          <div class="progress-buffer" :style="{ width: bufferPercent + '%' }"></div>
          <div class="progress-current" :style="{ width: progressPercent + '%' }"></div>
          <div class="time-tooltip" :style="{ left: progressPercent + '%' }">
            {{ formatTime(currentTime) }}
          </div>
        </div>

        <div class="player-body">
          <!-- Left: Info -->
          <div class="track-info-slim">
            <img :src="currentTrack.cover || '/default-cover.png'" class="mini-cover" :class="{ spinning: isPlaying }">
            <div class="text-info">
              <h3 class="track-title">{{ currentTrack.title }}</h3>
              <p class="track-artist">{{ currentTrack.artist }}</p>
            </div>
          </div>

          <!-- Center: Controls -->
          <div class="controls-slim">
            <button class="control-btn small" @click.stop="toggleShuffle" :class="{ active: isShuffled }">
              <span class="material-icons">shuffle</span>
            </button>
            <button class="control-btn" @click.stop="prevTrack">
              <span class="material-icons">skip_previous</span>
            </button>
            <button class="control-btn play-btn-slim" @click.stop="togglePlay">
              <span class="material-icons">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
            </button>
            <button class="control-btn" @click.stop="nextTrack">
              <span class="material-icons">skip_next</span>
            </button>
          </div>

          <!-- Right: Actions -->
          <div class="actions-slim">
            <span class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
            <button class="minimize-btn" @click.stop="toggleMinimize">
              <span class="material-icons">expand_more</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useMusic } from '../composables/useMusic'

const { 
  currentTrack, 
  isPlaying, 
  isMinimized, 
  isShuffled,
  currentTime,
  duration,
  buffered,
  togglePlay, 
  nextTrack, 
  prevTrack, 
  toggleMinimize,
  toggleShuffle,
  loadPlaylist,
  playTrack,
  seek
} = useMusic()

const expandPlayer = () => {
  if (isMinimized.value) {
    toggleMinimize()
  }
}

// Progress calculations
const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const bufferPercent = computed(() => {
  if (!duration.value) return 0
  return (buffered.value / duration.value) * 100
})

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const seekTo = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const width = rect.width
  const percent = x / width
  const time = percent * duration.value
  seek(time)
}

// Fetch music on mount
onMounted(async () => {
  if (!currentTrack.value) {
    try {
      const res = await fetch('/music.json')
      const tracks = await res.json()
      if (tracks.length > 0) {
        loadPlaylist(tracks)
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

/* Expanded State (Slim Bar) */
.music-player:not(.minimized) {
  bottom: 30px;
  right: 50%; /* Center horizontally */
  transform: translateX(50%);
  width: 600px;
  height: 80px; /* Slim height */
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 0;
  display: flex;
  flex-direction: column;
}

[data-theme="dark"] .music-player:not(.minimized) {
  background: rgba(30, 30, 30, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Progress Bar */
.progress-container {
  height: 4px;
  width: 100%;
  position: relative;
  cursor: pointer;
  background: rgba(0,0,0,0.05);
}

.progress-container:hover {
  height: 8px; /* Expand on hover */
}

.progress-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.progress-buffer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(0,0,0,0.1);
  transition: width 0.2s;
}

[data-theme="dark"] .progress-buffer {
  background: rgba(255,255,255,0.1);
}

.progress-current {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--primary-color);
  transition: width 0.1s linear;
}

.progress-container:hover .progress-current::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: var(--primary-color);
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.time-tooltip {
  position: absolute;
  top: -25px;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.progress-container:hover .time-tooltip {
  opacity: 1;
}

/* Player Body */
.player-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.track-info-slim {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 30%;
}

.mini-cover {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
}

.text-info {
  overflow: hidden;
}

.track-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  font-size: 0.8rem;
  color: var(--text-light);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls-slim {
  display: flex;
  align-items: center;
  gap: 16px;
}

.play-btn-slim {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 77, 109, 0.3);
}

.play-btn-slim:hover {
  transform: scale(1.1);
  background: var(--primary-dark);
}

.control-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
}

.control-btn:hover {
  background: rgba(0,0,0,0.05);
}

.control-btn.active {
  color: var(--primary-color);
}

.actions-slim {
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.time-display {
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
}

.minimize-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 4px;
}

/* Minimized State (Keep existing) */
.music-player.minimized {
  top: 14px;
  right: 180px;
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
    height: 140px; /* Taller for mobile to stack info */
    padding: 10px;
    bottom: 80px; /* Avoid nav */
  }
  
  .player-body {
    flex-direction: column;
    padding: 0;
    gap: 10px;
  }
  
  .track-info-slim {
    width: 100%;
    justify-content: flex-start;
  }
  
  .controls-slim {
    width: 100%;
    justify-content: center;
    gap: 24px;
  }
  
  .actions-slim {
    position: absolute;
    top: 10px;
    right: 10px;
    width: auto;
  }

  .time-display {
    display: none; /* Hide time on mobile to save space, tooltip exists */
  }

  /* Minimized mobile adjustments */
  .music-player.minimized {
    right: 60px;
    top: 18px;
    width: auto;
    max-width: 140px;
    padding: 0 8px;
    height: 36px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
  
  .music-player.minimized .mini-title {
    display: block;
    font-size: 0.75rem;
    max-width: 80px;
  }
  
  .music-player.minimized .mini-btn {
    display: flex;
    padding: 2px;
  }
  
  .music-player.minimized .mini-visualizer {
    display: none;
  }
}
</style>