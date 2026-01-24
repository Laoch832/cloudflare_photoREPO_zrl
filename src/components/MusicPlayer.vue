<template>
  <transition name="slide-up">
    <div v-if="currentTrack" class="fixed bottom-0 left-0 right-0 md:bottom-8 md:right-8 md:left-auto md:w-80 z-[100] p-4 md:p-0 cursor-pointer" @click="navigateToMusic">
      <!-- Desktop: Glass Pill -->
      <div class="hidden md:flex music-player-pill rounded-xl p-4 shadow-2xl border border-white/10 items-center gap-4 relative overflow-hidden group">
        <!-- Progress Bar Background -->
        <div class="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
          <div class="h-full bg-primary transition-all duration-300" :style="{ width: progressPercent + '%' }"></div>
        </div>

        <!-- Cover -->
        <div class="relative size-12 shrink-0 rounded-lg overflow-hidden shadow-md">
          <img :src="currentTrack.cover || '/default-cover.png'" class="w-full h-full object-cover animate-spin-slow" :class="{ 'paused': !isPlaying }">
          <div class="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-lg"></div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h4 class="text-white text-sm font-bold truncate leading-tight">{{ currentTrack.title }}</h4>
          <p class="text-white/60 text-xs truncate leading-tight">{{ currentTrack.artist }}</p>
        </div>

        <!-- Controls -->
        <button @click.stop="togglePlay" class="size-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0">
          <span class="material-symbols-outlined text-xl fill-current">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
        </button>
      </div>

      <!-- Mobile: Bottom Bar Glass -->
      <div class="md:hidden ios-glass-player h-16 rounded-t-2xl px-4 flex items-center justify-between border-t border-white/10">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <img :src="currentTrack.cover || '/default-cover.png'" class="size-10 rounded-md object-cover shadow-sm">
          <div class="flex-1 min-w-0">
            <h4 class="text-white text-sm font-bold truncate">{{ currentTrack.title }}</h4>
            <p class="text-white/60 text-xs truncate">{{ currentTrack.artist }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <button @click.stop="togglePlay" class="size-10 flex items-center justify-center text-white">
            <span class="material-symbols-outlined text-3xl">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
          </button>
          <button @click.stop="nextTrack" class="size-10 flex items-center justify-center text-white/60">
            <span class="material-symbols-outlined text-2xl">skip_next</span>
          </button>
        </div>
        
        <!-- Mobile Progress Overlay -->
        <div class="absolute top-0 left-0 h-[2px] bg-primary transition-all duration-300" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMusic } from '../composables/useMusic'
import { fetchJsonCached } from '../lib/fetchJsonCached'

const router = useRouter()
const { currentTrack, playlist, loadPlaylist, isPlaying, togglePlay, nextTrack, currentTime, duration } = useMusic()
let preloadHandle = 0

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const navigateToMusic = () => {
  router.push('/music')
}

onMounted(() => {
  if (playlist.value.length > 0) return
  const schedule = typeof requestIdleCallback === 'function'
    ? requestIdleCallback
    : (cb) => setTimeout(cb, 0)
  preloadHandle = schedule(async () => {
    if (playlist.value.length > 0) return
    try {
      const tracks = await fetchJsonCached('/music.json')
      if (playlist.value.length === 0) loadPlaylist(tracks)
    } catch (e) {
      if (import.meta.env.DEV) console.error('Failed to preload music index:', e)
    }
  })
})

onUnmounted(() => {
  if (!preloadHandle) return
  if (typeof cancelIdleCallback === 'function') cancelIdleCallback(preloadHandle)
  else clearTimeout(preloadHandle)
  preloadHandle = 0
})
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 8s linear infinite;
}

.paused {
  animation-play-state: paused;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(120%);
}
</style>
