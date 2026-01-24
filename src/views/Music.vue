<template>
  <div class="min-h-screen w-full bg-black font-sans antialiased text-white relative overflow-hidden flex flex-col">
    <!-- Background Blur -->
    <div class="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-110 blur-[80px] opacity-60" 
         :style="{ backgroundImage: `url(${currentTrack?.cover || '/default-cover.png'})` }">
    </div>
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="absolute inset-0 grain-overlay"></div>

    <!-- Top Navigation Pill -->
    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav class="ios-glass-nav px-1.5 py-1.5 rounded-full flex items-center gap-1 shadow-2xl border border-white/10">
        <router-link to="/" class="px-5 py-2.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all">
          Home
        </router-link>
        <router-link to="/gallery" class="px-5 py-2.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all">
          Gallery
        </router-link>
        <router-link to="/diary" class="px-5 py-2.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all">
          Diary
        </router-link>
        <div class="px-6 py-2.5 rounded-full bg-white/10 shadow-sm text-sm font-semibold text-white border border-white/5">
          Music
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-20 pb-8 w-full max-w-5xl mx-auto h-full">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full h-full items-center">
        <!-- Left: Cover Art -->
        <div class="flex flex-col items-center justify-center space-y-8">
          <div class="relative group w-full max-w-md aspect-square">
            <div class="absolute inset-0 bg-cover bg-center rounded-[2rem] blur-2xl opacity-40 scale-95 transition-all duration-700 group-hover:opacity-60 group-hover:scale-105" 
                 :style="{ backgroundImage: `url(${currentTrack?.cover || '/default-cover.png'})` }"></div>
            <img :src="currentTrack?.cover || '/default-cover.png'" 
                 class="relative w-full h-full object-cover rounded-[2rem] shadow-2xl border border-white/10 transform transition-transform duration-700 group-hover:scale-[1.02]"
                 alt="Album Art">
          </div>
          
          <div class="text-center space-y-2">
            <h2 class="text-3xl md:text-4xl font-display font-bold tracking-tight text-white">{{ currentTrack?.title || 'No Track Selected' }}</h2>
            <p class="text-white/60 text-lg font-medium">{{ currentTrack?.artist || 'Unknown Artist' }}</p>
          </div>
        </div>

        <!-- Right: Lyrics & Controls -->
        <div class="flex flex-col h-[60vh] md:h-[70vh]">
          <!-- Lyrics View -->
          <div class="flex-1 overflow-y-auto pr-4 mb-8 mask-linear-fade scrollbar-hide" ref="lyricsContainer">
            <div v-if="!parsedLyrics || parsedLyrics.length === 0" class="h-full flex items-center justify-center text-white/30 text-xl font-display italic">
              Instrumental / No Lyrics Available
            </div>
            <div v-else class="space-y-6 py-[30vh]">
              <p 
                v-for="(line, index) in parsedLyrics" 
                :key="index"
                :data-lyric-index="index"
                class="text-2xl md:text-3xl font-bold transition-all duration-500 cursor-pointer origin-left hover:opacity-100"
                :class="index === currentLyricIndex ? 'text-white scale-100 opacity-100 blur-0' : 'text-white/20 scale-95 blur-[1px] hover:text-white/40'"
                @click="seek(line.time)"
              >
                {{ line.text }}
              </p>
            </div>
          </div>

          <!-- Controls -->
          <div class="mt-auto space-y-6 bg-black/20 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5">
            <!-- Progress -->
            <div class="space-y-2 group">
              <div class="relative h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden" @click="onSeekClick">
                <div class="absolute h-full bg-music-accent rounded-full transition-all duration-100 ease-linear" :style="{ width: progressPercent + '%' }"></div>
                <div class="absolute h-full w-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <input 
                    type="range" 
                    min="0" 
                    :max="duration" 
                    :value="currentTime" 
                    @input="onSeek"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  >
                </div>
              </div>
              <div class="flex justify-between text-xs font-medium text-white/40">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(duration) }}</span>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex items-center justify-between">
              <button @click="toggleShuffle" :class="isShuffled ? 'text-music-accent' : 'text-white/40 hover:text-white'" class="transition-colors">
                <span class="material-symbols-outlined text-2xl">shuffle</span>
              </button>
              
              <div class="flex items-center gap-6">
                <button @click="prevTrack" class="text-white hover:text-music-accent transition-colors hover:scale-110 active:scale-95 transform">
                  <span class="material-symbols-outlined text-4xl">skip_previous</span>
                </button>
                <button @click="togglePlay" class="size-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10">
                  <span class="material-symbols-outlined text-3xl fill-current">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
                </button>
                <button @click="nextTrack" class="text-white hover:text-music-accent transition-colors hover:scale-110 active:scale-95 transform">
                  <span class="material-symbols-outlined text-4xl">skip_next</span>
                </button>
              </div>

              <button class="text-white/40 hover:text-white transition-colors">
                <span class="material-symbols-outlined text-2xl">repeat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useMusic } from '../composables/useMusic'
import { fetchJsonCached } from '../lib/fetchJsonCached'

const lyricsContainer = ref(null)
let scrollRafId = 0

const { 
  currentTrack, 
  playlist,
  isPlaying, 
  togglePlay, 
  nextTrack, 
  prevTrack, 
  toggleShuffle, 
  isShuffled, 
  currentTime, 
  duration, 
  seek,
  loadPlaylist,
  playTrack,
  parsedLyrics,
  currentLyricIndex
} = useMusic()

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

const onSeekClick = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const width = rect.width
  const percent = x / width
  seek(percent * duration.value)
}

watch(currentLyricIndex, (newIndex) => {
  if (newIndex >= 0 && lyricsContainer.value) {
    nextTick(() => {
      if (scrollRafId) cancelAnimationFrame(scrollRafId)
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0
        const activeLine = lyricsContainer.value?.querySelector?.(`[data-lyric-index="${newIndex}"]`)
        if (activeLine) activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    })
  }
})

onMounted(async () => {
  if (playlist.value.length > 0) return
  try {
    const tracks = await fetchJsonCached('/music.json')
    if (playlist.value.length === 0) loadPlaylist(tracks)
    if (!currentTrack.value && tracks.length > 0) playTrack(0)
  } catch (e) {
    console.error('Failed to load music:', e)
  }
})

onUnmounted(() => {
  if (scrollRafId) cancelAnimationFrame(scrollRafId)
  scrollRafId = 0
})
</script>

<style scoped>
.mask-linear-fade {
  mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
