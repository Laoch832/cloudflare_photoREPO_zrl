<template>
  <transition name="slide-up">
    <div v-if="isPlayerExpanded && currentTrack" class="full-player">
      <!-- Background Blur -->
      <div class="player-bg" :style="{ backgroundImage: `url(${currentTrack.cover || '/default-cover.png'})` }"></div>
      <div class="player-overlay"></div>

      <div class="player-content container">
        <!-- Header -->
        <div class="player-header">
          <button class="icon-btn" @click="toggleExpand">
            <span class="material-icons">keyboard_arrow_down</span>
          </button>
          <span class="header-title">正在播放</span>
          <button class="icon-btn">
            <span class="material-icons">more_horiz</span>
          </button>
        </div>

        <!-- Main Content (Cover or Lyrics) -->
        <div class="player-main-split">
          <!-- Left Column: Lyrics -->
          <div class="lyrics-column" :class="{ 'mobile-hidden': !showLyrics && isMobile }">
             <div class="lyrics-container" ref="lyricsContainer">
                <p v-if="!parsedLyrics || parsedLyrics.length === 0" class="no-lyrics">暂无歌词</p>
                <div v-else class="lyrics-lines">
                   <p 
                     v-for="(line, index) in parsedLyrics" 
                     :key="index"
                     class="lyric-line"
                     :class="{ active: index === currentLyricIndex }"
                     @click="seek(line.time)"
                   >
                     {{ line.text }}
                   </p>
                </div>
             </div>
          </div>
          
          <!-- Right Column: Cover -->
          <div class="cover-column" :class="{ 'mobile-hidden': showLyrics && isMobile }">
            <div class="cover-wrapper-large">
               <div class="cover-shadow" :style="{ backgroundImage: `url(${currentTrack.cover || '/default-cover.png'})` }"></div>
               <img :src="currentTrack.cover || '/default-cover.png'" class="main-cover-large">
            </div>
            
            <!-- Info (Mobile only often, but we keep here for structure) -->
            <div class="track-info-large">
               <h2 class="track-name-large">{{ currentTrack.title }}</h2>
               <p class="artist-name-large">{{ currentTrack.artist }}</p>
            </div>
          </div>
        </div>

        <!-- Info & Controls (Bottom) -->
        <div class="player-footer">
          <!-- Progress -->
          <div class="progress-section">
            <div class="time-labels">
              <span>{{ formatTime(currentTime) }}</span>
            </div>
             <input 
              type="range" 
              min="0" 
              :max="duration" 
              :value="currentTime" 
              @input="onSeek"
              class="seek-slider"
              :style="{ backgroundSize: progressPercent + '% 100%' }"
            >
             <div class="time-labels">
              <span>{{ formatTime(duration) }}</span>
            </div>
          </div>

          <!-- Controls -->
          <div class="controls-row large">
            <button class="control-btn" @click="toggleShuffle" :class="{ active: isShuffled }">
              <span class="material-icons">shuffle</span>
            </button>
            <button class="control-btn" @click="prevTrack">
              <span class="material-icons">skip_previous</span>
            </button>
            <button class="control-btn play-pause-large" @click="togglePlay">
              <span class="material-icons">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
            </button>
            <button class="control-btn" @click="nextTrack">
              <span class="material-icons">skip_next</span>
            </button>
            <button class="control-btn">
              <span class="material-icons">repeat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMusic } from '../composables/useMusic'

const isMobile = ref(false)
const showLyrics = ref(false) // For mobile toggle

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
  isPlayerExpanded, 
  toggleExpand,
  togglePlay,
  nextTrack,
  prevTrack,
  toggleShuffle,
  isShuffled,
  currentTime,
  duration,
  seek
} = useMusic()

const lyrics = ref(null) // Todo: Load lyrics from currentTrack if available

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const onSeek = (e) => {
  seek(e.target.value)
}
</script>

<style scoped>
.full-player {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.player-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(60px) brightness(0.6);
  z-index: -2;
  transform: scale(1.2);
}

.player-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  z-index: -1;
}

.player-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-bottom: 40px;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  margin-bottom: 20px;
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.8;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #fff;
  opacity: 0.7;
  padding: 8px;
  cursor: pointer;
}

.icon-btn:hover {
  opacity: 1;
}

.player-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 0; /* Important for flex child scroll */
}

.cover-wrapper {
  position: relative;
  width: 100%;
  max-width: 350px;
  aspect-ratio: 1;
}

.main-cover {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  transform: scale(0.9);
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.main-cover.playing {
  transform: scale(1);
}

.cover-shadow {
  position: absolute;
  top: 20px;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  filter: blur(20px);
  opacity: 0.6;
  z-index: -1;
  border-radius: 12px;
}

.lyrics-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
}

.lyric-line {
  font-size: 24px;
  font-weight: 700;
  margin: 20px 0;
  opacity: 0.4;
  transition: all 0.3s;
}

.lyric-line.active {
  opacity: 1;
  transform: scale(1.1);
  color: #fff;
}

.player-footer {
  margin-top: auto;
  padding-top: 20px;
}

.track-details {
  margin-bottom: 30px;
}

.track-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-name {
  font-size: 18px;
  opacity: 0.7;
  font-weight: 500;
}

.progress-section {
  margin-bottom: 30px;
}

.seek-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255,255,255,0.2);
  outline: none;
  background-image: linear-gradient(#fff, #fff);
  background-repeat: no-repeat;
}

.seek-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  transform: scale(0); /* Hidden by default */
  transition: transform 0.2s;
}

.progress-section:hover .seek-slider::-webkit-slider-thumb {
  transform: scale(1);
}

.time-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.5;
  margin-top: 8px;
  font-variant-numeric: tabular-nums;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
}

.control-btn {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, opacity 0.2s;
}

.control-btn:active {
  transform: scale(0.9);
}

.control-btn.active {
  color: var(--primary-color);
  opacity: 1;
}

.control-btn span {
  font-size: 36px;
}

.control-btn.small span {
  font-size: 24px;
  opacity: 0.6;
}

.play-pause span {
  font-size: 64px;
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>