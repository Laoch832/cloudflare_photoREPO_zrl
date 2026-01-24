<template>
  <div class="bg-black font-sans overflow-hidden text-white selection:bg-music-accent/30 selection:text-white h-screen flex flex-col relative">
    <!-- Dynamic Background -->
    <div class="fixed inset-0 z-0 overflow-hidden">
      <!-- Image Layer -->
      <div 
        class="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-110 blur-[80px] opacity-60" 
        :style="{ backgroundImage: `url(${currentTrack?.cover || defaultCover})` }"
      ></div>
      <!-- Color Overlay based on extracted color (Simulated via strong blur + darkening) -->
      <div class="absolute inset-0 bg-black/40 backdrop-brightness-75 transition-colors duration-1000"></div>
      <!-- Grain Texture -->
      <div class="absolute inset-0 grain"></div>
    </div>
    
    <main class="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center px-12 lg:px-24 gap-16 lg:gap-32 max-w-[1600px] mx-auto w-full pt-20 pb-32">
      <!-- Left: Player Controls & Cover -->
      <div class="flex flex-col items-center md:items-start gap-12 w-full max-w-lg">
        <div class="relative group">
          <div class="absolute -inset-12 bg-white/10 rounded-full blur-3xl opacity-20 transition-opacity duration-1000 group-hover:opacity-30 animate-pulse"></div>
          <div class="relative size-72 md:size-[440px] flex items-center justify-center">
            <div class="absolute inset-0 concentric-circles rounded-full border border-white/5"></div>
            <div class="absolute inset-[10%] rounded-full border border-white/10 opacity-30"></div>
            
            <!-- Album Art (Spinning if playing) -->
            <div 
              class="relative size-56 md:size-80 rounded-full overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/20 transition-all duration-700"
              :class="{ 'animate-spin-slow': isPlaying }"
            >
              <img :src="currentTrack?.cover || defaultCover" alt="Album Art" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10"></div>
              <!-- Vinyl Center Hole -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 md:size-6 rounded-full bg-black/90 shadow-inner flex items-center justify-center ring-1 ring-white/20">
                <div class="size-1 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="w-full flex flex-col gap-8">
          <div class="space-y-2 text-center md:text-left">
            <h1 class="text-4xl md:text-5xl font-display font-bold tracking-tight text-white leading-tight truncate drop-shadow-lg">{{ currentTrack?.title || 'No Track Selected' }}</h1>
            <p class="text-white/60 text-lg font-medium tracking-wide italic">{{ currentTrack?.artist || 'Select a track to play' }}</p>
          </div>
          
          <!-- Progress Bar -->
          <div class="space-y-4">
            <div class="relative h-1.5 w-full bg-white/10 rounded-full cursor-pointer group/seek hover:h-2 transition-all" @click="handleSeek">
              <div class="absolute h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" :style="{ width: progress + '%' }"></div>
              <div class="absolute top-1/2 -translate-y-1/2 size-4 bg-white rounded-full shadow-2xl scale-0 group-hover/seek:scale-100 transition-transform" :style="{ left: progress + '%' }"></div>
            </div>
            <div class="flex justify-between text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
          </div>
          
          <!-- Controls -->
          <div class="flex items-center justify-center md:justify-start gap-12">
            <button class="text-white/40 hover:text-white transition-colors" @click="toggleShuffle" :class="{ 'text-music-accent': isShuffled }">
              <span class="material-symbols-outlined text-[24px]">shuffle</span>
            </button>
            <div class="flex items-center gap-10">
              <button class="text-white/80 hover:text-white transition-all active:scale-90" @click="prevTrack">
                <span class="material-symbols-outlined text-[42px] font-light">skip_previous</span>
              </button>
              <button class="size-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl" @click="togglePlay">
                <span class="material-symbols-outlined text-[44px] fill-current">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
              </button>
              <button class="text-white/80 hover:text-white transition-all active:scale-90" @click="nextTrack">
                <span class="material-symbols-outlined text-[42px] font-light">skip_next</span>
              </button>
            </div>
            <button class="text-white/40 hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[24px]">repeat</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Right: Lyrics -->
      <div class="w-full md:w-[540px] flex flex-col h-[70vh] justify-center relative">
        <div class="lyrics-scroll flex-1 overflow-y-auto space-y-10 py-[40vh] mask-linear-fade pr-4" ref="lyricsContainer">
          <template v-if="parsedLyrics.length > 0">
            <p v-for="(line, index) in parsedLyrics" :key="index" 
               class="lyric-line text-2xl md:text-[32px] font-display leading-relaxed cursor-pointer hover:opacity-80 transition-all duration-500 text-center md:text-left"
               :class="{ 'active': index === currentLyricIndex }"
               @click="seek(line.time)">
              {{ line.text }}
            </p>
          </template>
          <div v-else class="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
            <span class="material-symbols-outlined text-5xl opacity-50">music_off</span>
            <p class="font-serif italic text-lg">No lyrics available</p>
          </div>
        </div>
      </div>
    </main>
    
    <footer class="w-full py-6 flex items-center justify-center relative z-10 bg-gradient-to-t from-black/80 to-transparent">
      <div class="flex flex-col items-center gap-2">
        <div class="text-white/30 text-[10px] tracking-[0.4em] uppercase font-bold">Intimate Listening Mode • Phase IV</div>
        <div class="w-16 h-0.5 bg-white/10 rounded-full"></div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from 'vue'
import { useMusic } from '../composables/useMusic'
import { fetchJsonCached } from '../lib/fetchJsonCached'

const { 
  currentTrack, 
  isPlaying, 
  togglePlay, 
  nextTrack, 
  prevTrack, 
  toggleShuffle, 
  isShuffled,
  currentTime,
  duration,
  parsedLyrics,
  currentLyricIndex,
  seek,
  loadPlaylist
} = useMusic()

const lyricsContainer = ref(null)
const defaultCover = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc'

const progress = computed(() => {
  return duration.value ? (currentTime.value / duration.value) * 100 : 0
})

const formatTime = (time) => {
  if (!time) return '0:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const handleSeek = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const percentage = x / rect.width
  const time = percentage * duration.value
  seek(time)
}

// Auto-scroll lyrics
watch(currentLyricIndex, (newIndex) => {
  if (newIndex >= 0 && lyricsContainer.value) {
    const activeLine = lyricsContainer.value.children[newIndex]
    if (activeLine) {
      activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
})

onMounted(async () => {
  try {
    const musicData = await fetchJsonCached('/music.json')
    if (musicData && musicData.length > 0) {
      loadPlaylist(musicData)
    }
  } catch (e) {
    console.error('Failed to load music playlist:', e)
  }
})
</script>

<style scoped>
.concentric-circles {
  background: repeating-radial-gradient(
    circle at center,
    transparent 0,
    transparent 1.5px,
    rgba(255,255,255,0.02) 2px,
    rgba(255,255,255,0.02) 2.5px
  );
}

.lyrics-scroll::-webkit-scrollbar {
  width: 0px;
}

.lyric-line {
  filter: blur(2px);
  opacity: 0.4;
  transform: scale(0.98);
  /* Ensure text doesn't get cut off */
  padding: 0.5rem 0;
}

.lyric-line.active {
  filter: blur(0);
  opacity: 1;
  transform: scale(1);
  font-weight: 700; /* Bold */
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.grain {
  background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuAhnN-c6-tvXKaxxtWEFk8ZQ6RmbkLBI9Tu3bsqNWc-EIPrnIwFFRSj6SdSMguirLBW_gm94P5Y2OfA3J2XQBfkhZgrYcHhvUEpBxEQiVEbD7hj4QtmWuNnHY71OiDBpv1kJQ9AmYeBR77LP1veXhxeixWY7W6W4nW_ZrfbKE-_2uQwCxxENnLox1oSeRRNOAl-gY0dU6I5uAL8epYCXkjqJrdRJdCMhSB6D7EsGHgN5HbhfD6GgiDGaqZyRtPPTn9ey14wZWXrObY);
  opacity: 0.04;
  pointer-events: none;
}

.mask-linear-fade {
  mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
