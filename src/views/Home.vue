<template>
  <div class="bg-black font-sans text-white/90 antialiased overflow-hidden min-h-screen relative">
    <div class="fixed inset-0 z-0 overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center scale-105 blur-[100px] opacity-70 transition-all duration-1000" :style="backgroundStyle"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      <div class="absolute inset-0 grain-texture"></div>
    </div>
    
    <main class="relative z-10 h-screen w-full flex items-center justify-center pt-16 pb-32">
      <div class="max-w-7xl w-full px-12 grid grid-cols-12 gap-12 items-center">
        <div class="col-span-7 space-y-10">
          <div class="space-y-4">
            <div class="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase text-left">
              {{ currentDate }}
            </div>
            <h1 class="font-serif italic text-5xl md:text-7xl tracking-tighter leading-tight opacity-95 min-h-[120px] transition-colors duration-1000" :style="{ color: textColor }">
              {{ hitokoto.hitokoto || 'Loading...' }}
            </h1>
          </div>
          <p class="font-serif text-2xl md:text-3xl text-white/80 leading-[1.4] max-w-2xl pl-2 border-l-2 border-white/20">
            {{ hitokoto.from ? `—— ${hitokoto.from}` : '' }}
          </p>
          <div class="flex gap-4">
            <router-link to="/diary" class="ios-glass-card px-8 py-4 rounded-ios-full flex items-center gap-3 hover:bg-white/10 active:scale-95 transition-all group">
              <span class="material-symbols-outlined text-home-primary text-[22px] fill-current">edit_note</span>
              <span class="text-sm font-semibold tracking-wide">Write a Memory</span>
            </router-link>
          </div>
        </div>
        <div class="col-span-5 flex justify-end">
          <div class="relative group">
            <div class="relative w-80 h-[480px] rounded-[2.5rem] overflow-hidden photo-frame transform rotate-1 group-hover:rotate-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
              <div class="absolute inset-0 bg-cover bg-center" :style="imageStyle"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
              <div class="absolute inset-0 border border-white/10 rounded-[2.5rem]"></div>
              <div class="absolute bottom-6 left-6 right-6">
                <div class="ios-glass-card px-4 py-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <p class="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-0.5">Captivation</p>
                    <!-- Filename removed as requested -->
                  </div>
                  <span class="material-symbols-outlined text-home-primary text-[18px] fill-current">favorite</span>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-home-primary/10 blur-[80px] rounded-full -z-10 animate-pulse"></div>
            <div class="absolute -top-10 -left-10 w-48 h-48 bg-white/5 blur-[80px] rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchJsonCached } from '../lib/fetchJsonCached'

const featuredImage = ref(null)
const hitokoto = ref({ hitokoto: '正在加载...', from: '' })
// Pre-defined palette of high-contrast colors suitable for dark backgrounds
const textColors = [
  '#FFFFFF', // White
  '#F0F8FF', // AliceBlue
  '#FAEBD7', // AntiqueWhite
  '#E0FFFF', // LightCyan
  '#FFFAF0', // FloralWhite
  '#F5F5DC', // Beige
  '#FFF0F5', // LavenderBlush
  '#FDF5E6', // OldLace
  '#FAF0E6', // Linen
  '#FFFFF0', // Ivory
  '#FFD700', // Gold (for accent)
  '#FF69B4', // HotPink (for accent)
  '#00BFFF', // DeepSkyBlue (for accent)
]
const textColor = ref('#FFFFFF')

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
})

const backgroundStyle = computed(() => {
  const url = featuredImage.value?.url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCXW2-dWMIb9nb69pFxqgWF7OjEVTqxBGud9l62LjCGje6QYLW0TpLpG3jOFlHv-z5CZD60v2dvnQA8g4NcGVXQm7Ka1ZGcr_c-npxxgI4vNovr6ZqcA-z7Jc5rqgHm42d0lIEpIKHeKL6MQsJFMafHXWiOjAxvw4Be6V-G5y61K5Pk6YQPA_M4ntbSc6J2j3J_rHlx_KFT1MoLg3izPeQz_LrngZ8IAbAZzPjEDzWhGFrvUaREvZ7mbwYC0o9q1n3bvITB34XG2Ic"
  return { backgroundImage: `url("${url}")` }
})

const imageStyle = computed(() => {
  const url = featuredImage.value?.url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY"
  return { backgroundImage: `url("${url}")` }
})

onMounted(async () => {
  try {
    const images = await fetchJsonCached('/images.json')
    if (images && images.length > 0) {
      featuredImage.value = images[Math.floor(Math.random() * images.length)]
      // Randomly change text color when image changes, ensuring it's not too dark
      textColor.value = textColors[Math.floor(Math.random() * textColors.length)]
    }
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.error('Failed to load images for home:', e)
    }
  }

  // Fetch Hitokoto from local JSON
  try {
    const quotes = await fetchJsonCached('/yy.json')
    if (quotes && quotes.length > 0) {
      hitokoto.value = quotes[Math.floor(Math.random() * quotes.length)]
    }
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.error('Failed to load hitokoto:', e)
      hitokoto.value = { hitokoto: 'Quietude', from: 'System' }
    }
  }
})
</script>

<style scoped>
.ios-glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.1);
}
.photo-frame {
  box-shadow: 
    0 30px 60px -12px rgba(0,0,0,0.3),
    inset 0 0 0 1px rgba(255,255,255,0.15);
}
.grain-texture {
  background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuAhnN-c6-tvXKaxxtWEFk8ZQ6RmbkLBI9Tu3bsqNWc-EIPrnIwFFRSj6SdSMguirLBW_gm94P5Y2OfA3J2XQBfkhZgrYcHhvUEpBxEQiVEbD7hj4QtmWuNnHY71OiDBpv1kJQ9AmYeBR77LP1veXhxeixWY7W6W4nW_ZrfbKE-_2uQwCxxENnLox1oSeRRNOAl-gY0dU6I5uAL8epYCXkjqJrdRJdCMhSB6D7EsGHgN5HbhfD6GgiDGaqZyRtPPTn9ey14wZWXrObY);
  opacity: 0.03;
  pointer-events: none;
}
</style>
