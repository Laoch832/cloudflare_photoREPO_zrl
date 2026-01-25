<template>
  <div class="bg-black font-sans text-white/90 antialiased overflow-hidden min-h-screen relative">
    <div class="fixed inset-0 z-0 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
      <div class="absolute inset-0 bg-cover bg-center opacity-30 blur-[100px]" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY");'></div>
      <div class="absolute inset-0 grain-texture"></div>
    </div>

    <main class="relative z-10 pt-32 pb-48 h-screen overflow-y-auto custom-scrollbar px-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h1 class="font-serif text-5xl text-white mb-2">Cloud Storage</h1>
            <p class="text-white/40 text-sm uppercase tracking-widest font-medium">Secure Personal Archives</p>
          </div>
          
          <label class="cursor-pointer bg-white text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg active:scale-95">
            <span class="material-symbols-outlined text-[20px]">upload_file</span>
            Upload File
            <input type="file" class="hidden" @change="uploadFile" :disabled="uploading" />
          </label>
        </div>

        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="text-white/50 animate-pulse">Loading files...</div>
        </div>

        <div v-else-if="files.length === 0" class="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-3xl bg-white/5">
          <span class="material-symbols-outlined text-5xl text-white/20 mb-4">cloud_off</span>
          <p class="text-white/40">No files stored yet</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="file in files" :key="file.id" class="group relative aspect-square rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden">
            <div class="flex-1 flex items-center justify-center w-full">
              <!-- Preview Image -->
              <img v-if="isImage(file)" :src="getFileUrl(file)" class="w-full h-full object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
              <!-- File Icon -->
              <span v-else class="material-symbols-outlined text-6xl text-white/30 group-hover:text-white/60 transition-colors">{{ getFileIcon(file) }}</span>
            </div>
            
            <div class="w-full mt-4 flex justify-between items-center z-10">
              <div class="truncate text-xs font-medium text-white/70 group-hover:text-white flex-1 pr-2">
                {{ file.name }}
              </div>
              <button @click.stop="deleteFile(file)" class="text-white/20 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-white/10">
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
            
            <!-- Download Overlay -->
            <a :href="getFileUrl(file)" target="_blank" download class="absolute inset-0 z-0" title="Download"></a>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Uploading Overlay -->
    <div v-if="uploading" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div class="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
        <p class="text-white font-medium">Uploading...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const files = ref([])
const loading = ref(true)
const uploading = ref(false)
const user = ref(null)

const BUCKET_NAME = 'pravicte_file' // Updated to match actual Supabase bucket name

const fetchFiles = async () => {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(user.value.id + '/', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })
    
    if (error) throw error
    files.value = data || []
  } catch (e) {
    console.error('Error loading files:', e)
  } finally {
    loading.value = false
  }
}

const uploadFile = async (e) => {
  const file = e.target.files[0]
  if (!file || !user.value) return

  uploading.value = true
  try {
    const filePath = `${user.value.id}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file)
    
    if (error) throw error
    await fetchFiles()
  } catch (e) {
    console.error('Error uploading file:', e)
    alert('Upload failed: ' + e.message)
  } finally {
    uploading.value = false
    e.target.value = null // Reset input
  }
}

const deleteFile = async (file) => {
  if (!confirm(`Delete ${file.name}?`)) return
  
  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([`${user.value.id}/${file.name}`])
    if (error) throw error
    await fetchFiles()
  } catch (e) {
    console.error('Error deleting file:', e)
    alert('Delete failed')
  }
}

const getFileUrl = (file) => {
  if (!user.value) return ''
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(`${user.value.id}/${file.name}`)
  return data.publicUrl
}

const isImage = (file) => {
  return file.metadata?.mimetype?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
}

const getFileIcon = (file) => {
  if (file.metadata?.mimetype?.startsWith('video/')) return 'movie'
  if (file.metadata?.mimetype?.startsWith('audio/')) return 'music_note'
  if (file.metadata?.mimetype?.includes('pdf')) return 'picture_as_pdf'
  return 'description'
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null
  if (user.value) {
    await fetchFiles()
  }
})
</script>

<style scoped>
.grain-texture {
  background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuAhnN-c6-tvXKaxxtWEFk8ZQ6RmbkLBI9Tu3bsqNWc-EIPrnIwFFRSj6SdSMguirLBW_gm94P5Y2OfA3J2XQBfkhZgrYcHhvUEpBxEQiVEbD7hj4QtmWuNnHY71OiDBpv1kJQ9AmYeBR77LP1veXhxeixWY7W6W4nW_ZrfbKE-_2uQwCxxENnLox1oSeRRNOAl-gY0dU6I5uAL8epYCXkjqJrdRJdCMhSB6D7EsGHgN5HbhfD6GgiDGaqZyRtPPTn9ey14wZWXrObY);
  opacity: 0.03;
  pointer-events: none;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
