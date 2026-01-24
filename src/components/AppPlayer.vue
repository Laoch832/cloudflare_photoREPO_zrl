<template>
  <div v-if="currentTrack" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300" :class="{ 'translate-y-24 opacity-0': !currentTrack }">
    <div class="ios-glass-player px-4 py-3 rounded-[2rem] flex items-center gap-5 min-w-[420px]">
      <div class="size-14 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/10 relative group cursor-pointer" @click="togglePlay">
         <img :src="currentTrack.cover || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc'" alt="Cover" class="w-full h-full object-cover" />
         <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <span class="material-symbols-outlined text-white">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
         </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-2">
          <div class="truncate pr-4">
            <p class="text-[14px] font-semibold truncate leading-tight tracking-tight text-white">{{ currentTrack.title }}</p>
            <p class="text-[12px] text-white/40 truncate tracking-tight">{{ currentTrack.artist }}</p>
          </div>
          <div class="flex items-center gap-5 shrink-0">
            <button class="text-white/60 hover:text-white transition-colors" @click="prevTrack">
              <span class="material-symbols-outlined text-[20px]">skip_previous</span>
            </button>
            <button class="size-9 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all" @click="togglePlay">
              <span class="material-symbols-outlined text-black text-[24px] fill-current">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
            </button>
            <button class="text-white/60 hover:text-white transition-colors" @click="nextTrack">
              <span class="material-symbols-outlined text-[20px]">skip_next</span>
            </button>
          </div>
        </div>
        <div class="relative w-full h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer" @click="handleSeek">
          <div class="absolute top-0 left-0 h-full bg-white/60 rounded-full transition-all duration-100" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMusic } from '../composables/useMusic'

const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, currentTime, duration, seek } = useMusic()

const progress = computed(() => {
  return duration.value ? (currentTime.value / duration.value) * 100 : 0
})

const handleSeek = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const percentage = x / rect.width
  const time = percentage * duration.value
  seek(time)
}
</script>

<style scoped>
.ios-glass-player {
  background: rgba(15, 15, 15, 0.4);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}
</style>
