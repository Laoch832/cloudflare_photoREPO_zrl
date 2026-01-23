<template>
  <div id="app" @contextmenu="handleContextMenu" @keydown="handleKeydown">
    <!-- Sakura Background -->
    <SakuraBackground />
    <MusicPlayer />

    <!-- Navigation -->
    <nav class="navbar" :class="{ 'scrolled': isScrolled, 'navbar-hidden': !showNavbar, 'has-player': currentTrack }">
      <div class="container nav-container">
        
        <!-- User Profile Area (Mobile: Top Right) -->
        <div class="user-area-mobile" v-if="isMobile">
           <md-icon-button class="user-btn-mobile" @click="user ? handleProfileClick() : handleLoginClick()">
              <div v-if="user && user.user_metadata.avatar_url" class="avatar-mobile">
                 <img :src="user.user_metadata.avatar_url" alt="User Avatar" />
              </div>
              <div v-else-if="user" class="avatar-text-mobile">
                 {{ user.email[0].toUpperCase() }}
              </div>
              <md-icon v-else>account_circle</md-icon>
           </md-icon-button>
        </div>

        <!-- User Profile Area (Desktop: Left) -->
        <div class="user-area" v-else>
          <transition name="user-expand" mode="out-in">
            <!-- Loading State -->
            <div v-if="isAuthLoading" class="user-loading" key="loading">
              <svg class="spinner" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
              </svg>
            </div>
            
            <!-- Logged In State -->
            <div v-else-if="user" class="user-profile expanded anim-squash" key="profile" @click="handleProfileClick">
              <div class="avatar">
                <img v-if="user.user_metadata.avatar_url" :src="user.user_metadata.avatar_url" class="avatar-img-small">
                <span v-else>{{ user.email[0].toUpperCase() }}</span>
              </div>
              <span class="username">{{ user.user_metadata.full_name || user.email.split('@')[0] }}</span>
            </div>

            <!-- Guest State -->
            <div v-else class="user-profile guest anim-squash" key="guest" @click="handleLoginClick">
              <span class="material-icons">person</span>
            </div>
          </transition>
        </div>

        <router-link :to="user ? '/' : '/music'" class="nav-logo cursive anim-pulse" :class="{ 'sensitive-blur': !user }">暗恋日记</router-link>
        
        <!-- Desktop Nav Links -->
        <div class="nav-links" v-if="!isMobile">
          <template v-if="user">
            <router-link to="/" class="nav-link anim-hover-lift" active-class="active">
              <span class="material-icons">home</span> 首页
            </router-link>
            <router-link to="/gallery" class="nav-link anim-hover-lift" active-class="active">
              <span class="material-icons">photo_library</span> 珍藏
            </router-link>
            <router-link to="/notes" class="nav-link anim-hover-lift" active-class="active">
              <span class="material-icons">favorite</span> 心事
            </router-link>
            <router-link to="/diary" class="nav-link anim-hover-lift" active-class="active">
              <span class="material-icons">auto_stories</span> 日记
            </router-link>
          </template>
          <router-link to="/music" class="nav-link anim-hover-lift" active-class="active">
            <span class="material-icons">library_music</span> 音乐
          </router-link>
        </div>

        <div class="nav-actions">
          <button class="theme-btn anim-squash" @click="toggleTheme" title="切换主题">
            <span class="material-icons">{{ themeIcon }}</span>
          </button>
        </div>
      </div>
    </nav>
    
    <!-- Mobile Bottom Navigation (Material Web) -->
    <div class="mobile-nav-container" v-if="isMobile">
        <md-navigation-bar :activeIndex="activeTabIndex">
            <template v-if="user">
                <md-navigation-tab label="首页" @click="router.push('/')" :active="route.path === '/'">
                    <md-icon slot="activeIcon">home</md-icon>
                    <md-icon slot="inactiveIcon">home</md-icon>
                </md-navigation-tab>
                <md-navigation-tab label="珍藏" @click="router.push('/gallery')" :active="route.path === '/gallery'">
                    <md-icon slot="activeIcon">photo_library</md-icon>
                    <md-icon slot="inactiveIcon">photo_library</md-icon>
                </md-navigation-tab>
                <md-navigation-tab label="心事" @click="router.push('/notes')" :active="route.path === '/notes'">
                    <md-icon slot="activeIcon">favorite</md-icon>
                    <md-icon slot="inactiveIcon">favorite</md-icon>
                </md-navigation-tab>
                 <md-navigation-tab label="日记" @click="router.push('/diary')" :active="route.path === '/diary'">
                    <md-icon slot="activeIcon">auto_stories</md-icon>
                    <md-icon slot="inactiveIcon">auto_stories</md-icon>
                </md-navigation-tab>
            </template>
            <md-navigation-tab label="音乐" @click="router.push('/music')" :active="route.path === '/music'">
                <md-icon slot="activeIcon">library_music</md-icon>
                <md-icon slot="inactiveIcon">library_music</md-icon>
            </md-navigation-tab>
        </md-navigation-bar>
    </div>

    <AuthModal 
      :is-open="showAuthModal" 
      @close="showAuthModal = false"
      @success="handleLoginSuccess"
    />

    <!-- Main Content -->
    <main class="main-content" :style="{ paddingTop: currentTrack ? '144px' : '80px', paddingBottom: isMobile ? '80px' : '0' }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="footer" :style="{ marginBottom: isMobile ? '80px' : '0' }">
      <div class="container" :class="{ 'sensitive-blur': !user }">
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
import { useMusic } from './composables/useMusic' // Import useMusic

import AuthModal from './components/AuthModal.vue'

import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Theme management
const theme = ref(localStorage.getItem('theme') || 'light')
const isScrolled = ref(false)
const showNavbar = ref(true)
const lastScrollTop = ref(0)
const views = ref(0)
const user = ref(null)
const showAuthModal = ref(false)
const isAuthLoading = ref(false) // For the "circle" loading state
const isMobile = ref(false)

const { currentTrack } = useMusic() // Get currentTrack

// Calculate days (Same logic as Home, for footer consistency)
const days = computed(() => {
  if (!user.value) return 0 // Hide sensitive data if not logged in
  const startDate = new Date('2024-10-01') 
  const today = new Date()
  const diffTime = Math.abs(today - startDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Computed properties
const themeIcon = computed(() => {
  return theme.value === 'light' ? 'dark_mode' : 'light_mode'
})

const activeTabIndex = computed(() => {
    const path = route.path
    if (path === '/') return 0
    if (path === '/gallery') return 1
    if (path === '/notes') return 2
    if (path === '/diary') return 3
    if (path === '/music') return user.value ? 4 : 0 // If not logged in, music is 0
    return 0
})

// Check mobile
const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
}

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
  if (!user.value) return // Prevent fetching if not logged in
  
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
  
  // Refresh sensitive data
  fetchViews()
}

const handleProfileClick = () => {
  router.push('/profile')
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  user.value = null
}

// Anti-inspection (Best effort)
const handleContextMenu = (e) => {
  if (!user.value) {
    e.preventDefault()
  }
}

const handleKeydown = (e) => {
  if (!user.value) {
    if (
      e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && e.key === 'I') || 
      (e.ctrlKey && e.shiftKey && e.key === 'J') || 
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault()
    }
  }
}

watch(user, (newUser) => {
  if (newUser) {
    document.title = '暗恋日记'
  } else {
    document.title = 'Music Player'
    views.value = 0
  }
}, { immediate: true })

onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', checkMobile)
  checkMobile()
  
  // Auth check
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user ?? null
    if (user.value) {
      fetchViews()
    }
  })

  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user ?? null
    if (user.value) {
      fetchViews()
    } else {
      views.value = 0
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* Sensitive Data Blur */
.sensitive-blur {
  filter: blur(8px);
  user-select: none;
  pointer-events: none;
  opacity: 0.6;
}

/* --- VitePress Style Navbar --- */
.VPNav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--vp-nav-height);
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--vp-c-divider);
  z-index: 1000;
  transition: transform 0.3s ease;
}

[data-theme="dark"] .VPNav {
  background-color: rgba(30, 30, 30, 0.7);
}

.VPNav.has-player {
    top: 0; /* VitePress header stays top */
}

.VPNav.navbar-hidden {
    transform: translateY(-100%);
}

.VPNavBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 24px;
}

/* Title / Logo */
.VPNavBarTitle {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 20px;
}

.logo-text {
    color: var(--vp-c-text-1);
    font-size: 22px;
}

/* Menu (Desktop) */
.VPNavBarMenu {
    display: flex;
    gap: 24px;
    align-items: center;
}

.VPLink {
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-1);
    transition: color 0.25s;
    position: relative;
}

.VPLink:hover, .VPLink.active {
    color: var(--vp-c-brand-1);
}

.VPLink.active::after {
    content: '';
    position: absolute;
    bottom: -22px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--vp-c-brand-1);
}

/* Actions */
.VPNavBarActions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.VPSwitchAppearance {
    background: transparent;
    border: none;
    color: var(--vp-c-text-2);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.25s;
}

.VPSwitchAppearance:hover {
    color: var(--vp-c-text-1);
    background-color: var(--gray-100);
}

[data-theme="dark"] .VPSwitchAppearance:hover {
    background-color: var(--gray-300);
}

/* User Profile Styles */
.user-avatar-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--vp-c-brand-1);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
}

.user-avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.login-btn-text {
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-1);
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 20px;
    transition: background 0.2s;
}

.login-btn-text:hover {
    background-color: var(--gray-100);
}

.user-avatar-mini {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vp-c-brand-1);
    color: white;
    font-size: 12px;
}
.user-avatar-mini img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Mobile Overrides */
@media (max-width: 768px) {
    .VPNavBar {
        padding: 0 16px;
    }
    .VPNavBarMenu {
        display: none;
    }
}

.main-content {
  min-height: calc(100vh - 100px);
  transition: padding-top 0.3s ease;
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

/* Mobile Specifics */
.mobile-nav-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    /* M3 Navigation Bar override */
    --md-navigation-bar-container-color: rgba(255, 255, 255, 0.96);
    --md-navigation-tab-active-indicator-color: var(--secondary-container, #e8def8);
    --md-navigation-tab-active-icon-color: var(--on-secondary-container, #1d192b);
    --md-sys-color-surface: rgba(255, 255, 255, 0.96); /* Trick to set background */
}

[data-theme="dark"] .mobile-nav-container {
    --md-navigation-bar-container-color: #1e1e1e;
    --md-sys-color-surface: #1e1e1e;
    --md-navigation-tab-active-indicator-color: #4a4458;
    --md-navigation-tab-active-icon-color: #e8def8;
}

@media (max-width: 768px) {
  .nav-logo {
    font-size: 22px;
  }
  
  .nav-actions {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
  }
}
</style>
