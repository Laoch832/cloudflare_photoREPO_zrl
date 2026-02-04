<template>
  <div class="flex h-screen bg-white dark:bg-[#181818] font-sans text-[#444746] dark:text-[#e3e3e3] overflow-hidden transition-colors duration-300 pt-20">
    <!-- Sidebar (Desktop) -->
    <aside class="w-64 flex-shrink-0 flex flex-col pt-4 pb-4 hidden md:flex">
      <!-- New Button -->
      <div class="px-4 mb-4">
        <label class="cursor-pointer inline-flex items-center gap-3 bg-white dark:bg-[#282a2c] shadow-[0_1px_3px_0_rgba(0,0,0,0.12),0_4px_8px_3px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_8px_3px_rgba(0,0,0,0.15),0_1px_3px_0_rgba(0,0,0,0.3)] hover:bg-[#f8fafd] dark:hover:bg-[#303234] transition-all rounded-2xl px-4 py-4 min-w-[100px] h-14">
          <span class="material-symbols-outlined text-[24px] text-blue-600 dark:text-[#a8c7fa]">add</span>
          <span class="font-medium text-sm text-[#444746] dark:text-[#e3e3e3]">New</span>
          <input type="file" class="hidden" @change="uploadFile" :disabled="uploading" />
        </label>
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 overflow-y-auto px-2 space-y-0.5">
        <a href="#" class="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#c2e7ff] dark:bg-[#004a77] text-[#001d35] dark:text-[#c2e7ff] font-medium text-sm">
          <span class="material-symbols-outlined text-[20px] filled">hard_drive</span>
          My Drive
        </a>
        <a href="#" class="flex items-center gap-3 px-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#282a2c] transition-colors text-sm">
          <span class="material-symbols-outlined text-[20px]">computer</span>
          Computers
        </a>
        <a href="#" class="flex items-center gap-3 px-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#282a2c] transition-colors text-sm">
          <span class="material-symbols-outlined text-[20px]">group</span>
          Shared with me
        </a>
        <a href="#" class="flex items-center gap-3 px-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#282a2c] transition-colors text-sm">
          <span class="material-symbols-outlined text-[20px]">schedule</span>
          Recent
        </a>
        <a href="#" class="flex items-center gap-3 px-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#282a2c] transition-colors text-sm">
          <span class="material-symbols-outlined text-[20px]">star</span>
          Starred
        </a>
        <a href="#" class="flex items-center gap-3 px-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#282a2c] transition-colors text-sm">
          <span class="material-symbols-outlined text-[20px]">delete</span>
          Trash
        </a>
      </nav>

      <!-- Storage Meter -->
      <div class="px-6 mt-4">
        <div class="h-1 w-full bg-gray-200 dark:bg-[#444746] rounded-full overflow-hidden mb-2">
          <div class="h-full bg-blue-600 dark:bg-[#a8c7fa] w-[15%]"></div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">2.1 GB of 15 GB used</p>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col bg-white dark:bg-[#181818] min-w-0 rounded-tl-2xl overflow-hidden mt-2 mr-2 mb-2 border border-transparent dark:border-[#444746]/30 shadow-sm relative">
      <!-- Top Bar -->
      <header class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-[#444746] flex-shrink-0">
        <div class="flex items-center gap-2 text-lg font-normal">
          <span class="hidden md:inline">My Drive</span>
          <span class="material-symbols-outlined text-[20px] md:hidden">menu</span>
          <span class="material-symbols-outlined text-[20px]">arrow_drop_down</span>
        </div>

        <!-- Search Bar (Visual) -->
        <div class="flex-1 max-w-2xl mx-4 hidden md:block">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-gray-500 text-[20px]">search</span>
            </div>
            <input type="text" class="block w-full pl-10 pr-3 py-2.5 rounded-full bg-[#edf2fc] dark:bg-[#282a2c] border-none text-sm focus:bg-white dark:focus:bg-[#1f1f1f] focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-500 transition-all placeholder-gray-500 dark:placeholder-gray-400" placeholder="Search in Drive">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span class="material-symbols-outlined text-gray-500 text-[20px] cursor-pointer">tune</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button @click="viewMode = viewMode === 'list' ? 'grid' : 'list'" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#282a2c] text-gray-500 dark:text-gray-300 transition-colors">
            <span class="material-symbols-outlined text-[20px]">{{ viewMode === 'list' ? 'grid_view' : 'view_list' }}</span>
          </button>
          <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#282a2c] text-gray-500 dark:text-gray-300 transition-colors">
            <span class="material-symbols-outlined text-[20px]">info</span>
          </button>
        </div>
      </header>

      <!-- File Area -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
        <!-- Breadcrumbs / Filter Chips -->
        <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#444746] text-sm hover:bg-gray-100 dark:hover:bg-[#282a2c] transition-colors whitespace-nowrap">Type</button>
          <button class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#444746] text-sm hover:bg-gray-100 dark:hover:bg-[#282a2c] transition-colors whitespace-nowrap">People</button>
          <button class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#444746] text-sm hover:bg-gray-100 dark:hover:bg-[#282a2c] transition-colors whitespace-nowrap">Modified</button>
        </div>

        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="flex flex-col items-center gap-3">
            <div class="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            <p class="text-sm text-gray-500">Loading files...</p>
          </div>
        </div>

        <div v-else-if="files.length === 0" class="flex flex-col items-center justify-center h-full pb-20">
          <div class="w-48 h-48 bg-gray-100 dark:bg-[#282a2c] rounded-full flex items-center justify-center mb-6">
            <img src="https://ssl.gstatic.com/docs/doclist/images/empty_state_apps_v1.png" alt="Empty" class="w-32 opacity-50 dark:invert">
          </div>
          <p class="text-xl font-normal mb-2">A place for all of your files</p>
          <p class="text-sm text-gray-500 mb-6">Drag your files here or use the "New" button to upload</p>
        </div>

        <div v-else>
          <div class="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">Files</div>
          
          <!-- List View -->
          <div v-if="viewMode === 'list'" class="w-full">
            <div class="grid grid-cols-12 gap-4 border-b border-gray-200 dark:border-[#444746] pb-2 text-sm font-medium text-gray-500 dark:text-gray-400 px-4">
              <div class="col-span-6">Name</div>
              <div class="col-span-2 hidden sm:block">Owner</div>
              <div class="col-span-2 hidden md:block">Last modified</div>
              <div class="col-span-1 hidden lg:block">File size</div>
              <div class="col-span-1"></div>
            </div>
            
            <div class="mt-2 space-y-0.5">
              <div v-for="file in files" :key="file.id" 
                   @click="selectedFile = file"
                   :class="{'bg-[#c2e7ff]/30 dark:bg-[#004a77]/30': selectedFile?.id === file.id}"
                   class="group grid grid-cols-12 gap-4 items-center px-4 py-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#282a2c] cursor-pointer transition-colors text-sm border-b border-gray-100 dark:border-[#444746]/20 last:border-0">
                
                <!-- Name -->
                <div class="col-span-6 flex items-center gap-3 overflow-hidden">
                  <span class="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[20px] flex-shrink-0">{{ getFileIcon(file) }}</span>
                  <span class="truncate font-medium text-gray-700 dark:text-[#e3e3e3]">{{ file.name }}</span>
                </div>
                
                <!-- Owner -->
                <div class="col-span-2 hidden sm:flex items-center gap-2">
                  <div class="size-6 rounded-full bg-purple-500 text-white text-[10px] flex items-center justify-center font-bold">ME</div>
                  <span class="text-gray-500 dark:text-gray-400 truncate">me</span>
                </div>
                
                <!-- Date -->
                <div class="col-span-2 hidden md:block text-gray-500 dark:text-gray-400 text-xs">
                  {{ formatDate(file.created_at) }}
                </div>
                
                <!-- Size -->
                <div class="col-span-1 hidden lg:block text-gray-500 dark:text-gray-400 text-xs">
                  {{ formatSize(file.metadata?.size) }}
                </div>
                
                <!-- Actions -->
                <div class="col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="flex items-center gap-1">
                     <a :href="getFileUrl(file)" target="_blank" download class="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500 transition-colors" title="Download">
                       <span class="material-symbols-outlined text-[18px]">download</span>
                     </a>
                     <button @click.stop="deleteFile(file)" class="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500 hover:text-red-500 transition-colors" title="Delete">
                       <span class="material-symbols-outlined text-[18px]">delete</span>
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Grid View -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <div v-for="file in files" :key="file.id" 
                 @click="selectedFile = file"
                 :class="{'bg-[#c2e7ff]/30 dark:bg-[#004a77]/30 ring-1 ring-blue-500': selectedFile?.id === file.id}"
                 class="group bg-[#f8fafd] dark:bg-[#282a2c] rounded-xl p-3 cursor-pointer hover:bg-[#e9eef6] dark:hover:bg-[#303234] transition-all flex flex-col gap-3 relative overflow-hidden">
              
              <div class="flex justify-between items-center px-1">
                <span class="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[20px]">{{ getFileIcon(file) }}</span>
                <div class="text-xs text-gray-500 dark:text-gray-400 font-medium truncate ml-2 flex-1">{{ file.name }}</div>
                <button @click.stop="deleteFile(file)" class="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500 transition-all">
                  <span class="material-symbols-outlined text-[16px]">more_vert</span>
                </button>
              </div>

              <div class="aspect-[4/3] bg-white dark:bg-[#181818] rounded-lg overflow-hidden border border-gray-200 dark:border-[#444746] flex items-center justify-center relative">
                <img v-if="isImage(file)" :src="getFileUrl(file)" class="w-full h-full object-cover" />
                <span v-else class="material-symbols-outlined text-6xl text-gray-300 dark:text-[#444746]">{{ getFileIcon(file) }}</span>
                
                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <a :href="getFileUrl(file)" target="_blank" download class="p-2 bg-white dark:bg-[#303234] rounded-full shadow-sm text-gray-700 dark:text-gray-200 hover:scale-110 transition-transform">
                     <span class="material-symbols-outlined text-[18px]">download</span>
                   </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Uploading Overlay (Minimal Toast) -->
    <div v-if="uploading" class="fixed bottom-6 right-6 z-50 bg-[#303030] text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 animate-slide-up">
      <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      <div class="flex flex-col">
        <span class="font-medium text-sm">Uploading item...</span>
        <span class="text-xs text-white/70">Please wait</span>
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
const selectedFile = ref(null)
const viewMode = ref('list') // 'list' or 'grid'

const BUCKET_NAME = 'cloudflare_photoREPO_zrl'

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
    
    if (error) {
      if (error.message.includes('row-level security')) {
        alert('Permission denied: You do not have permission to upload to this bucket. Please configure RLS policies in Supabase Dashboard.')
      } else {
        throw error
      }
    } else {
      await fetchFiles()
    }
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
    if (selectedFile.value?.id === file.id) selectedFile.value = null
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
  if (file.metadata?.mimetype?.startsWith('image/')) return 'image'
  if (file.metadata?.mimetype?.startsWith('video/')) return 'movie'
  if (file.metadata?.mimetype?.startsWith('audio/')) return 'music_note'
  if (file.metadata?.mimetype?.includes('pdf')) return 'picture_as_pdf'
  if (file.metadata?.mimetype?.includes('zip') || file.name.endsWith('.zip')) return 'folder_zip'
  return 'draft'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
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
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.material-symbols-outlined.filled {
  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
