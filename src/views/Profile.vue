<template>
  <div class="deep-artistic-bg min-h-screen selection:bg-profile-primary/30 text-white font-sans">
    <main class="pt-24 pb-48 flex items-center justify-center px-6">
      <div class="w-full max-w-[840px] flex flex-col items-center">
        <div class="text-center mb-12 mt-8">
          <h2 class="font-serif text-4xl text-white font-light mb-4">Account Settings</h2>
          <p class="text-white/40 text-[13px] uppercase tracking-[0.2em] font-light">Manage your private digital world</p>
        </div>
        <div class="w-full glass-card rounded-ios overflow-hidden">
          <div class="flex flex-col md:flex-row min-h-[500px]">
            <div class="w-full md:w-64 border-r border-white/5 bg-black/10 p-6 space-y-1">
              <button class="w-full flex items-center gap-3 px-4 py-3 rounded-ios-inner bg-white/10 text-white text-sm font-medium transition-all">
                <span class="material-symbols-outlined text-[20px]">person</span>
                Personal Info
              </button>
              <button class="w-full flex items-center gap-3 px-4 py-3 rounded-ios-inner text-white/40 hover:bg-white/5 hover:text-white/60 text-sm font-medium transition-all">
                <span class="material-symbols-outlined text-[20px]">lock</span>
                Security
              </button>
              <button class="w-full flex items-center gap-3 px-4 py-3 rounded-ios-inner text-white/40 hover:bg-white/5 hover:text-white/60 text-sm font-medium transition-all">
                <span class="material-symbols-outlined text-[20px]">palette</span>
                Appearance
              </button>
              <button class="w-full flex items-center gap-3 px-4 py-3 rounded-ios-inner text-white/40 hover:bg-white/5 hover:text-white/60 text-sm font-medium transition-all">
                <span class="material-symbols-outlined text-[20px]">notifications_active</span>
                Privacy
              </button>
              <div class="pt-6 mt-6 border-t border-white/5">
                <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 rounded-ios-inner text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
                  <span class="material-symbols-outlined text-[20px]">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
            <div class="flex-1 p-12 lg:p-16">
              <div v-if="user" class="max-w-[480px]">
                <div class="mb-10 flex items-center gap-6">
                  <div class="relative group">
                    <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-profile-primary/30 ring-4 ring-black/10">
                      <img v-if="user.user_metadata.avatar_url" :src="user.user_metadata.avatar_url" alt="Profile" class="w-full h-full object-cover bg-profile-primary/20" />
                      <div v-else class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
                        {{ user.email?.[0].toUpperCase() }}
                      </div>
                    </div>
                    <button class="absolute bottom-0 right-0 bg-profile-primary w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0c0a0f] text-white shadow-lg transform group-hover:scale-110 transition-transform">
                      <span class="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                  </div>
                  <div class="space-y-1">
                    <h3 class="text-xl font-medium text-white">{{ user.user_metadata.full_name || 'User' }}</h3>
                    <p class="text-white/30 text-sm italic">{{ user.email }}</p>
                  </div>
                </div>
                <div class="space-y-8">
                  <div class="space-y-2">
                    <label class="block text-white/40 text-[11px] font-semibold uppercase tracking-widest px-1">Display Name</label>
                    <input class="w-full ios-input rounded-ios-inner h-[52px] px-5 text-white focus:outline-none text-[15px]" type="text" :value="user.user_metadata.full_name || ''" @input="updateName" />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-white/40 text-[11px] font-semibold uppercase tracking-widest px-1">Email Address</label>
                    <input class="w-full ios-input rounded-ios-inner h-[52px] px-5 text-white/50 focus:outline-none text-[15px] cursor-not-allowed" readonly="" type="email" :value="user.email"/>
                    <p class="text-white/20 text-[10px] px-1 italic">Managed via Auth Provider</p>
                  </div>
                  
                  <div class="pt-6 border-t border-white/5 flex gap-4">
                    <button @click="saveProfile" :disabled="saving" class="magic-gradient px-8 h-[48px] rounded-ios-inner text-white font-semibold text-[14px] transition-all active:scale-[0.98] shadow-lg shadow-profile-primary/20 disabled:opacity-50">
                      {{ saving ? 'Saving...' : 'Save Changes' }}
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="flex items-center justify-center h-full">
                <p class="text-white/50">Please log in to view your profile.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div class="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-profile-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="fixed bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import AppNavigation from '../components/AppNavigation.vue'

const router = useRouter()
const user = ref(null)
const newName = ref('')
const saving = ref(false)

const updateName = (e) => {
  newName.value = e.target.value
}

const saveProfile = async () => {
  if (!newName.value) return
  saving.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: newName.value }
    })
    if (error) throw error
    // Refresh user data
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user || null
  } catch (e) {
    console.error('Error updating profile:', e)
  } finally {
    saving.value = false
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null
  if (user.value) {
    newName.value = user.value.user_metadata.full_name || ''
  } else {
    router.push('/login')
  }
})
</script>

<style scoped>
.deep-artistic-bg {
  background-image: linear-gradient(135deg, rgba(12, 10, 15, 0.7), rgba(46, 16, 101, 0.4)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuAxJXM0jdq9tuvBmGHxC-096qKAalgA3eM0vNwsdgQlteghFSC2NNW6IiHhUYuHW9i4dK0tri_7ZB__iCHgcIHsXMXOmJcW-nq4XbsCRALQ5IHemvFjfrcbE0QMkFFv-8jr5stpwdwk6vRtFo8PJZfADQEldgq9tg_kI1qe92kr3FgQ7IPiZrjZm6_dZBwQTx7XYOnBwkhMk7eSHbnqSurEg15QMi24OymzLpaqWFbIthCnMrmGVvr3QWrd3_J6zDWobXl7voouzEY);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-color: #0c0a0f;
}
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
.ios-input {
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}
.ios-input:focus {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 92, 246, 0.4);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.1);
}
.magic-gradient {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  position: relative;
  overflow: hidden;
}
</style>
