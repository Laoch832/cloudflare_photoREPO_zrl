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
           <!-- Mobile Play Button (Visible only on mobile) -->
           <button class="play-btn-circle mobile-play-btn" @click.stop="togglePlay" v-if="isMobile">
              <span class="material-icons" style="font-size: 20px">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
           </button>

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
import { onMounted, computed, ref, onUnmounted } from 'vue'
import { useMusic } from '../composables/useMusic'

const isMobile = ref(false)

const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})

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
.bottom-player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90px;
  background: #181818; /* Spotify-like dark bg */
  border-top: 1px solid #282828;
  z-index: 1100;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
}

/* Mobile: Move up above bottom nav */
@media (max-width: 768px) {
    .bottom-player-bar {
        bottom: 80px; /* Adjust based on mobile nav height */
        height: 64px;
        background: rgba(30,30,30,0.95);
        backdrop-filter: blur(10px);
    }
}

.player-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 100%; /* Full width */
}

/* Left Section */
.player-left {
  display: flex;
  align-items: center;
  width: 30%;
  min-width: 180px;
}

.cover-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.info-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 12px;
}

.title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
}

.artist {
  font-size: 11px;
  color: #b3b3b3;
}

.like-btn {
    color: #b3b3b3;
}
.like-btn:hover {
    color: #fff;
}

/* Center Section */
.player-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  max-width: 722px;
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: #fff;
}

.icon-btn.active {
    color: var(--primary-color);
}

.icon-btn.small .material-icons {
    font-size: 20px;
}

.play-btn-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  color: #000;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.play-btn-circle:hover {
  transform: scale(1.05);
}

.progress-row {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.time {
  font-size: 11px;
  color: #b3b3b3;
  min-width: 35px;
  text-align: center;
}

.progress-bar-wrapper {
  flex: 1;
  height: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  group: hover;
}

.progress-track {
  width: 100%;
  height: 4px;
  background: #535353;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #fff;
  border-radius: 2px;
  transition: background 0.2s;
}

.progress-bar-wrapper:hover .progress-fill {
    background: var(--primary-color);
}

/* Right Section */
.player-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 30%;
  min-width: 180px;
  gap: 8px;
}

.volume-control {
    display: flex;
    align-items: center;
    width: 100px;
    gap: 8px;
}

.volume-icon {
    font-size: 20px;
    color: #b3b3b3;
}

.volume-bar {
    flex: 1;
    height: 4px;
    background: #535353;
    border-radius: 2px;
    position: relative;
}

.volume-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #b3b3b3;
    border-radius: 2px;
}

.volume-control:hover .volume-fill {
    background: #fff;
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>