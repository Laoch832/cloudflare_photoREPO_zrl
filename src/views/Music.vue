<template>
  <div class="bg-white font-sans overflow-hidden text-gray-900 selection:bg-music-accent/20 selection:text-black h-screen flex flex-col relative">
    <!-- Dynamic Background -->
    <div class="fixed inset-0 z-0 overflow-hidden">
      <!-- Image Layer with reduced opacity for Light Mode -->
      <div 
        class="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-110 blur-[100px] opacity-20" 
        :style="{ backgroundImage: `url(${currentTrack?.cover || defaultCover})` }"
      ></div>
      <!-- Light Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white"></div>
    </div>
    
    <main class="relative z-10 flex-1 flex flex-col px-8 lg:px-16 max-w-[1600px] mx-auto w-full pt-24 pb-24 h-full">
      <div class="flex flex-col md:flex-row gap-12 lg:gap-24 h-full items-center">
        
        <!-- Left: Player & Cover -->
        <div class="flex flex-col items-center md:items-start gap-10 w-full max-w-md shrink-0">
          <div class="relative group">
            <div class="relative size-64 md:size-[360px] flex items-center justify-center">
              <div class="absolute inset-0 rounded-full border border-gray-200"></div>
              
              <!-- Album Art -->
              <div 
                class="relative size-56 md:size-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-white transition-all duration-700"
                :class="{ 'animate-spin-slow': isPlaying }"
              >
                <img :src="currentTrack?.cover || defaultCover" alt="Album Art" class="w-full h-full object-cover" />
                <!-- Vinyl Center Hole -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 md:size-6 rounded-full bg-gray-900 shadow-inner flex items-center justify-center ring-2 ring-white">
                  <div class="size-1 bg-white/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="w-full flex flex-col gap-6">
            <div class="space-y-1 text-center md:text-left">
              <h1 class="text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 leading-tight truncate">{{ currentTrack?.title || 'No Track Selected' }}</h1>
              <p class="text-gray-500 text-lg font-medium tracking-wide italic">{{ currentTrack?.artist || 'Select a track to play' }}</p>
            </div>
            
            <!-- Progress Bar -->
            <div class="space-y-2">
              <div class="relative h-1.5 w-full bg-gray-200 rounded-full cursor-pointer group/seek hover:h-2 transition-all" @click="handleSeek">
                <div class="absolute h-full bg-gray-900 rounded-full" :style="{ width: progress + '%' }"></div>
              </div>
              <div class="flex justify-between text-[10px] font-bold tracking-[0.1em] text-gray-400 uppercase">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(duration) }}</span>
              </div>
            </div>
            
            <!-- Controls -->
            <div class="flex items-center justify-center md:justify-between w-full px-4">
              <button class="text-gray-400 hover:text-gray-900 transition-colors" @click="toggleShuffle" :class="{ 'text-music-accent': isShuffled }">
                <span class="material-symbols-outlined text-[24px]">shuffle</span>
              </button>
              <div class="flex items-center gap-8">
                <button class="text-gray-800 hover:text-gray-500 transition-all active:scale-90" @click="prevTrack">
                  <span class="material-symbols-outlined text-[40px] font-light">skip_previous</span>
                </button>
                <button class="size-16 rounded-full bg-gray-900 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl" @click="togglePlay">
                  <span class="material-symbols-outlined text-[36px] fill-current">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
                </button>
                <button class="text-gray-800 hover:text-gray-500 transition-all active:scale-90" @click="nextTrack">
                  <span class="material-symbols-outlined text-[40px] font-light">skip_next</span>
                </button>
              </div>
              <button class="text-gray-400 hover:text-gray-900 transition-colors">
                <span class="material-symbols-outlined text-[24px]">repeat</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Middle: Lyrics -->
        <div class="w-full flex-1 flex flex-col h-[60vh] justify-center relative border-l border-gray-100 pl-12">
          <div class="lyrics-scroll flex-1 overflow-y-auto space-y-8 py-[30vh] mask-linear-fade-light pr-4" ref="lyricsContainer">
            <template v-if="parsedLyrics.length > 0">
              <p v-for="(line, index) in parsedLyrics" :key="index" 
                 class="lyric-line text-xl md:text-2xl font-serif leading-relaxed cursor-pointer hover:opacity-80 transition-all duration-500 text-left"
                 :class="{ 'active': index === currentLyricIndex }"
                 @click="seek(line.time)">
                {{ line.text }}
              </p>
            </template>
            <div v-else class="flex flex-col items-center justify-center h-full text-gray-300 space-y-4">
              <span class="material-symbols-outlined text-5xl opacity-50">music_off</span>
              <p class="font-serif italic text-lg">No lyrics available</p>
            </div>
          </div>
        </div>

        <!-- Right: Playlist Overview (New) -->
        <div class="hidden xl:flex flex-col w-80 h-[60vh] bg-white/50 backdrop-blur-md rounded-2xl border border-white shadow-sm overflow-hidden shrink-0">
          <div class="p-4 border-b border-gray-100 bg-white/80">
            <h3 class="text-sm font-bold uppercase tracking-widest text-gray-500">Playlist</h3>
          </div>
          <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            <div 
              v-for="(track, idx) in playlist" 
              :key="track.id"
              @click="playTrack(idx)"
              class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group"
              :class="currentTrack?.id === track.id ? 'bg-gray-100' : 'hover:bg-gray-50'"
            >
              <div class="relative size-10 rounded overflow-hidden shrink-0">
                <img :src="track.cover || defaultCover" class="w-full h-full object-cover" />
                <div v-if="currentTrack?.id === track.id" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-sm animate-pulse">equalizer</span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate text-gray-900" :class="{'text-music-accent': currentTrack?.id === track.id}">{{ track.title }}</p>
                <p class="text-xs text-gray-500 truncate">{{ track.artist }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
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
  loadPlaylist,
  playTrack,
  playlist
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
.lyrics-scroll::-webkit-scrollbar {
  width: 0px;
}

.lyric-line {
  filter: blur(1.5px);
  opacity: 0.4;
  transform: scale(0.98);
  padding: 0.75rem 0;
  color: #374151; /* gray-700 */
}

.lyric-line.active {
  filter: blur(0);
  opacity: 1;
  transform: scale(1);
  font-weight: 700;
  color: #111827; /* gray-900 */
  text-shadow: 0 0 1px rgba(0,0,0,0.1);
}

.mask-linear-fade-light {
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
</style>
