<template>
  <div id="app">
    <!-- Sakura Background -->
    <SakuraBackground />
    <MusicPlayer />

    <!-- Navigation -->
    <nav class="navbar" :class="{ 'scrolled': isScrolled, 'navbar-hidden': !showNavbar }">
      <div class="container nav-container">
        
        <!-- User Profile Area (Left) -->
        <div class="user-area">
          <transition name="user-expand" mode="out-in">
            <!-- Loading State -->
            <div v-if="isAuthLoading" class="user-loading" key="loading">
              <svg class="spinner" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
              </svg>
            </div>
            
            <!-- Logged In State -->
            <div v-else-if="user" class="user-profile expanded" key="profile" @click="handleProfileClick">
              <div class="avatar">
                <img v-if="user.user_metadata.avatar_url" :src="user.user_metadata.avatar_url" class="avatar-img-small">
                <span v-else>{{ user.email[0].toUpperCase() }}</span>
              </div>
              <span class="username">{{ user.user_metadata.full_name || user.email.split('@')[0] }}</span>
            </div>

            <!-- Guest State -->
            <div v-else class="user-profile guest" key="guest" @click="handleLoginClick">
              <span class="material-icons">person</span>
            </div>
          </transition>
        </div>

        <router-link to="/" class="nav-logo cursive">暗恋日记</router-link>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link" active-class="active">
            <span class="material-icons">home</span> 首页
          </router-link>
          <router-link to="/gallery" class="nav-link" active-class="active">
            <span class="material-icons">photo_library</span> 珍藏
          </router-link>
          <router-link to="/notes" class="nav-link" active-class="active">
            <span class="material-icons">favorite</span> 心事
          </router-link>
          <router-link to="/diary" class="nav-link" active-class="active">
            <span class="material-icons">auto_stories</span> 日记
          </router-link>
          <router-link to="/music" class="nav-link" active-class="active">
            <span class="material-icons">library_music</span> 音乐
          </router-link>
        </div>

        <div class="nav-actions">
          <button class="theme-btn" @click="toggleTheme" title="切换主题">
            <span class="material-icons">{{ themeIcon }}</span>
          </button>
        </div>
      </div>
    </nav>

    <AuthModal 
      :is-open="showAuthModal" 
      @close="showAuthModal = false"
      @success="handleLoginSuccess"
    />

    <!-- Main Content -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p class="cursive footer-text">默默守护 <span class="heart">❤</span> 她的第 {{ days }} 天</p>
        <p class="views-count">想念了她 {{ views }} 次</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import SakuraBackground from './components/SakuraBackground.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import { supabase } from './lib/supabase'

import AuthModal from './components/AuthModal.vue'

import { useRouter } from 'vue-router'

const router = useRouter()
// Theme management
const theme = ref(localStorage.getItem('theme') || 'light')
const isScrolled = ref(false)
const showNavbar = ref(true)
const lastScrollTop = ref(0)
const views = ref(0)
const user = ref(null)
const showAuthModal = ref(false)
const isAuthLoading = ref(false) // For the "circle" loading state

// Calculate days (Same logic as Home, for footer consistency)
const days = computed(() => {
  const startDate = new Date('2024-10-01') 
  const today = new Date()
  const diffTime = Math.abs(today - startDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Computed properties
const themeIcon = computed(() => {
  return theme.value === 'light' ? 'dark_mode' : 'light_mode'
})

// Scroll handler
const handleScroll = () => {
  const currentScroll = window.scrollY
  isScrolled.value = currentScroll > 20
  
  // Navbar hide/show logic
  if (currentScroll > lastScrollTop.value && currentScroll > 100) {
    showNavbar.value = false
  } else {
    showNavbar.value = true
  }
  lastScrollTop.value = currentScroll
}

// Theme toggle
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
  document.documentElement.setAttribute('data-theme', theme.value)
}

// Fetch views count
const fetchViews = async () => {
  try {
    const response = await fetch('/api/view-count')
    const data = await response.json()
    views.value = data.count
  } catch (error) {
    console.error('Failed to fetch views:', error)
    views.value = parseInt(localStorage.getItem('local_views')) || 0
  }
}

const handleLoginClick = () => {
  if (!user.value) {
    showAuthModal.value = true
  }
}

const handleLoginSuccess = (userData) => {
  user.value = userData
  // Save to local storage for "account chooser" persistence
  const savedAccounts = JSON.parse(localStorage.getItem('saved_accounts') || '[]')
  const accountInfo = {
    email: userData.email,
    avatar_url: userData.user_metadata?.avatar_url,
    full_name: userData.user_metadata?.full_name,
    last_login: new Date().toISOString()
  }
  
  // Remove existing entry if any (to update it)
  const filtered = savedAccounts.filter(acc => acc.email !== userData.email)
  filtered.unshift(accountInfo) // Add to top
  localStorage.setItem('saved_accounts', JSON.stringify(filtered))

  // Trigger loading animation
  isAuthLoading.value = true
  setTimeout(() => {
    isAuthLoading.value = false
  }, 1500)
}

const handleProfileClick = () => {
  router.push('/profile')
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  user.value = null
}

onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  window.addEventListener('scroll', handleScroll)
  fetchViews()

  // Auth check
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user ?? null
  })

  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user ?? null
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 0;
  z-index: 1000;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.navbar.navbar-hidden {
  transform: translateY(-100%);
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 12px 0;
  box-shadow: var(--shadow-sm);
}

[data-theme="dark"] .navbar.scrolled {
  background: rgba(43, 10, 18, 0.85);
}

/* User Profile Area */
.user-area {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;
}

@media (max-width: 768px) {
  .user-area {
    left: 16px;
  }
}

.user-profile {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  height: 40px;
}

[data-theme="dark"] .user-profile {
  background: #202124;
  color: white;
}

.user-profile.guest {
  width: 40px;
  justify-content: center;
}

.user-profile.expanded {
  padding: 0 16px 0 4px;
  gap: 10px;
  min-width: 120px;
}

.user-profile:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.avatar {
  width: 32px;
  height: 32px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  overflow: hidden; /* Ensure image fits */
}

.avatar-img-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

/* Loading Spinner */
.user-loading {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

[data-theme="dark"] .user-loading {
  background: #202124;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 24px;
  height: 24px;
}

.path {
  stroke: var(--primary-color);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

/* Transition for User Profile */
.user-expand-enter-active,
.user-expand-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); /* Smoother bounce */
  overflow: hidden; /* Hide content during width change */
}

.user-expand-enter-from,
.user-expand-leave-to {
  width: 40px; /* Start/End width same as collapsed/loading */
  min-width: 40px;
  padding: 0;
  opacity: 0;
}

.nav-container {
  display: flex;
  justify-content: center; /* Center logo */
  align-items: center;
  position: relative; /* For absolute positioning of user-area */
}

.nav-logo {
  font-size: 26px;
  font-weight: bold;
  color: var(--primary-dark);
  text-shadow: 0 2px 4px rgba(255, 77, 109, 0.1);
  text-decoration: none; /* Ensure no underline */
}

.nav-links {
  display: flex;
  gap: 16px;
  background: rgba(255, 255, 255, 0.6);
  padding: 6px 12px;
  border-radius: 50px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

[data-theme="dark"] .nav-links {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-main);
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.nav-link .material-icons {
  font-size: 18px;
}

.nav-link:hover, .nav-link.active {
  background: var(--primary-color);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 77, 109, 0.3);
}

.theme-btn {
  background: transparent;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.theme-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--primary-dark);
  transform: rotate(15deg);
}

.main-content {
  padding-top: 80px;
  min-height: calc(100vh - 100px);
}

.footer {
  text-align: center;
  padding: 40px 0;
  color: var(--text-light);
  margin-top: 60px;
  position: relative;
  z-index: 1;
}

.footer-text {
  font-size: 20px;
  margin-bottom: 8px;
}

.heart {
  color: var(--primary-dark);
  animation: heartbeat 1.5s infinite;
  display: inline-block;
}

.views-count {
  font-size: 12px;
  opacity: 0.7;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .nav-logo {
    font-size: 22px;
  }
  
  .nav-links {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%; /* Make it wider */
    max-width: 400px;
    gap: 0; /* Distribute evenly */
    padding: 0 16px;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    z-index: 900; /* Lower than MusicPlayer */
    height: 60px;
    border-radius: 30px;
    display: flex;
  }
  
  [data-theme="dark"] .nav-links {
    background: rgba(43, 10, 18, 0.95);
  }
  
  .nav-link {
    font-size: 0; /* Hide text */
    padding: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .nav-link .material-icons {
    font-size: 26px;
    margin: 0;
  }

  .nav-link:hover, .nav-link.active {
    background: transparent;
    color: var(--primary-color);
    transform: translateY(0);
    box-shadow: none;
  }
  
  /* Add indicator for active state if needed, or just color */
  .nav-link.active .material-icons {
    transform: scale(1.2);
    transition: transform 0.2s;
  }
}
</style>