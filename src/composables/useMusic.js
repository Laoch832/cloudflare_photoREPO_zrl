import { ref, computed } from 'vue'

// Global state
const playlist = ref([])
const currentTrackIndex = ref(-1)
const isPlaying = ref(false)
const isMinimized = ref(false)
const volume = ref(0.5)
const isShuffled = ref(false)
const originalPlaylist = ref([]) // To restore after shuffle
const currentTime = ref(0)
const duration = ref(0)
const buffered = ref(0)

// Audio element (not reactive)
let audio = null

export function useMusic() {
  
  const currentTrack = computed(() => {
    if (currentTrackIndex.value >= 0 && currentTrackIndex.value < playlist.value.length) {
      return playlist.value[currentTrackIndex.value]
    }
    return null
  })

  // Initialize audio
  const initAudio = () => {
    if (!audio) {
      audio = new Audio()
      audio.volume = volume.value
      
      audio.addEventListener('ended', () => {
        nextTrack()
      })
      
      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e)
        console.error('Audio Error Code:', audio.error ? audio.error.code : 'unknown')
        isPlaying.value = false
      })

      audio.addEventListener('canplay', () => {
        console.log('Audio can play')
        if (duration.value === 0 && audio.duration && audio.duration !== Infinity) {
             duration.value = audio.duration
        }
      })

      audio.addEventListener('timeupdate', () => {
        currentTime.value = audio.currentTime
      })

      audio.addEventListener('loadedmetadata', () => {
        duration.value = audio.duration
      })

      audio.addEventListener('progress', () => {
        if (audio.buffered.length > 0) {
          buffered.value = audio.buffered.end(audio.buffered.length - 1)
        }
      })
    }
  }

  // Actions
  const loadPlaylist = (tracks) => {
    playlist.value = tracks
    originalPlaylist.value = [...tracks]
    if (isShuffled.value) {
      shufflePlaylist()
    }
  }

  const playTrack = (index) => {
    if (index >= 0 && index < playlist.value.length) {
      initAudio()
      currentTrackIndex.value = index
      
      const track = playlist.value[index]
      console.log('Playing track:', track.url)
      
      // Reset state
      currentTime.value = 0
      duration.value = track.duration || 0 // Use metadata duration if available
      buffered.value = 0
      
      audio.src = track.url
      audio.load() // Force reload
      
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying.value = true
          })
          .catch(e => {
            console.error('Play failed:', e)
            isPlaying.value = false
          })
      }
    }
  }

  const togglePlay = () => {
    initAudio()
    if (audio.paused) {
      audio.play().catch(e => console.error('Play failed:', e))
      isPlaying.value = true
    } else {
      audio.pause()
      isPlaying.value = false
    }
  }

  const nextTrack = () => {
    let nextIndex = currentTrackIndex.value + 1
    if (nextIndex >= playlist.value.length) {
      nextIndex = 0 // Loop
    }
    playTrack(nextIndex)
  }

  const prevTrack = () => {
    let prevIndex = currentTrackIndex.value - 1
    if (prevIndex < 0) {
      prevIndex = playlist.value.length - 1 // Loop
    }
    playTrack(prevIndex)
  }

  const toggleMinimize = () => {
    isMinimized.value = !isMinimized.value
  }

  const toggleShuffle = () => {
    isShuffled.value = !isShuffled.value
    if (isShuffled.value) {
      shufflePlaylist()
    } else {
      // Restore order but keep current track
      const current = currentTrack.value
      playlist.value = [...originalPlaylist.value]
      if (current) {
        currentTrackIndex.value = playlist.value.findIndex(t => t.id === current.id)
      }
    }
  }

  const shufflePlaylist = () => {
    // Fisher-Yates shuffle
    const newPlaylist = [...playlist.value]
    for (let i = newPlaylist.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPlaylist[i], newPlaylist[j]] = [newPlaylist[j], newPlaylist[i]];
    }
    
    // If playing, move current track to start
    if (currentTrack.value) {
      const currentId = currentTrack.value.id
      const index = newPlaylist.findIndex(t => t.id === currentId)
      if (index > -1) {
        newPlaylist.splice(index, 1)
        newPlaylist.unshift(currentTrack.value)
        currentTrackIndex.value = 0
      }
    }
    
    playlist.value = newPlaylist
  }

  const seek = (time) => {
    if (audio) {
      audio.currentTime = time
    }
  }

  return {
    playlist,
    currentTrack,
    isPlaying,
    isMinimized,
    volume,
    isShuffled,
    currentTime,
    duration,
    buffered,
    loadPlaylist,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleMinimize,
    toggleShuffle,
    seek
  }
}