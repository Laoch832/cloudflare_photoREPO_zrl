<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="top-bar">
      <div class="nav-left">
        <div class="nav-links">
          <router-link to="/" class="nav-link ripple" active-class="active">首页</router-link>
          <router-link to="/gallery" class="nav-link ripple" active-class="active">图库</router-link>
          <router-link to="/notes" class="nav-link ripple" active-class="active">笔记</router-link>
        </div>
      </div>
      <div class="nav-right">
        <div class="ping-display">{{ pingText }}</div>
        <div class="theme-toggle" @click="toggleTheme">
          <span class="material-icons">{{ themeIcon }}</span>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view />

    <!-- Floating View Counter -->
    <div class="view-counter" id="viewCounter">
      你已经看了她 <span id="viewsCount">{{ views }}</span> 眼了
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Theme management
const theme = ref(localStorage.getItem('theme') || 'light')

// Ping display
const pingText = ref('Ping: --ms')

// View count
const views = ref(0)

// Computed properties
const themeIcon = computed(() => {
  return theme.value === 'light' ? 'dark_mode' : 'light_mode'
})

// Theme toggle
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
  document.documentElement.setAttribute('data-theme', theme.value)
}

// Update ping display
const updatePing = async () => {
  try {
    const start = performance.now()
    await fetch('/cdn-cgi/trace')
    const duration = Math.round(performance.now() - start)
    pingText.value = `Ping: ${duration}ms`
  } catch (error) {
    pingText.value = 'Ping: Timeout'
  }
}

// Fetch views count
const fetchViews = async () => {
  try {
    const response = await fetch('/api/views')
    const data = await response.json()
    views.value = data.views
  } catch (error) {
    console.error('Failed to fetch views:', error)
  }
}

// Initialize app
onMounted(() => {
  // Set initial theme
  document.documentElement.setAttribute('data-theme', theme.value)
  
  // Start ping updates
  updatePing()
  setInterval(updatePing, 30000)
  
  // Fetch views count
  fetchViews()
})
</script>

<style>
/* MD3 Color System (Pink Love) - Light */
:root {
  --md-sys-color-primary: #d32f2f;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #ffdad6;
  --md-sys-color-on-primary-container: #410002;
  
  --md-sys-color-secondary: #c2185b;
  --md-sys-color-on-secondary: #ffffff;
  --md-sys-color-secondary-container: #ffd9e2;
  --md-sys-color-on-secondary-container: #440018;
  
  --md-sys-color-surface: #fdfcff;
  --md-sys-color-on-surface: #1a1c1e;
  --md-sys-color-surface-variant: #dfe2eb;
  --md-sys-color-on-surface-variant: #43474e;
  
  --md-sys-color-outline: #73777f;
  
  /* Elevation & Shapes */
  --md-sys-shape-corner-large: 24px;
  --md-sys-shape-corner-medium: 16px;
  --md-sys-shape-corner-small: 8px;
  
  /* Legacy mapping */
  --bg-color: var(--md-sys-color-surface);
  --text-color: var(--md-sys-color-on-surface);
  --secondary-text: var(--md-sys-color-on-surface-variant);
  --nav-bg: rgba(253, 252, 255, 0.8);
  --card-bg: #fef3f2;
  --accent-color: var(--md-sys-color-primary);
}

[data-theme="dark"] {
  /* MD3 Color System - Dark */
  --md-sys-color-primary: #ffb4ab;
  --md-sys-color-on-primary: #690005;
  --md-sys-color-primary-container: #93000a;
  --md-sys-color-on-primary-container: #ffdad6;
  
  --md-sys-color-secondary: #ff85ab;
  --md-sys-color-on-secondary: #690031;
  --md-sys-color-secondary-container: #930047;
  --md-sys-color-on-secondary-container: #ffd9e2;
  
  --md-sys-color-surface: #1a1c1e;
  --md-sys-color-on-surface: #e2e2e6;
  --md-sys-color-surface-variant: #43474e;
  --md-sys-color-on-surface-variant: #c3c7cf;
  
  --md-sys-color-outline: #8d9199;
  
  /* Legacy mapping */
  --nav-bg: rgba(26, 28, 30, 0.8);
  --card-bg: #2d1f21;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Google Sans', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
  min-height: 100vh;
}

/* --- Navigation --- */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  justify-content: space-between;
  z-index: 100;
  background: var(--nav-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(128,128,128,0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: var(--secondary-text);
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px; /* Pill shape */
  transition: all 0.2s;
}

.nav-link:hover {
  background: rgba(0,0,0,0.05);
  color: var(--text-color);
}

.nav-link.active {
  color: var(--md-sys-color-on-secondary-container);
  background: var(--md-sys-color-secondary-container);
  font-weight: 600;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: var(--secondary-text);
}

.ping-display {
  font-family: monospace;
}

.theme-toggle {
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  transition: all 0.2s;
}

.theme-toggle:hover {
  background: rgba(0,0,0,0.05);
}

/* Floating View Counter */
.view-counter {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  padding: 16px 24px;
  border-radius: var(--md-sys-shape-corner-medium);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-weight: 600;
  font-size: 16px;
  z-index: 1000;
  animation: fadeInUp 0.3s ease-out;
  border: 2px solid var(--md-sys-color-primary);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ripple Effect */
.ripple {
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}
.ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .5s, opacity 1s;
}
.ripple:active:after {
  transform: scale(0, 0);
  opacity: .2;
  transition: 0s;
}

/* Light/Dark specific ripple color adjustments if needed */
[data-theme="dark"] .ripple:after {
  background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
}

/* Make images responsive */
img {
  max-width: 100%;
  height: auto;
}

/* Remove default link styles */
a {
  color: inherit;
  text-decoration: none;
}
</style>
