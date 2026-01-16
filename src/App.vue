<template>
  <div id="app">
    <!-- Sakura Background -->
    <SakuraBackground />

    <!-- Navigation -->
    <nav class="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="container nav-container">
        <router-link to="/" class="nav-logo cursive">
          <span class="logo-text">暗恋日记</span>
        </router-link>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link" active-class="active">
            <span class="material-icons">home</span> 首页
          </router-link>
          <router-link to="/gallery" class="nav-link" active-class="active">
            <span class="material-icons">photo_library</span> 珍藏
          </router-link>
          <router-link to="/notes" class="nav-link" active-class="active">
            <span class="material-icons">favorite</span> 札记
          </router-link>
        </div>

        <div class="nav-actions">
          <button class="theme-btn" @click="toggleTheme" title="切换主题">
            <span class="material-icons">{{ themeIcon }}</span>
          </button>
        </div>
      </div>
    </nav>

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
        <p class="cursive footer-text">愿所有的暗恋，都能窥见天光</p>
        <p class="views-count">我已经在心里偷偷想了她 {{ views }} 次</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import SakuraBackground from './components/SakuraBackground.vue'

// Theme management
const theme = ref(localStorage.getItem('theme') || 'light')
const isScrolled = ref(false)
const views = ref(0)

// Computed properties
const themeIcon = computed(() => {
  return theme.value === 'light' ? 'dark_mode' : 'light_mode'
})

// Scroll handler
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
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

onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  window.addEventListener('scroll', handleScroll)
  fetchViews()
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 12px 0;
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid rgba(255, 204, 213, 0.3);
}

[data-theme="dark"] .navbar.scrolled {
  background: rgba(43, 10, 18, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 26px;
  font-weight: bold;
  color: var(--primary-dark);
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-text {
  background: linear-gradient(120deg, var(--primary-dark), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;
}

.nav-logo:hover .logo-text {
  transform: scale(1.05);
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  gap: 16px;
  background: rgba(255, 255, 255, 0.6);
  padding: 6px 12px;
  border-radius: 50px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  transition: all 0.3s ease;
}

.navbar.scrolled .nav-links {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

[data-theme="dark"] .nav-links {
  background: rgba(0, 0, 0, 0.3);
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary-color);
  opacity: 0;
  transform: scale(0.8);
  border-radius: 20px;
  transition: all 0.3s ease;
  z-index: -1;
}

.nav-link:hover {
  color: white;
}

.nav-link:hover::before {
  opacity: 1;
  transform: scale(1);
}

.nav-link.active {
  color: white;
  background: var(--primary-color);
  box-shadow: 0 4px 10px rgba(255, 77, 109, 0.3);
}

.nav-link .material-icons {
  font-size: 18px;
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
  transform: rotate(30deg);
}

.main-content {
  padding-top: 80px;
  min-height: calc(100vh - 100px);
}

.footer {
  text-align: center;
  padding: 60px 0 40px;
  color: var(--text-light);
  margin-top: 40px;
  position: relative;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  opacity: 0.5;
}

.footer-text {
  font-size: 24px;
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.views-count {
  font-size: 12px;
  opacity: 0.7;
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
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  
  [data-theme="dark"] .nav-links {
    background: rgba(43, 10, 18, 0.95);
  }
  
  .nav-link {
    flex-direction: column;
    padding: 6px 12px;
    font-size: 12px;
    gap: 2px;
    background: transparent !important;
    box-shadow: none !important;
    color: var(--text-light) !important;
  }

  .nav-link.active {
    color: var(--primary-dark) !important;
  }

  .nav-link.active .material-icons {
    color: var(--primary-dark);
  }
  
  .nav-link .material-icons {
    font-size: 24px;
    margin-bottom: 2px;
    transition: color 0.3s;
  }

  .nav-link:hover::before {
    display: none;
  }
}
</style>