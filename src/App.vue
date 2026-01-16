<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="container nav-container">
        <router-link to="/" class="nav-logo cursive">Our Love Story</router-link>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link" active-class="active">
            <span class="material-icons">home</span> 首页
          </router-link>
          <router-link to="/gallery" class="nav-link" active-class="active">
            <span class="material-icons">photo_library</span> 图库
          </router-link>
          <router-link to="/notes" class="nav-link" active-class="active">
            <span class="material-icons">favorite</span> 笔记
          </router-link>
        </div>

        <div class="nav-actions">
          <button class="theme-btn" @click="toggleTheme" title="Toggle Theme">
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
        <p class="cursive footer-text">Made with <span class="heart">❤</span> for Her</p>
        <p class="views-count">我们已经看了她 {{ views }} 次</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

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
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 12px 0;
  box-shadow: var(--shadow-sm);
}

[data-theme="dark"] .navbar.scrolled {
  background: rgba(43, 10, 18, 0.8);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-dark);
}

.nav-links {
  display: flex;
  gap: 30px;
  background: rgba(255, 255, 255, 0.5);
  padding: 8px 24px;
  border-radius: 50px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
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
  transition: all 0.3s ease;
}

.nav-link .material-icons {
  font-size: 18px;
}

.nav-link:hover, .nav-link.active {
  background: var(--primary-color);
  color: white;
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
}

.footer-text {
  font-size: 24px;
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
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
    background: rgba(255, 255, 255, 0.9);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
  }
  
  [data-theme="dark"] .nav-links {
    background: rgba(43, 10, 18, 0.9);
  }
  
  .nav-link span {
    font-size: 24px;
  }
  
  /* Hide text on mobile for bottom nav */
  .nav-link {
    font-size: 0;
    padding: 10px;
  }
  
  .nav-link .material-icons {
    font-size: 24px;
    margin: 0;
  }
}
</style>