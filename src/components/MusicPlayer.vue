<template>
  <transition name="slide-up">
    <div v-if="currentTrack" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[440px] px-4 cursor-pointer" @click="navigateToMusic">
      <div class="ios-glass-player rounded-[24px] p-3 flex items-center gap-4 shadow-2xl border border-white/10 group">
        <!-- Progress Bar Background (Subtle) -->
        <div class="absolute top-0 left-6 right-6 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <div class="h-full bg-primary/60 transition-all duration-300" :style="{ width: progressPercent + '%' }"></div>
        </div>

        <!-- Cover Art -->
        <div class="size-12 shrink-0 rounded-xl overflow-hidden shadow-lg relative">
          <img :src="currentTrack.cover || '/default-cover.png'" class="w-full h-full object-cover animate-spin-slow" :class="{ 'paused': !isPlaying }">
          <div class="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-xl"></div>
        </div>

        <!-- Track Info -->
        <div class="flex-1 min-w-0">
          <h4 class="text-white text-[13px] font-bold truncate leading-tight">{{ currentTrack.title }}</h4>
          <p class="text-white/40 text-[11px] truncate leading-tight mt-0.5">{{ currentTrack.artist || 'Now playing your anthem' }}</p>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-2 pr-2">
          <button @click.stop="prevTrack" class="size-8 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <span class="material-symbols-outlined text-[20px]">skip_previous</span>
          </button>
          
          <button @click.stop="togglePlay" class="size-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md">
            <span class="material-symbols-outlined text-[20px] fill-current">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
          </button>
          
          <button @click.stop="nextTrack" class="size-8 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <span class="material-symbols-outlined text-[20px]">skip_next</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMusic } from '../composables/useMusic'

const router = useRouter()
const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, currentTime, duration } = useMusic()

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const navigateToMusic = () => {
  router.push('/music')
}
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 12s linear infinite;
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
  transition: all 0.6s cubic-bezier(0.32, 0.72, 0, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 40px);
}
</style>
