<template>
  <transition name="slide-up">
    <div v-if="currentTrack" class="bottom-player-bar" @click="toggleExpand">
      <div class="player-container">
        <!-- Left: Track Info -->
        <div class="player-left">
          <img :src="currentTrack.cover || '/default-cover.png'" class="cover-thumb">
          <div class="info-text">
            <span class="title">{{ currentTrack.title }}</span>
            <span class="artist">{{ currentTrack.artist }}</span>
          </div>
          <button class="icon-btn like-btn">
            <span class="material-icons">favorite_border</span>
          </button>
        </div>

        <!-- Center: Controls & Progress -->
        <div class="player-center">
          <div class="controls-row">
             <button class="icon-btn small" @click.stop="toggleShuffle" :class="{ active: isShuffled }" title="随机播放">
              <span class="material-icons">shuffle</span>
            </button>
            <button class="icon-btn" @click.stop="prevTrack" title="上一首">
              <span class="material-icons">skip_previous</span>
            </button>
            <button class="play-btn-circle" @click.stop="togglePlay" title="播放/暂停">
              <span class="material-icons">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
            </button>
            <button class="icon-btn" @click.stop="nextTrack" title="下一首">
              <span class="material-icons">skip_next</span>
            </button>
             <button class="icon-btn small" title="循环播放">
              <span class="material-icons">repeat</span>
            </button>
          </div>
          
          <div class="progress-row">
            <span class="time">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper" @click.stop="seekTo">
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
            </div>
            <span class="time">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Right: Volume/Extras -->
        <div class="player-right">
          <button class="icon-btn small" title="歌词" @click.stop="toggleExpand">
            <span class="material-icons">lyrics</span>
          </button>
          <div class="volume-control">
             <span class="material-icons volume-icon">volume_up</span>
             <div class="volume-bar">
                <div class="volume-fill" style="width: 50%"></div>
             </div>
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
  isShuffled,
  currentTime,
  duration,
  buffered,
  togglePlay, 
  nextTrack, 
  prevTrack, 
  toggleShuffle,
  loadPlaylist,
  playTrack,
  seek,
  toggleMinimize // Using this to close/hide for now
} = useMusic()

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

onMounted(async () => {
  if (!currentTrack.value) {
    try {
      const res = await fetch('/music.json')
      const tracks = await res.json()
      if (tracks.length > 0) {
        loadPlaylist(tracks)
        // Auto play removed to be less intrusive, or keep if requested
        // playTrack(0) 
      }
    } catch (e) {
      console.error('Failed to load music:', e)
    }
  }
})
</script>

<style scoped>
.top-player-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background: rgba(255, 255, 255, 0.98);
  border-bottom: 1px solid var(--gray-300);
  z-index: 1100; /* Above Navbar (1000) */
  display: flex;
  align-items: center;
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: background 0.2s;
}

.top-player-bar:hover {
  background: rgba(255, 255, 255, 1);
}

[data-theme="dark"] .top-player-bar {
  background: rgba(30, 30, 30, 0.98);
  border-bottom-color: var(--gray-300); /* Need to ensure gray-300 is dark mode compatible */
}

.player-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--gray-100);
  color: var(--text-primary);
}

.icon-btn.active {
  color: var(--primary-color);
  background: rgba(255, 77, 109, 0.1);
}

.play-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
}

.play-btn:hover {
  background: var(--primary-dark);
  transform: scale(1.05);
}

.player-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 24px;
  max-width: 600px;
}

.track-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: var(--text-sm);
}

.cover-thumb {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  object-fit: cover;
}

.title {
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.artist {
  color: var(--text-tertiary);
}

.progress-bar-wrapper {
  height: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.progress-track {
  width: 100%;
  height: 4px;
  background: var(--gray-300);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: var(--primary-color);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-buffer {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: rgba(0,0,0,0.05);
  z-index: 0;
}

.progress-bar-wrapper:hover .progress-track {
  height: 6px;
}

.player-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
}

.time {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .player-left {
      width: auto;
      flex: 1;
      min-width: 0;
  }
  .player-center {
      display: none; /* Hide complex controls on mobile bar, rely on full screen */
  }
  .player-right {
      width: auto;
      min-width: 0;
  }
  .volume-control, .icon-btn.small {
      display: none;
  }
  
  .mobile-play-btn {
      width: 40px;
      height: 40px;
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
  }
  
  .cover-thumb {
      width: 48px;
      height: 48px;
  }
  
  .title {
      font-size: 13px;
  }
}
</style>